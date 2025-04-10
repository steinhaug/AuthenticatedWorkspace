#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting application setup...${NC}"

# 1. Check for required executables
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm is required but not installed.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ node is required but not installed.${NC}" >&2; exit 1; }

# 2. Check node_modules directory
echo -e "\n${GREEN}📦 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️ node_modules not found, installing dependencies...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
  echo -e "${GREEN}✅ node_modules directory exists${NC}"
fi

# 3. Run database setup
echo -e "\n${GREEN}🛠️ Setting up database...${NC}"
npx tsx scripts/db-setup.ts
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Database setup failed${NC}"
  exit 1
fi

# 4. Run database verification
echo -e "\n${GREEN}🔍 Verifying database...${NC}"
npx tsx scripts/db-verify.ts
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Database verification failed${NC}"
  exit 1
fi

echo -e "\n${GREEN}✅ Setup completed successfully!${NC}"
echo -e "${GREEN}To start the application, run: npm run dev${NC}"