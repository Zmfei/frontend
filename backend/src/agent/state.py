
"""
State definitions for DeepMarker agents.
"""

from __future__ import annotations
from typing_extensions import TypedDict, Annotated
from langgraph.graph import add_messages
from typing import List, Optional, Dict, Any


class BaseState(TypedDict, total=False):
    """Base state definition with common fields."""
    messages: Annotated[list, add_messages]
    error: Optional[str]  # Error message
    current_step: Optional[str]  # Current processing step


class DataProcessingState(TypedDict, total=False):
    """State for data processing operations."""
    processing_status: str
    error_message: str
    file_path: Optional[str]
    processed_rows: Optional[int]
    total_rows: Optional[int]


