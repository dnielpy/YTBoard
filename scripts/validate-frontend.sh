#!/usr/bin/env sh
# Frontend validation script for pre-commit hook

set -e

echo "🔍 Frontend Validation Starting..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS_FOUND=0

# 1. Run ESLint with fix option
echo "${YELLOW}▶ Running ESLint...${NC}"
if pnpm --filter web lint --fix 2>/dev/null; then
    echo "${GREEN}✓ ESLint OK${NC}"
    git add apps/frontend/src
else
    echo "${RED}✗ ESLint found errors${NC}"
    ERRORS_FOUND=1
fi

echo ""

# 2. Check TypeScript types
echo "${YELLOW}▶ Running TypeScript type checker...${NC}"
if pnpm --filter web check-types 2>/dev/null; then
    echo "${GREEN}✓ TypeScript checking OK${NC}"
else
    echo "${RED}✗ TypeScript type errors found${NC}"
    ERRORS_FOUND=1
fi

echo ""

# Exit with error if critical checks failed
if [ $ERRORS_FOUND -eq 1 ]; then
    echo "${RED}❌ Frontend validation FAILED - commit blocked${NC}"
    exit 1
fi

echo "${GREEN}✅ Frontend validation PASSED${NC}"
exit 0
