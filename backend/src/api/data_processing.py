"""
API router for DeepMarker data processing operations.
Handles upload and processing of cell marker data files.
"""

import os
import io
import logging
from pathlib import Path
from typing import Optional
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from src.db.database import DatabaseManager
from src.api.models import Response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/data", tags=["data-processing"])


@router.post("/upload-markers")
async def upload_markers_data(
    file: UploadFile = File(..., description="CSV/Excel file with columns: species, tissue_type, cell_name, marker, PMID")
) -> Response[dict]:
    """
    Upload and process cell markers data file.
    
    Expected columns: species, tissue_type, cell_name, marker, PMID
    Clears existing data and inserts new records.
    
    Args:
        file: CSV or Excel file containing marker data
        
    Returns:
        Response with processing results
    """
    try:
        # Validate file format
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(
                status_code=400,
                detail="File must be CSV or Excel format (.csv, .xlsx, .xls)"
            )
        
        # Read file content
        content = await file.read()
        
        # Parse file based on extension
        try:
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            else:  # Excel files
                df = pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse file: {str(e)}"
            )
        
        # Validate required columns
        required_columns = ['species', 'tissue_type', 'cell_name', 'marker', 'PMID']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {missing_columns}"
            )
        
        # Clean data - remove rows with any null values in required columns (except PMID)
        df_clean = df[required_columns].copy()
        
        # For invalid PMID values, use a default value (0 or -1)
        def fix_pmid(pmid):
            try:
                return int(pmid)
            except (ValueError, TypeError):
                return 0  # Use 0 as default for invalid PMID
        
        df_clean['PMID'] = df_clean['PMID'].apply(fix_pmid)
        
        # Remove rows where other required fields are null (but keep PMID=0)
        required_cols_except_pmid = ['species', 'tissue_type', 'cell_name', 'marker']
        df_clean = df_clean.dropna(subset=required_cols_except_pmid)
        
        if len(df_clean) == 0:
            raise HTTPException(
                status_code=400,
                detail="No valid data rows found after cleaning"
            )
        
        # Process data and insert into database
        result = await _process_markers_data(df_clean)
        
        return Response(
            data={
                "message": "Markers data processed successfully",
                "total_rows": len(df),
                "processed_rows": len(df_clean),
                "skipped_rows": len(df) - len(df_clean),
                **result
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing markers file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/upload-publications")
async def upload_publications_data(
    file: UploadFile = File(..., description="CSV/Excel file with columns: PMID, Year, Month")
) -> Response[dict]:
    """
    Upload and process publications data file.
    
    Expected columns: PMID, Year, Month
    Updates existing publications with year/month information.
    
    Args:
        file: CSV or Excel file containing publication data
        
    Returns:
        Response with processing results
    """
    try:
        # Validate file format
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(
                status_code=400,
                detail="File must be CSV or Excel format (.csv, .xlsx, .xls)"
            )
        
        # Read file content
        content = await file.read()
        
        # Parse file based on extension
        try:
            if file.filename.endswith('.csv'):
                df = pd.read_csv(io.BytesIO(content))
            else:  # Excel files
                df = pd.read_excel(io.BytesIO(content))
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse file: {str(e)}"
            )
        
        # Validate required columns
        required_columns = ['PMID', 'Year', 'Month']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {missing_columns}"
            )
        
        # Clean data - remove rows with null PMID
        df_clean = df[df['PMID'].notna()].copy()
        
        # For invalid PMID values, use a default value (0)
        def fix_pmid(pmid):
            try:
                return int(pmid)
            except (ValueError, TypeError):
                return 0  # Use 0 as default for invalid PMID
        
        df_clean['PMID'] = df_clean['PMID'].apply(fix_pmid)
        
        if len(df_clean) == 0:
            raise HTTPException(
                status_code=400,
                detail="No valid PMID values found"
            )
        
        # Process data and insert into database
        result = await _process_publications_data(df_clean)
        
        return Response(
            data={
                "message": "Publications data processed successfully",
                "total_rows": len(df),
                "processed_rows": len(df_clean),
                "skipped_rows": len(df) - len(df_clean),
                **result
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing publications file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


async def _process_markers_data(df: pd.DataFrame) -> dict:
    """
    Process markers data and insert into database.
    Clears existing data before insertion.
    
    Args:
        df: DataFrame with validated marker data
        
    Returns:
        Dictionary with processing statistics
    """
    pool = await DatabaseManager.get_pool()
    
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            try:
                # Start transaction
                await conn.commit()  # Ensure clean start
                
                # Clear existing data (in reverse dependency order)
                logger.info("Clearing existing marker data...")
                await cur.execute("DELETE FROM cell_markers")
                await cur.execute("DELETE FROM markers WHERE id NOT IN (SELECT marker_id FROM cell_markers)")
                await cur.execute("DELETE FROM cell_types WHERE id NOT IN (SELECT cell_type_id FROM cell_markers)")
                await cur.execute("DELETE FROM tissue_types WHERE id NOT IN (SELECT tissue_type_id FROM cell_markers)")
                # Note: Keep species and publications as they might be referenced elsewhere
                
                # Process each row
                stats = {
                    "inserted_species": 0,
                    "inserted_tissues": 0,
                    "inserted_cells": 0,
                    "inserted_markers": 0,
                    "inserted_publications": 0,
                    "inserted_relationships": 0
                }
                
                for _, row in df.iterrows():
                    # PMID is already cleaned in the preprocessing step
                    pmid_val = int(row['PMID'])  # Should be safe now
                    
                    # Insert or get species
                    species_id = await _get_or_create_species(cur, row['species'])
                    if species_id == -1:  # New record
                        stats["inserted_species"] += 1
                    
                    # Insert or get tissue type
                    tissue_id = await _get_or_create_tissue_type(cur, row['tissue_type'])
                    if tissue_id == -1:  # New record
                        stats["inserted_tissues"] += 1
                    
                    # Insert or get cell type
                    cell_id = await _get_or_create_cell_type(cur, row['cell_name'])
                    if cell_id == -1:  # New record
                        stats["inserted_cells"] += 1
                    
                    # Insert or get marker
                    marker_id = await _get_or_create_marker(cur, row['marker'])
                    if marker_id == -1:  # New record
                        stats["inserted_markers"] += 1
                    
                    # Insert or get publication
                    pub_id = await _get_or_create_publication(cur, pmid_val)
                    if pub_id == -1:  # New record
                        stats["inserted_publications"] += 1
                    
                    # Get actual IDs (after potential creation)
                    species_id = await _get_or_create_species(cur, row['species'])
                    tissue_id = await _get_or_create_tissue_type(cur, row['tissue_type'])
                    cell_id = await _get_or_create_cell_type(cur, row['cell_name'])
                    marker_id = await _get_or_create_marker(cur, row['marker'])
                    pub_id = await _get_or_create_publication(cur, pmid_val)
                    
                    # Insert relationship
                    await cur.execute("""
                        INSERT INTO cell_markers 
                        (species_id, tissue_type_id, cell_type_id, marker_id, publication_id)
                        VALUES (%s, %s, %s, %s, %s)
                        ON CONFLICT (species_id, tissue_type_id, cell_type_id, marker_id, publication_id) 
                        DO NOTHING
                    """, (species_id, tissue_id, cell_id, marker_id, pub_id))
                    stats["inserted_relationships"] += 1
                
                # Commit transaction
                await conn.commit()
                logger.info(f"Markers data processing completed: {stats}")
                return stats
                
            except Exception as e:
                await conn.rollback()
                logger.error(f"Error processing markers data: {str(e)}")
                raise


async def _process_publications_data(df: pd.DataFrame) -> dict:
    """
    Process publications data and update database.
    Updates existing publications with year/month information.
    
    Args:
        df: DataFrame with validated publication data
        
    Returns:
        Dictionary with processing statistics
    """
    pool = await DatabaseManager.get_pool()
    
    async with pool.connection() as conn:
        async with conn.cursor() as cur:
            try:
                # Start transaction
                await conn.commit()
                
                stats = {
                    "updated_publications": 0,
                    "created_publications": 0,
                    "skipped_publications": 0
                }
                
                for _, row in df.iterrows():
                    # PMID is already cleaned in preprocessing
                    pmid = int(row['PMID'])  # Should be safe now
                    year = int(row['Year']) if pd.notna(row['Year']) and str(row['Year']).replace('.', '').isdigit() else None
                    month = str(row['Month']) if pd.notna(row['Month']) else None
                    
                    # Check if publication exists
                    await cur.execute("SELECT id FROM publications WHERE pmid = %s", (pmid,))
                    result = await cur.fetchone()
                    
                    if result:
                        # Update existing publication
                        await cur.execute("""
                            UPDATE publications 
                            SET publication_year = %s, publication_month = %s, updated_at = CURRENT_TIMESTAMP
                            WHERE pmid = %s
                        """, (year, month, pmid))
                        stats["updated_publications"] += 1
                    else:
                        # Create new publication
                        await cur.execute("""
                            INSERT INTO publications (pmid, publication_year, publication_month)
                            VALUES (%s, %s, %s)
                        """, (pmid, year, month))
                        stats["created_publications"] += 1
                
                # Commit transaction
                await conn.commit()
                logger.info(f"Publications data processing completed: {stats}")
                return stats
                
            except Exception as e:
                await conn.rollback()
                logger.error(f"Error processing publications data: {str(e)}")
                raise


# Helper functions for data insertion
async def _get_or_create_species(cur, name: str) -> int:
    """Get species ID or create new species. Returns -1 for new records on first call."""
    await cur.execute("SELECT id FROM species WHERE name = %s", (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("""
        INSERT INTO species (name) VALUES (%s) 
        ON CONFLICT (name) DO NOTHING RETURNING id
    """, (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    # If no RETURNING (conflict), get the existing ID
    await cur.execute("SELECT id FROM species WHERE name = %s", (name,))
    return (await cur.fetchone())[0]


async def _get_or_create_tissue_type(cur, name: str) -> int:
    """Get tissue type ID or create new tissue type."""
    await cur.execute("SELECT id FROM tissue_types WHERE name = %s", (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("""
        INSERT INTO tissue_types (name) VALUES (%s) 
        ON CONFLICT (name) DO NOTHING RETURNING id
    """, (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("SELECT id FROM tissue_types WHERE name = %s", (name,))
    return (await cur.fetchone())[0]


async def _get_or_create_cell_type(cur, name: str) -> int:
    """Get cell type ID or create new cell type."""
    await cur.execute("SELECT id FROM cell_types WHERE name = %s AND category IS NULL", (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("""
        INSERT INTO cell_types (name) VALUES (%s) 
        ON CONFLICT (name, category) DO NOTHING RETURNING id
    """, (name,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("SELECT id FROM cell_types WHERE name = %s AND category IS NULL", (name,))
    return (await cur.fetchone())[0]


async def _get_or_create_marker(cur, symbol: str) -> int:
    """Get marker ID or create new marker."""
    await cur.execute("SELECT id FROM markers WHERE symbol = %s", (symbol,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("""
        INSERT INTO markers (symbol) VALUES (%s) 
        ON CONFLICT (symbol) DO NOTHING RETURNING id
    """, (symbol,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("SELECT id FROM markers WHERE symbol = %s", (symbol,))
    return (await cur.fetchone())[0]


async def _get_or_create_publication(cur, pmid: int) -> int:
    """Get publication ID or create new publication."""
    await cur.execute("SELECT id FROM publications WHERE pmid = %s", (pmid,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("""
        INSERT INTO publications (pmid) VALUES (%s) 
        ON CONFLICT (pmid) DO NOTHING RETURNING id
    """, (pmid,))
    result = await cur.fetchone()
    if result:
        return result[0]
    
    await cur.execute("SELECT id FROM publications WHERE pmid = %s", (pmid,))
    return (await cur.fetchone())[0] 