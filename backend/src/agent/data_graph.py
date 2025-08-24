"""
Data processing graph for CellMarker operations.
TODO: Implement CellMarker specific data processing workflows
"""

import logging

logger = logging.getLogger(__name__)

# TODO: Implement CellMarker data processing graph

async def build_data_processing_graph(checkpointer=None):
    """
    Build and compile CellMarker data processing graph.
    
    Args:
        checkpointer: Optional checkpoint manager
        
    Returns:
        Compiled data processing graph
    """
    # TODO: Implement CellMarker data processing graph
    return None

import os
import json
import logging
from typing import Dict, Any, List, Optional
from pathlib import Path

from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig

from src.agent.state import DataProcessingState
from src.db.database import DatabaseManager

logger = logging.getLogger(__name__)


async def process_json_data(state: DataProcessingState, config: RunnableConfig) -> DataProcessingState:
    """
    Process JSON data and extract structured information for database storage.
    
    Args:
        state: Current graph state containing the JSON file path
        config: Configuration for the runnable
        
    Returns:
        Updated state with extracted data
    """
    logger.info("[DataGraph] Start process_json_data")
    try:
        # Get JSON file path from config
        configurable = config.get("configurable", {})
        json_file_path = configurable.get("json_file_path")
        
        if not json_file_path:
            return {
                **state,
                "processing_status": "error",
                "error_message": "JSON file path not provided in config"
            }
        
        # Read and parse JSON file
        json_path = Path(json_file_path)
        if not json_path.exists():
            return {
                **state,
                "processing_status": "error", 
                "error_message": f"JSON file not found: {json_file_path}"
            }
        
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Extract data from JSON structure
        metadata = data.get("metadata", {})
        doc_id = metadata.get("doc_id")
        
        if not doc_id:
            return {
                **state,
                "processing_status": "error",
                "error_message": "Document ID not found in metadata"
            }
        
        # Extract sections, chunks, and references
        sections = data.get("sections", [])
        chunks = data.get("chunks", [])
        doc_references = data.get("doc_references", [])
        
        logger.info(f"[DataGraph] process_json_data: Processed doc_id={doc_id}, sections={len(sections)}, chunks={len(chunks)}, refs={len(doc_references)}")
        
        return {
            **state,
            "doc_id": doc_id,
            "metadata": metadata,
            "sections": sections,
            "chunks": chunks,
            "doc_references": doc_references,
            "processing_status": "processed",
            "error_message": ""
        }
        
    except Exception as e:
        logger.error(f"[DataGraph] process_json_data: Error - {str(e)}")
        return {
            **state,
            "processing_status": "error",
            "error_message": f"JSON processing error: {str(e)}"
        }


async def create_database_tables(state: DataProcessingState, config: RunnableConfig) -> DataProcessingState:
    """
    Create database tables if they don't exist and insert processed data.
    
    Args:
        state: Current graph state containing processed data
        config: Configuration for the runnable
        
    Returns:
        Updated state with database operation results
    """
    logger.info("[DataGraph] Start create_database_tables")
    try:
        # Check if data was processed successfully
        if state.get("processing_status") != "processed":
            return {
                **state,
                "processing_status": "error",
                "error_message": "Data not processed successfully"
            }
        
        # Initialize database connection
        db_uri = os.getenv("DATABASE_URL")
        if not db_uri:
            return {
                **state,
                "processing_status": "error",
                "error_message": "DATABASE_URL environment variable not set"
            }
        
        await DatabaseManager.initialize(db_uri)
        pool = await DatabaseManager.get_pool()
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                # Create tables if they don't exist
                await _create_tables_if_not_exist(cur)
                
                # Delete existing data for this document
                await _delete_existing_data(cur, state["doc_id"])
                
                # Insert new data
                await _insert_document_data(cur, state)
        
        logger.info(f"[DataGraph] create_database_tables: Completed for doc_id={state['doc_id']}")
        
        return {
            **state,
            "processing_status": "completed",
            "error_message": ""
        }
        
    except Exception as e:
        logger.error(f"[DataGraph] create_database_tables: Error - {str(e)}")
        return {
            **state,
            "processing_status": "error",
            "error_message": f"Database operation error: {str(e)}"
        }


