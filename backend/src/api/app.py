"""Main FastAPI application for DeepMarker backend."""

import os
import sys
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse

# Fix for Windows event loop policy
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from src.db.checkpoints import CheckpointerManager
from src.db.database import DatabaseManager
from src.api.data_processing import router as data_processing_router
from src.api.query import router as query_router
from src.api.models import ErrorResponse

import logging
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the application's lifespan. This is the recommended way to manage
    resources that need to be initialized on startup and cleaned up on shutdown.
    """
    # Get the database URL from environment variables
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set")

    try:
        # Initialize the async checkpointer
        await CheckpointerManager.initialize(DATABASE_URL)
        logger.info("Async checkpointer initialized successfully")
        
        # Initialize database manager
        await DatabaseManager.initialize(DATABASE_URL)
        logger.info("Database manager initialized successfully")
        
        # Create DeepMarker database tables and views if they don't exist
        await _create_deepmarker_tables()
        logger.info("DeepMarker database tables and views checked/created successfully")
        
        # Get the checkpointer instance
        checkpointer = await CheckpointerManager.get_checkpointer()
        
        # Store checkpointer in app state for future use
        app.state.checkpointer = checkpointer
        logger.info("Successfully initialized database connections.")
        
        yield
        
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise
    finally:
        # Clean up resources on shutdown
        await CheckpointerManager.close()
        await DatabaseManager.close()
    logger.info("Application shutdown: database resources released.")


# Create FastAPI app
app = FastAPI(
    title="DeepMarker API",
    description="Backend API for DeepMarker Cell Marker Database",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(data_processing_router)
app.include_router(query_router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions."""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            code=500,
            message="Internal Server Error",
            detail=str(exc),
        ).model_dump(),
    )


@app.get("/")
async def root():
    """Root endpoint to check if API is running."""
    return {"message": "DeepMarker API is running"}


@app.get("/download/{filename}")
async def download_file(filename: str):
    """Download static files from resources directory."""
    # Define the resources directory path
    resources_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "resources")
    resources_dir = os.path.abspath(resources_dir)
    
    # Define allowed files for security
    allowed_files = {
        "deepmarker.xlsx": "DeepMarker Complete Dataset",
        "pmid_with_dates.xlsx": "Publication Metadata"
    }
    
    if filename not in allowed_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = os.path.join(resources_dir, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Return the file as a download response
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )


async def _create_deepmarker_tables():
    """
    Create DeepMarker database tables if they don't exist.
    This function is called during application startup.
    """
    pool = await DatabaseManager.get_pool()
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            # Create publications table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS publications (
                    id SERIAL PRIMARY KEY,
                    pmid BIGINT UNIQUE NOT NULL,
                    publication_year INTEGER,
                    publication_month TEXT,
                    title TEXT,
                    authors TEXT,
                    journal TEXT,
                    doi TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE publications ENABLE ROW LEVEL SECURITY")
            
            # Create species table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS species (
                    id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    latin_name TEXT,
                    common_name TEXT,
                    taxonomy_id INTEGER,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE species ENABLE ROW LEVEL SECURITY")
            
            # Create tissue_types table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS tissue_types (
                    id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    description TEXT,
                    parent_id INTEGER REFERENCES tissue_types(id),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE tissue_types ENABLE ROW LEVEL SECURITY")
            
            # Create cell_types table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS cell_types (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    category TEXT,
                    parent_id INTEGER REFERENCES cell_types(id),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(name, category)
                )
            """)
            await cur.execute("ALTER TABLE cell_types ENABLE ROW LEVEL SECURITY")
            
            # Create markers table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS markers (
                    id SERIAL PRIMARY KEY,
                    symbol TEXT UNIQUE NOT NULL,
                    full_name TEXT,
                    gene_id INTEGER,
                    aliases TEXT[],
                    marker_type TEXT,
                    description TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE markers ENABLE ROW LEVEL SECURITY")
            
            # Create cell_markers table (main relationship table)
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS cell_markers (
                    id SERIAL PRIMARY KEY,
                    species_id INTEGER NOT NULL REFERENCES species(id),
                    tissue_type_id INTEGER NOT NULL REFERENCES tissue_types(id),
                    cell_type_id INTEGER NOT NULL REFERENCES cell_types(id),
                    marker_id INTEGER NOT NULL REFERENCES markers(id),
                    publication_id INTEGER NOT NULL REFERENCES publications(id),
                    expression_level TEXT,
                    confidence_score DECIMAL(3,2),
                    validation_method TEXT,
                    notes TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE cell_markers ENABLE ROW LEVEL SECURITY")
            
            # Create data_sources table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS data_sources (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    version TEXT,
                    url TEXT,
                    description TEXT,
                    import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY")
            
            # Create audit_logs table
            await cur.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id SERIAL PRIMARY KEY,
                    table_name TEXT NOT NULL,
                    record_id INTEGER NOT NULL,
                    operation TEXT NOT NULL,
                    old_values JSONB,
                    new_values JSONB,
                    user_id TEXT,
                    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """)
            await cur.execute("ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY")
            
            # Create indexes
            await _create_deepmarker_indexes(cur)
            
            # Insert initial species data
            await _insert_initial_data(cur)
            
            # Create database views
            await _create_deepmarker_views(cur)
            
            # Create RLS policies
            await _create_rls_policies(cur)
            
            # Commit all changes
            await conn.commit()
            
        logger.info("DeepMarker database tables, indexes, views, and RLS policies created successfully")


