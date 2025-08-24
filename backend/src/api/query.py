"""
API router for DeepMarker query operations.
Provides endpoints for querying cell marker data.
"""

import logging
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query

from src.db.database import DatabaseManager
from src.api.models import Response

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/query", tags=["query"])


@router.get("/cell-markers")
async def get_cell_markers(
    species: Optional[List[str]] = Query(None, description="Filter by species name(s)"),
    tissue_type: Optional[List[str]] = Query(None, description="Filter by tissue type(s)"),
    cell_type: Optional[List[str]] = Query(None, description="Filter by cell type(s)"),
    marker: Optional[str] = Query(None, description="Filter by marker symbol"),
    publication_year: Optional[List[str]] = Query(None, description="Filter by publication year(s)")
) -> Response[List[Dict[str, Any]]]:
    """
    Query cell marker data with optional filters.
    
    Args:
        species: Species name filter(s)
        tissue_type: Tissue type filter(s)
        cell_type: Cell type filter(s)
        marker: Marker symbol filter
        publication_year: Publication year filter(s)
        
    Returns:
        Response containing list of cell marker records
    """
    try:
        pool = await DatabaseManager.get_pool()
        
        # Build query with filters
        query = "SELECT * FROM v_cell_marker_details WHERE 1=1"
        params = []
        
        if species:
            placeholders = ','.join(['%s'] * len(species))
            query += f" AND species_name ILIKE ANY(ARRAY[{placeholders}])"
            params.extend([f"%{s}%" for s in species])
        if tissue_type:
            placeholders = ','.join(['%s'] * len(tissue_type))
            query += f" AND tissue_type ILIKE ANY(ARRAY[{placeholders}])"
            params.extend([f"%{t}%" for t in tissue_type])
        if cell_type:
            placeholders = ','.join(['%s'] * len(cell_type))
            query += f" AND cell_type ILIKE ANY(ARRAY[{placeholders}])"
            params.extend([f"%{c}%" for c in cell_type])
        if marker:
            query += " AND marker_symbol ILIKE %s"
            params.append(f"%{marker}%")
        if publication_year:
            placeholders = ','.join(['%s'] * len(publication_year))
            query += f" AND publication_year = ANY(ARRAY[{placeholders}])"
            params.extend([int(y) for y in publication_year])
        
        query += " ORDER BY created_at DESC"
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, params)
                columns = [desc[0] for desc in cur.description]
                results = []
                async for row in cur:
                    results.append(dict(zip(columns, row)))
                
                return Response(data=results)
                
    except Exception as e:
        logger.error(f"Error querying cell markers: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )


@router.get("/species-stats")
async def get_species_statistics() -> Response[List[Dict[str, Any]]]:
    """
    Get statistics for each species.
    
    Returns:
        Response containing species statistics
    """
    try:
        pool = await DatabaseManager.get_pool()
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT * FROM v_species_stats ORDER BY marker_count DESC")
                columns = [desc[0] for desc in cur.description]
                results = []
                async for row in cur:
                    results.append(dict(zip(columns, row)))
                
                return Response(data=results)
                
    except Exception as e:
        logger.error(f"Error getting species statistics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )


@router.get("/publication-stats")
async def get_publication_statistics() -> Response[List[Dict[str, Any]]]:
    """
    Get yearly publication statistics.
    
    Returns:
        Response containing publication statistics by year
    """
    try:
        pool = await DatabaseManager.get_pool()
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT * FROM v_publication_yearly_stats")
                columns = [desc[0] for desc in cur.description]
                results = []
                async for row in cur:
                    results.append(dict(zip(columns, row)))
                
                return Response(data=results)
                
    except Exception as e:
        logger.error(f"Error getting publication statistics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )


@router.get("/markers")
async def get_markers(
    search: Optional[str] = Query(None, description="Search marker symbols"),
    limit: int = Query(100, description="Maximum number of results", ge=1, le=1000)
) -> Response[List[Dict[str, Any]]]:
    """
    Get list of markers with optional search.
    
    Args:
        search: Search term for marker symbols
        limit: Maximum results to return
        
    Returns:
        Response containing list of markers
    """
    try:
        pool = await DatabaseManager.get_pool()
        
        query = "SELECT * FROM markers WHERE 1=1"
        params = []
        
        if search:
            query += " AND symbol ILIKE %s"
            params.append(f"%{search}%")
        
        query += f" ORDER BY symbol LIMIT {limit}"
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(query, params)
                columns = [desc[0] for desc in cur.description]
                results = []
                async for row in cur:
                    results.append(dict(zip(columns, row)))
                
                return Response(data=results)
                
    except Exception as e:
        logger.error(f"Error querying markers: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )


@router.get("/database-info")
async def get_database_info() -> Response[Dict[str, Any]]:
    """
    Get general database information and statistics.
    
    Returns:
        Response containing database statistics
    """
    try:
        pool = await DatabaseManager.get_pool()
        
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                # Get table counts
                tables_info = {}
                
                tables = ['species', 'tissue_types', 'cell_types', 'markers', 'publications', 'cell_markers']
                for table in tables:
                    await cur.execute(f"SELECT COUNT(*) FROM {table}")
                    count = (await cur.fetchone())[0]
                    tables_info[table] = count
                
                return Response(data={
                    "table_counts": tables_info,
                    "total_relationships": tables_info.get('cell_markers', 0)
                })
                
    except Exception as e:
        logger.error(f"Error getting database info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Query failed: {str(e)}"
        )

@router.get("/options/tissues")
async def get_tissue_options() -> Response[List[str]]:
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT name FROM tissue_types ORDER BY name")
                results = [row[0] for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting tissue options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/options/cell-types")
async def get_cell_type_options() -> Response[List[str]]:
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT name FROM cell_types ORDER BY name")
                results = [row[0] for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting cell type options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/options/publication-years")
async def get_publication_year_options() -> Response[List[int]]:
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT DISTINCT publication_year FROM publications WHERE publication_year IS NOT NULL ORDER BY publication_year DESC")
                results = [row[0] for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting publication year options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/options/species")
async def get_species_options() -> Response[List[str]]:
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT name FROM species ORDER BY name")
                results = [row[0] for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting species options: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/tissue-stats")
async def get_tissue_statistics(
    species: Optional[str] = Query(None, description="Filter by species name"),
    publication_year: Optional[str] = Query(None, description="Filter by publication year")
) -> Response[List[Dict[str, Any]]]:
    """Return tissue distribution counts with optional filters."""
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                query = (
                    "SELECT tt.name AS tissue, COUNT(*) AS count "
                    "FROM cell_markers cm "
                    "JOIN tissue_types tt ON cm.tissue_type_id = tt.id "
                    "JOIN species s ON cm.species_id = s.id "
                    "JOIN publications p ON cm.publication_id = p.id "
                    "WHERE 1=1"
                )
                params: list[Any] = []
                if species:
                    query += " AND s.name ILIKE %s"
                    params.append(f"%{species}%")
                if publication_year:
                    query += " AND p.publication_year = %s"
                    params.append(int(publication_year))
                query += " GROUP BY tt.name ORDER BY count DESC"
                await cur.execute(query, params)
                results = [{"tissue": row[0], "count": row[1]} for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting tissue statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")

@router.get("/options/cell-types-by-tissue")
async def get_cell_types_by_tissue(
    tissue_type: Optional[List[str]] = Query(None, description="Filter cell types by tissue type(s)"),
    species: Optional[List[str]] = Query(None, description="Filter by species name(s)"),
    publication_year: Optional[List[str]] = Query(None, description="Filter by publication year(s)")
) -> Response[List[str]]:
    """
    Get cell types filtered by tissue type(s), species, and publication year.
    If tissue_type is not provided, returns empty list (only "All" option).
    
    Args:
        tissue_type: Tissue type(s) to filter by
        species: Species name(s) to filter by
        publication_year: Publication year(s) to filter by
        
    Returns:
        Response containing list of cell type names
    """
    try:
        pool = await DatabaseManager.get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                # If no tissue_type is provided, return empty list (only "All" option)
                if not tissue_type:
                    return Response(data=[])
                
                # Build query with all filter conditions
                query = """
                    SELECT DISTINCT ct.name 
                    FROM cell_types ct
                    JOIN cell_markers cm ON ct.id = cm.cell_type_id
                    JOIN tissue_types tt ON cm.tissue_type_id = tt.id
                    JOIN species s ON cm.species_id = s.id
                    JOIN publications p ON cm.publication_id = p.id
                    WHERE tt.name = ANY(%s)
                """
                params = [tissue_type]
                
                if species:
                    placeholders = ','.join(['%s'] * len(species))
                    query += f" AND s.name ILIKE ANY(ARRAY[{placeholders}])"
                    params.extend([f"%{s}%" for s in species])
                
                if publication_year:
                    placeholders = ','.join(['%s'] * len(publication_year))
                    query += f" AND p.publication_year = ANY(ARRAY[{placeholders}])"
                    params.extend([int(y) for y in publication_year])
                
                query += " ORDER BY ct.name"
                
                await cur.execute(query, params)
                results = [row[0] for row in await cur.fetchall()]
                return Response(data=results)
    except Exception as e:
        logger.error(f"Error getting cell types by tissue: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
