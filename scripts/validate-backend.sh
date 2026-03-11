#!/usr/bin/env sh
# Backend validation script for pre-commit hook

set -e

echo "🔍 Backend Validation Starting..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_DIR="apps/backend"
ERRORS_FOUND=0

# Check if we're in a virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    # Try to activate the backend venv if it exists
    if [ -f "$BACKEND_DIR/.venv/bin/activate" ]; then
        . "$BACKEND_DIR/.venv/bin/activate"
    fi
fi

# 1. Check for syntax errors with Python compiler
echo "${YELLOW}▶ Checking Python syntax...${NC}"
if python3 -m py_compile $(find $BACKEND_DIR/app -name "*.py" -not -path "*/__pycache__/*" 2>/dev/null) 2>/dev/null; then
    echo "${GREEN}✓ Python syntax OK${NC}"
else
    echo "${RED}✗ Python syntax errors found!${NC}"
    ERRORS_FOUND=1
fi

echo ""

# 2. Run isort to check and fix import order (if installed)
echo "${YELLOW}▶ Checking import order...${NC}"
if command -v isort &> /dev/null; then
    if isort $BACKEND_DIR/app --check-only --diff 2>/dev/null; then
        echo "${GREEN}✓ Import order OK${NC}"
    else
        echo "${YELLOW}⚠ Fixing import order...${NC}"
        isort $BACKEND_DIR/app
        git add $BACKEND_DIR/app
    fi
else
    echo "${YELLOW}⚠ isort not installed - skipping (run: pip install isort)${NC}"
fi

echo ""

# 3. Run black to check formatting (if installed)
echo "${YELLOW}▶ Checking code formatting...${NC}"
if command -v black &> /dev/null; then
    if black $BACKEND_DIR/app --check 2>/dev/null; then
        echo "${GREEN}✓ Code formatting OK${NC}"
    else
        echo "${YELLOW}⚠ Fixing code formatting...${NC}"
        black $BACKEND_DIR/app
        git add $BACKEND_DIR/app
    fi
else
    echo "${YELLOW}⚠ black not installed - skipping (run: pip install black)${NC}"
fi

echo ""

# 4. Run pylint for comprehensive analysis (if installed)
echo "${YELLOW}▶ Running pylint analysis...${NC}"
if command -v pylint &> /dev/null; then
    if python3 -m pylint $BACKEND_DIR/app --disable=all --enable=E,F,W --fail-under=9.0 2>/dev/null; then
        echo "${GREEN}✓ Pylint analysis OK${NC}"
    else
        echo "${RED}✗ Pylint found critical errors (E/F/W)${NC}"
        ERRORS_FOUND=1
    fi
else
    echo "${YELLOW}⚠ pylint not installed - skipping (run: pip install pylint)${NC}"
fi

echo ""

# 5. Check for unused imports and variables (if pylint installed)
echo "${YELLOW}▶ Checking for unused imports and variables...${NC}"
if command -v pylint &> /dev/null; then
    if python3 -m pylint $BACKEND_DIR/app --disable=all --enable=unused-import,unused-variable --fail-under=10.0 2>/dev/null; then
        echo "${GREEN}✓ No unused imports or variables${NC}"
    else
        echo "${RED}✗ Found unused imports or variables${NC}"
        ERRORS_FOUND=1
    fi
else
    echo "${YELLOW}⚠ pylint not installed - skipping unused checks${NC}"
fi

echo ""

# 6. Run mypy for type checking (if installed)
echo "${YELLOW}▶ Running type checking...${NC}"
if command -v mypy &> /dev/null; then
    if mypy $BACKEND_DIR/app --config-file=mypy.ini 2>/dev/null; then
        echo "${GREEN}✓ Type checking OK${NC}"
    else
        echo "${YELLOW}⚠ Type checking warnings (not blocking)${NC}"
    fi
else
    echo "${YELLOW}⚠ mypy not installed - skipping (run: pip install mypy)${NC}"
fi

echo ""

# Exit with error if critical checks failed
if [ $ERRORS_FOUND -eq 1 ]; then
    echo "${RED}❌ Backend validation FAILED - commit blocked${NC}"
    exit 1
fi

echo "${GREEN}✅ Backend validation PASSED${NC}"
exit 0