async def _create_tables_if_not_exist(cur) -> None:
    """Create database tables if they don't exist."""
    logger.info("[DataGraph] Creating tables if not exist...")
    
    # Create docs table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS docs (
            doc_id TEXT PRIMARY KEY,
            metadata JSONB NOT NULL,
            thread_id TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'as',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Create sections table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS sections (
            sec_id TEXT PRIMARY KEY,
            doc_id TEXT NOT NULL REFERENCES docs(doc_id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            level SMALLINT NOT NULL,
            parent_id TEXT,
            full_path TEXT[] NOT NULL,
            thread_id TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Create pages table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS pages (
            doc_id TEXT NOT NULL REFERENCES docs(doc_id) ON DELETE CASCADE,
            page_number INTEGER NOT NULL,
            thread_id TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            PRIMARY KEY (doc_id, page_number)
        )
    """)
    
    # Create chunks table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS chunks (
            chunk_id TEXT PRIMARY KEY,
            sec_id TEXT NOT NULL REFERENCES sections(sec_id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            tokens INTEGER NOT NULL,
            page_idx INTEGER[],
            embedding VECTOR(1024),
            sparse_embedding JSONB,
            embedding_metadata JSONB DEFAULT '{"model": "BAAI/bge-m3"}',
            thread_id TEXT NOT NULL,
            position_in_section INTEGER NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Create doc_references table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS doc_references (
            ref_id TEXT PRIMARY KEY,
            doc_id TEXT NOT NULL REFERENCES docs(doc_id) ON DELETE CASCADE,
            type TEXT NOT NULL,
            content TEXT,
            path TEXT,
            caption TEXT,
            page_idx INTEGER,
            thread_id TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Create page_chunks table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS page_chunks (
            doc_id TEXT NOT NULL,
            page_number INTEGER NOT NULL,
            chunk_id TEXT NOT NULL REFERENCES chunks(chunk_id) ON DELETE CASCADE,
            PRIMARY KEY (doc_id, page_number, chunk_id),
            FOREIGN KEY (doc_id, page_number) REFERENCES pages(doc_id, page_number) ON DELETE CASCADE
        )
    """)
    
    # Create chunk_references table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS chunk_references (
            chunk_id TEXT NOT NULL REFERENCES chunks(chunk_id) ON DELETE CASCADE,
            ref_id TEXT NOT NULL REFERENCES doc_references(ref_id) ON DELETE CASCADE,
            PRIMARY KEY (chunk_id, ref_id)
        )
    """)
    
    # Create benchmark_qa table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS benchmark_qa (
            id TEXT PRIMARY KEY,
            question TEXT NOT NULL,
            reference_answer TEXT NOT NULL,
            question_type TEXT DEFAULT 'unknown',
            difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5),
            chunk_ids TEXT[] NOT NULL,
            negative_samples TEXT[],
            required_citations TEXT[],
            thread_id TEXT,
            metadata JSONB DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    
    # Create indexes
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_docs_metadata_title ON docs ((metadata->>'title'))")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_sections_doc ON sections(doc_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_sections_parent ON sections(parent_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_pages_doc ON pages(doc_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_sec ON chunks(sec_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_sparse_embedding ON chunks USING GIN (sparse_embedding)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_chunks_page ON chunks USING GIN (page_idx)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_doc_references ON doc_references(doc_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_doc_refs_page ON doc_references(doc_id, page_idx)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_page_chunks_chunk ON page_chunks(chunk_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_chunk_refs_chunk ON chunk_references(chunk_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_chunk_refs_ref ON chunk_references(ref_id)")
    
    # Create indexes for benchmark_qa table
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_type ON benchmark_qa(question_type)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_difficulty ON benchmark_qa(difficulty)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_chunks ON benchmark_qa USING GIN (chunk_ids)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_thread ON benchmark_qa(thread_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_citations ON benchmark_qa USING GIN (required_citations)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_benchmark_qa_created ON benchmark_qa(created_at)")
    
    # Create update trigger for benchmark_qa table (split into single statements)
    await cur.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    """)
    await cur.execute("DROP TRIGGER IF EXISTS update_benchmark_qa_updated_at ON benchmark_qa;")
    await cur.execute("""
        CREATE TRIGGER update_benchmark_qa_updated_at
            BEFORE UPDATE ON benchmark_qa
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)

    # Create evaluation_results table
    await cur.execute("""
        CREATE TABLE IF NOT EXISTS evaluation_results (
            id SERIAL PRIMARY KEY,
            question_id TEXT NOT NULL,
            model_answer TEXT NOT NULL,
            citations TEXT[],
            scores JSONB NOT NULL,
            weighted_score FLOAT,
            justification TEXT,
            failure_type TEXT,
            thread_id TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    """)
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_evaluation_results_question_id ON evaluation_results(question_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_evaluation_results_thread_id ON evaluation_results(thread_id)")
    await cur.execute("CREATE INDEX IF NOT EXISTS idx_evaluation_results_created ON evaluation_results(created_at)")
    # Create update trigger for evaluation_results table (split into single statements)
    await cur.execute("""
        CREATE OR REPLACE FUNCTION update_evaluation_results_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    """)
    await cur.execute("DROP TRIGGER IF EXISTS update_evaluation_results_updated_at ON evaluation_results;")
    await cur.execute("""
        CREATE TRIGGER update_evaluation_results_updated_at
            BEFORE UPDATE ON evaluation_results
        FOR EACH ROW
        EXECUTE FUNCTION update_evaluation_results_updated_at();
    """)
    logger.info("[DataGraph] All tables/indexes ensured.")


async def _delete_existing_data(cur, doc_id: str) -> None:
    """Delete existing data for the given document ID."""
    logger.info(f"[DataGraph] Deleting existing data for doc_id={doc_id}")
    # Delete in reverse order of dependencies
    await cur.execute("DELETE FROM chunk_references WHERE chunk_id IN (SELECT chunk_id FROM chunks WHERE sec_id IN (SELECT sec_id FROM sections WHERE doc_id = %s))", (doc_id,))
    await cur.execute("DELETE FROM page_chunks WHERE doc_id = %s", (doc_id,))
    await cur.execute("DELETE FROM chunks WHERE sec_id IN (SELECT sec_id FROM sections WHERE doc_id = %s)", (doc_id,))
    await cur.execute("DELETE FROM doc_references WHERE doc_id = %s", (doc_id,))
    await cur.execute("DELETE FROM pages WHERE doc_id = %s", (doc_id,))
    await cur.execute("DELETE FROM sections WHERE doc_id = %s", (doc_id,))
    await cur.execute("DELETE FROM docs WHERE doc_id = %s", (doc_id,))
    logger.info(f"[DataGraph] Deleted all data for doc_id={doc_id}")


async def _insert_document_data(cur, state: DataProcessingState) -> None:
    """Insert processed document data into database tables."""
    logger.info(f"[DataGraph] Inserting document data for doc_id={state['doc_id']}")
    
    doc_id = state["doc_id"]
    metadata = state["metadata"]
    sections = state["sections"]
    chunks = state["chunks"]
    doc_references = state["doc_references"]
    
    # Generate thread_id (you can modify this logic as needed)
    thread_id = f"thread_{doc_id}"
    
    # Insert document
    await cur.execute("""
        INSERT INTO docs (doc_id, metadata, thread_id, type)
        VALUES (%s, %s, %s, %s)
    """, (doc_id, json.dumps(metadata), thread_id, "as"))
    
    # Insert sections
    for section in sections:
        await cur.execute("""
            INSERT INTO sections (sec_id, doc_id, name, level, parent_id, full_path, thread_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            section["sec_id"],
            doc_id,
            section["name"],
            section["level"],
            section.get("parent_id"),
            section["full_path"],
            thread_id
        ))
    
    # Create pages based on total_pages in metadata
    total_pages = metadata.get("total_pages", 0)
    for page_number in range(total_pages):
        await cur.execute("""
            INSERT INTO pages (doc_id, page_number, thread_id)
            VALUES (%s, %s, %s)
        """, (doc_id, page_number, thread_id))
    
    # Insert doc_references first (before chunks)
    for ref in doc_references:
        await cur.execute("""
            INSERT INTO doc_references (ref_id, doc_id, type, content, path, caption, page_idx, thread_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ref["ref_id"],
            doc_id,
            ref["type"],
            ref.get("content"),
            ref.get("path"),
            ref.get("caption"),
            ref.get("page_idx"),
            thread_id
        ))
    
    # Insert chunks
    for chunk in chunks:
        await cur.execute("""
            INSERT INTO chunks (chunk_id, sec_id, text, tokens, page_idx, thread_id, position_in_section)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            chunk["chunk_id"],
            chunk["sec_id"],
            chunk["text"],
            chunk["tokens"],
            chunk.get("page_idx", []),
            thread_id,
            chunk.get("position_in_section", 1)
        ))
        
        # Create page_chunks associations based on page_idx array
        page_idx_list = chunk.get("page_idx", [])
        for page_number in page_idx_list:
            await cur.execute("""
                INSERT INTO page_chunks (doc_id, page_number, chunk_id)
                VALUES (%s, %s, %s)
            """, (doc_id, page_number, chunk["chunk_id"]))
        
        # Create chunk_references associations based on ref_ids array
        ref_ids_list = chunk.get("ref_ids", [])
        for ref_id in ref_ids_list:
            if ref_id:  # Skip null ref_ids
                await cur.execute("""
                    INSERT INTO chunk_references (chunk_id, ref_id)
                    VALUES (%s, %s)
                """, (chunk["chunk_id"], ref_id))
    logger.info(f"[DataGraph] Inserted all data for doc_id={state['doc_id']}")


def should_continue(state: DataProcessingState) -> str:
    """
    Determine the next step based on processing status.
    
    Args:
        state: Current graph state
        
    Returns:
        Next node to execute or "__end__" to finish
    """
    if state.get("processing_status") == "error":
        return "__end__"
    elif state.get("processing_status") == "processed":
        return "create_database_tables"
    else:
        return "__end__"


# Build the data processing graph
builder = StateGraph(DataProcessingState)

# Add nodes
builder.add_node("process_json_data", process_json_data)
builder.add_node("create_database_tables", create_database_tables)

# Add edges
builder.add_edge(START, "process_json_data")
builder.add_conditional_edges(
    "process_json_data",
    should_continue,
    {
        "create_database_tables": "create_database_tables",
        "__end__": END
    }
)
builder.add_edge("create_database_tables", END)

# Compile the graph
data_processing_graph = builder.compile()


async def build_data_processing_graph(checkpointer=None):
    """Build the data processing graph with optional checkpointer."""
    if checkpointer:
        return builder.compile(checkpointer=checkpointer)
    return data_processing_graph
