"""
Configuration for CellMarker agents.
"""

import os
from pydantic import BaseModel, Field
from typing import Any, Optional
from langchain_core.runnables import RunnableConfig


class Configuration(BaseModel):
    """The configuration for CellMarker agents."""

    thread_id: str = Field(
        default="1",
        metadata={"description": "The ID of the thread to use for the agent."},
    )

    # TODO: Add CellMarker specific configuration fields

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = (
            config["configurable"] if config and "configurable" in config else {}
        )

        # Get raw values from environment or config
        raw_values: dict[str, Any] = {
            name: os.environ.get(name.upper(), configurable.get(name))
            for name in cls.model_fields.keys()
        }

        # Filter out None values
        values = {k: v for k, v in raw_values.items() if v is not None}

        return cls(**values)