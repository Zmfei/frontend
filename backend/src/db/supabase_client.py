"""
Supabase client for CellMarker database operations.
TODO: Implement CellMarker specific database operations
"""

import os
import logging
from typing import List, Dict, Any, Optional
from supabase import create_client, Client

logger = logging.getLogger(__name__)

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")
if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be set")

supabase: Client = create_client(url, key)


class SupabaseClient:
    """Supabase client wrapper for CellMarker database operations."""
    
    def __init__(self):
        self.client = supabase
    
    # TODO: Add CellMarker specific database methods


# Create singleton instance
supabase_client = SupabaseClient()