"""
API endpoints for CellMarker operations.
TODO: Implement CellMarker specific endpoints
"""

import logging
from fastapi import APIRouter

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["cellmarker"])

# TODO: Add CellMarker API endpoints here