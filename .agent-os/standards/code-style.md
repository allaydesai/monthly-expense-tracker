# Code Style Guide

## Context

Global code style rules for Agent OS projects.

<conditional-block context-check="general-formatting">
IF this General Formatting section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using General Formatting rules already in context"
ELSE:
  READ: The following formatting rules

## General Formatting

### Indentation
- Use consistent indentation throughout files (project-specific)
- Python: 4 spaces (PEP8 standard)
- JavaScript/HTML/CSS: 2 spaces
- Maintain alignment for nested structures

### Line Length
- Maximum 100 characters per line
- Configure in ruff for Python: `pyproject.toml`
- Break long lines at logical points
- Use trailing commas in multi-line structures

### Naming Conventions
- **Variables and Functions**: Use snake_case (e.g., `user_profile`, `calculate_total`)
- **Classes**: Use PascalCase (e.g., `UserProfile`, `PaymentProcessor`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Private attributes/methods**: Use `_leading_underscore`
- **Type aliases**: Use PascalCase
- **Enum values**: Use UPPER_SNAKE_CASE

### String Formatting
- Python: Use double quotes for strings (as per project convention)
- Use f-strings for formatting in Python 3.6+
- Use template literals for JavaScript interpolation
- Escape quotes consistently within strings

### Code Comments
- Add brief comments above non-obvious business logic
- Document complex algorithms or calculations
- Explain the "why" behind implementation choices
- Never remove existing comments unless removing the associated code
- Update comments when modifying code to maintain accuracy
- Keep comments concise and relevant
- Use `# Reason:` prefix for complex logic explanations
</conditional-block>

<conditional-block task-condition="python" context-check="python-style">
IF current task involves writing or updating Python:
  IF Python Style section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Python style guide already in context"
  ELSE:
    READ: The following Python-specific style rules

## Python Style Guide

### PEP8 Compliance
- Follow PEP8 with project-specific choices
- Line length: 100 characters (set in pyproject.toml)
- Use double quotes for strings
- Use trailing commas in multi-line structures

### Type Hints
- **Always use type hints** for function signatures
- Use type hints for class attributes
- Import types from `typing` module as needed
- Use `Optional[]` for nullable types
- Use `List[]`, `Dict[]`, `Set[]` for collections
- Example:
```python
from typing import Optional, List, Dict
from decimal import Decimal

def calculate_total(
    items: List[Dict[str, Decimal]],
    tax_rate: float,
    discount: Optional[Decimal] = None
) -> Decimal:
    """Calculate total with tax and optional discount."""
    pass
```

### Docstrings (Google Style)
```python
def function_name(param1: str, param2: int) -> bool:
    """
    Brief description of function.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value

    Raises:
        ValueError: When invalid input provided

    Example:
        >>> function_name("test", 42)
        True
    """
    pass
```

### Import Organization
1. Standard library imports
2. Related third-party imports
3. Local application/library imports
4. Use absolute imports
5. Format with `ruff format`

### Pydantic Models
- Use Pydantic v2 for data validation
- Define clear field validators
- Use `ConfigDict` for model configuration
- Example:
```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional

class UserModel(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str
    age: Optional[int] = Field(None, ge=0, le=150)
    created_at: datetime = Field(default_factory=datetime.now)

    @field_validator('email')
    def validate_email(cls, v):
        if '@' not in v:
            raise ValueError('Invalid email')
        return v

    model_config = ConfigDict(
        from_attributes=True,  # Enable ORM mode
        use_enum_values=True
    )
```

### Formatting Tools
- Use `ruff format` for auto-formatting
- Use `ruff check` for linting
- Use `mypy` for type checking
</conditional-block>

<conditional-block task-condition="database" context-check="database-style">
IF current task involves database operations:
  IF Database Style section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Database style guide already in context"
  ELSE:
    READ: The following database naming conventions

## Database Naming Standards

### Entity-Specific Primary Keys
All tables use entity-specific primary keys for clarity:
```sql
-- ✅ STANDARDIZED: Entity-specific primary keys
sessions.session_id UUID PRIMARY KEY
leads.lead_id UUID PRIMARY KEY
messages.message_id UUID PRIMARY KEY
agencies.agency_id UUID PRIMARY KEY
```

### Field Naming Conventions
```sql
-- Primary keys: {entity}_id
session_id, lead_id, message_id

-- Foreign keys: {referenced_entity}_id
session_id REFERENCES sessions(session_id)
agency_id REFERENCES agencies(agency_id)

-- Timestamps: {action}_at
created_at, updated_at, started_at, expires_at

-- Booleans: is_{state}
is_connected, is_active, is_qualified

-- Counts: {entity}_count
message_count, lead_count, notification_count

-- Durations: {property}_{unit}
duration_seconds, timeout_minutes
```

### Model-Database Alignment
Models should mirror database fields exactly:
```python
class Lead(BaseModel):
    lead_id: UUID = Field(default_factory=uuid4)  # Matches DB
    session_id: UUID                               # Matches DB
    agency_id: str                                 # Matches DB
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
```
</conditional-block>

<conditional-block task-condition="api-routes" context-check="api-style">
IF current task involves API routes:
  IF API Style section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using API style guide already in context"
  ELSE:
    READ: The following API conventions

## API Route Standards

### RESTful Conventions
```python
# ✅ STANDARDIZED: RESTful with consistent parameter naming
router = APIRouter(prefix="/api/v1/leads", tags=["leads"])

@router.get("/{lead_id}")           # GET /api/v1/leads/{lead_id}
@router.put("/{lead_id}")           # PUT /api/v1/leads/{lead_id}
@router.delete("/{lead_id}")        # DELETE /api/v1/leads/{lead_id}

# Sub-resources
@router.get("/{lead_id}/messages")  # GET /api/v1/leads/{lead_id}/messages
@router.get("/agency/{agency_id}")  # GET /api/v1/leads/agency/{agency_id}
```

### API Documentation
- Use FastAPI's automatic documentation
- Add summary and description to endpoints
- Document query parameters clearly
- Provide response models
</conditional-block>

<conditional-block task-condition="html-css-tailwind" context-check="html-css-style">
IF current task involves writing or updating HTML, CSS, or TailwindCSS:
  IF html-style.md AND css-style.md already in context:
    SKIP: Re-reading these files
    NOTE: "Using HTML/CSS style guides already in context"
  ELSE:
    <context_fetcher_strategy>
      IF current agent is Claude Code AND context-fetcher agent exists:
        USE: @agent:context-fetcher
        REQUEST: "Get HTML formatting rules from code-style/html-style.md"
        REQUEST: "Get CSS and TailwindCSS rules from code-style/css-style.md"
        PROCESS: Returned style rules
      ELSE:
        READ the following style guides (only if not already in context):
        - @.agent-os/standards/code-style/html-style.md (if not in context)
        - @.agent-os/standards/code-style/css-style.md (if not in context)
    </context_fetcher_strategy>
ELSE:
  SKIP: HTML/CSS style guides not relevant to current task
</conditional-block>

<conditional-block task-condition="javascript" context-check="javascript-style">
IF current task involves writing or updating JavaScript:
  IF javascript-style.md already in context:
    SKIP: Re-reading this file
    NOTE: "Using JavaScript style guide already in context"
  ELSE:
    <context_fetcher_strategy>
      IF current agent is Claude Code AND context-fetcher agent exists:
        USE: @agent:context-fetcher
        REQUEST: "Get JavaScript style rules from code-style/javascript-style.md"
        PROCESS: Returned style rules
      ELSE:
        READ: @.agent-os/standards/code-style/javascript-style.md
    </context_fetcher_strategy>
ELSE:
  SKIP: JavaScript style guide not relevant to current task
</conditional-block>