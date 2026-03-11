#!/usr/bin/env sh
# Main pre-commit validation script

set -e

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║         🚀 CODE QUALITY VALIDATION CHECKS 🚀       ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_CHANGES=0
FRONTEND_CHANGES=0

# 1. Check if there are backend changes
echo "${BLUE}Detecting changes...${NC}"
if git diff --cached --name-only | grep -q "apps/backend/"; then
    BACKEND_CHANGES=1
    echo "  • Backend changes detected"
fi

if git diff --cached --name-only | grep -q "apps/frontend/"; then
    FRONTEND_CHANGES=1
    echo "  • Frontend changes detected"
fi

echo ""

# 2. Run formatting
echo "${YELLOW}▶ Running code formatting...${NC}"
pnpm run commit:format > /dev/null 2>&1
git add -A
echo "${GREEN}✓ Formatting completed${NC}"
echo ""

# 3. Validate backend if there are changes
if [ $BACKEND_CHANGES -eq 1 ]; then
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    bash scripts/validate-backend.sh
    BACKEND_RESULT=$?
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
else
    echo "${YELLOW}⊘ Skipping backend validation (no changes)${NC}"
    echo ""
fi

# 4. Validate frontend if there are changes
if [ $FRONTEND_CHANGES -eq 1 ]; then
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    bash scripts/validate-frontend.sh
    FRONTEND_RESULT=$?
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
else
    echo "${YELLOW}⊘ Skipping frontend validation (no changes)${NC}"
    echo ""
fi

# 5. Final result
echo "╔════════════════════════════════════════════════════╗"
FINAL_RESULT=0
if [ $BACKEND_CHANGES -eq 1 ] && [ $BACKEND_RESULT -ne 0 ]; then
    FINAL_RESULT=1
fi
if [ $FRONTEND_CHANGES -eq 1 ] && [ $FRONTEND_RESULT -ne 0 ]; then
    FINAL_RESULT=1
fi

if [ $FINAL_RESULT -eq 0 ]; then
    echo "║         ${GREEN}✅ ALL VALIDATIONS PASSED ✅${NC}          ║"
    echo "║           Ready to commit! Proceeding...           ║"
else
    echo "║         ${RED}❌ VALIDATION FAILED ❌${NC}            ║"
    echo "║      Please fix the errors above and retry        ║"
fi
echo "╚════════════════════════════════════════════════════╝"
echo ""

exit $FINAL_RESULT
