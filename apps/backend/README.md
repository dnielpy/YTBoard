# YTBoard API

FastAPI backend for YTBoard application.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/     # API endpoints
│   │       │   └── health.py  # Health check endpoint
│   │       └── router.py      # API router configuration
│   ├── core/
│   │   └── config.py          # Application settings
│   ├── db/                    # Database models and connection
│   ├── models/                # SQLAlchemy models
│   ├── schemas/               # Pydantic schemas
│   ├── services/              # Business logic
│   └── main.py                # Application entry point
├── requirements.txt
└── README.md
```

## Setup

1. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

Start the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Interactive docs (Swagger): http://localhost:8000/docs
- Alternative docs (ReDoc): http://localhost:8000/redoc

## Available Endpoints

- `GET /api/v1/health` - Health check endpoint (returns `{"status": "ok"}`)

## Development

The project follows a standard FastAPI structure:
- **api/**: API routes organized by version
- **core/**: Core configuration and settings
- **db/**: Database setup and connection
- **models/**: Database models (SQLAlchemy)
- **schemas/**: Request/response schemas (Pydantic)
- **services/**: Business logic layer
