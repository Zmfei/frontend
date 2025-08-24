"""Response models for the API."""

from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar('T')


class ResponseBase(BaseModel):
    """Base response model with status code and message."""
    
    code: int = Field(200, description="Status code")
    message: str = Field("Success", description="Response message")


class Response(ResponseBase, Generic[T]):
    """Generic response model with data field."""
    
    data: Optional[T] = Field(None, description="Response data")


class ErrorResponse(ResponseBase):
    """Error response model."""
    
    code: int = Field(400, description="Error code")
    message: str = Field("Error", description="Error message")
    detail: Optional[str] = Field(None, description="Error details")


# TODO: Add specific models for CellMarker API endpoints
