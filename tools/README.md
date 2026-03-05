# Tools (Layer 3)

This folder contains **deterministic Python scripts** that execute specific tasks.

## Principles
- **Atomic**: Each script does one thing well
- **Testable**: Can be run independently with sample data
- **Deterministic**: Same input always produces same output

## Environment Setup
- API keys and secrets stored in `.env` (never committed to Git)
- Use `.env.example` to document required variables

## File Naming Convention
- `[action]_[entity].py` (e.g., `fetch_leads.py`, `send_notification.py`)

## Standard Script Structure
```python
#!/usr/bin/env python3
"""
Brief description of what this script does.
"""

import os
from dotenv import load_load_dotenv()

def main():
    # Your deterministic logic here
    pass

if __name__ == "__main__":
    main()
```

## Testing
Use `.tmp/` folder for test data and intermediate files.

## Dependencies
Document all required packages in `requirements.txt`