async def _create_deepmarker_indexes(cur):
    """Create indexes for DeepMarker tables."""
    # Publications indexes
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_publications_pmid ON publications(pmid)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(publication_year)")
    
    # Species indexes
    await cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_species_name ON species(name)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_species_taxonomy_id ON species(taxonomy_id)")
    
    # Tissue types indexes
    await cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_tissue_types_name ON tissue_types(name)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_tissue_types_parent_id ON tissue_types(parent_id)")
    
    # Cell types indexes
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_types_name ON cell_types(name)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_types_category ON cell_types(category)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_types_parent_id ON cell_types(parent_id)")
    
    # Markers indexes
    await cur.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_markers_symbol ON markers(symbol)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_markers_gene_id ON markers(gene_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_markers_type ON markers(marker_type)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_markers_aliases ON markers USING GIN(aliases)")
    
    # Cell markers indexes (for query optimization)
    await cur.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_cell_markers_unique ON cell_markers(
            species_id, tissue_type_id, cell_type_id, marker_id, publication_id
        )
    """)
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_species ON cell_markers(species_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_tissue ON cell_markers(tissue_type_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_cell_type ON cell_markers(cell_type_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_marker ON cell_markers(marker_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_publication ON cell_markers(publication_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_cell_markers_expression ON cell_markers(expression_level)")
    
    # Audit logs indexes
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)")


async def _insert_initial_data(cur):
    """Insert initial species data if not exists."""
    initial_species = [
        ('Human', 'Homo sapiens', 'Human'),
        ('Mouse', 'Mus musculus', 'Mouse'),
        ('Rat', 'Rattus norvegicus', 'Rat')
    ]
    
    for name, latin_name, common_name in initial_species:
        await cur.execute("""
            INSERT INTO species (name, latin_name, common_name) 
            VALUES (%s, %s, %s) 
            ON CONFLICT (name) DO NOTHING
        """, (name, latin_name, common_name))


async def _create_deepmarker_views(cur):
    """Create database views for DeepMarker."""
    # Create complete cell marker details view
    await cur.execute("""
        CREATE OR REPLACE VIEW v_cell_marker_details AS
        SELECT 
            cm.id,
            s.name as species_name,
            tt.name as tissue_type,
            ct.name as cell_type,
            m.symbol as marker_symbol,
            m.full_name as marker_full_name,
            cm.expression_level,
            cm.confidence_score,
            cm.validation_method,
            p.pmid,
            p.publication_year,
            p.publication_month,
            p.title as publication_title,
            cm.created_at
        FROM cell_markers cm
        JOIN species s ON cm.species_id = s.id
        JOIN tissue_types tt ON cm.tissue_type_id = tt.id
        JOIN cell_types ct ON cm.cell_type_id = ct.id
        JOIN markers m ON cm.marker_id = m.id
        JOIN publications p ON cm.publication_id = p.id
    """)
    
    # Enable RLS on the view (PostgreSQL applies RLS to underlying tables automatically)
    await cur.execute("ALTER VIEW v_cell_marker_details OWNER TO CURRENT_USER")
    
    # Create species statistics view
    await cur.execute("""
        CREATE OR REPLACE VIEW v_species_stats AS
        SELECT 
            s.name as species_name,
            COUNT(DISTINCT cm.marker_id) as marker_count,
            COUNT(DISTINCT cm.cell_type_id) as cell_type_count,
            COUNT(DISTINCT cm.tissue_type_id) as tissue_type_count,
            COUNT(DISTINCT cm.publication_id) as publication_count
        FROM species s
        LEFT JOIN cell_markers cm ON s.id = cm.species_id
        GROUP BY s.id, s.name
    """)
    
    # Enable RLS on the view
    await cur.execute("ALTER VIEW v_species_stats OWNER TO CURRENT_USER")
    
    # Create yearly publication statistics view
    await cur.execute("""
        CREATE OR REPLACE VIEW v_publication_yearly_stats AS
        SELECT 
            publication_year,
            COUNT(*) as publication_count,
            COUNT(DISTINCT cm.marker_id) as unique_markers,
            COUNT(DISTINCT cm.cell_type_id) as unique_cell_types
        FROM publications p
        LEFT JOIN cell_markers cm ON p.id = cm.publication_id
        WHERE publication_year IS NOT NULL
        GROUP BY publication_year
        ORDER BY publication_year DESC
    """)
    
    # Enable RLS on the view
    await cur.execute("ALTER VIEW v_publication_yearly_stats OWNER TO CURRENT_USER")


async def _create_rls_policies(cur):
    """Create RLS policies for DeepMarker tables."""
    
    # Helper function to create policy if not exists
    async def create_policy_if_not_exists(table_name, policy_name):
        # Check if policy exists
        await cur.execute("""
            SELECT 1 FROM pg_policies 
            WHERE tablename = %s AND policyname = %s
        """, (table_name, policy_name))
        
        if not await cur.fetchone():
            await cur.execute(f"""
                CREATE POLICY "{policy_name}"
                ON "public"."{table_name}"
                AS PERMISSIVE
                FOR ALL
                TO public
                USING (true)
                WITH CHECK (true)
            """)
    
    # Create policies for all our tables
    tables = [
        "publications",
        "species", 
        "tissue_types",
        "cell_types",
        "markers",
        "cell_markers",
        "data_sources",
        "audit_logs"
    ]
    
    for table in tables:
        policy_name = f"public_read_{table}"
        await create_policy_if_not_exists(table, policy_name) 