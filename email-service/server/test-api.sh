#!/usr/bin/env bash

# Test script for DigiClips RAG API
# This script tests all the new AI query endpoints

set -e

API_BASE="http://localhost:3000/api"
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BOLD}🧪 DigiClips AI Query API Test Suite${NC}\n"

# Check if server is running
echo -e "${BLUE}🔍 Checking if server is running...${NC}"
if ! curl -s "${API_BASE}/health" > /dev/null; then
  echo -e "${YELLOW}⚠️  Server not responding at ${API_BASE}${NC}"
  echo "Start the backend with: npm run dev"
  exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}\n"

# Test 1: Health Check
echo -e "${BOLD}Test 1: Health Check${NC}"
echo "GET /api/health"
curl -s "${API_BASE}/health" | jq '.' || echo "Failed to parse response"
echo -e "\n"

# Test 2: Direct Query (No Web Search)
echo -e "${BOLD}Test 2: Direct Query (No Web Search)${NC}"
echo "POST /api/query - How do neural networks work?"
curl -s -X POST "${API_BASE}/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain how neural networks work in simple terms",
    "useWebSearch": false
  }' | jq '.' || echo "Failed"
echo -e "\n"

# Test 3: Query with Web Search (if configured)
echo -e "${BOLD}Test 3: Query with Web Search${NC}"
echo "POST /api/query - Latest AI developments 2026"
curl -s -X POST "${API_BASE}/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the latest AI developments in 2026?"
  }' | jq '.' || echo "Failed"
echo -e "\n"

# Test 4: Web Search Only (if configured)
echo -e "${BOLD}Test 4: Web Search Only${NC}"
echo "POST /api/web-search - Latest climate news"
RESPONSE=$(curl -s -X POST "${API_BASE}/web-search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest climate news 2026",
    "numResults": 3
  }')

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "$RESPONSE" | jq '.'
  if echo "$RESPONSE" | jq -e '.results' | grep -q "Title"; then
    echo -e "${GREEN}✅ Web search working${NC}"
  else
    echo -e "${YELLOW}⚠️  Web search not configured (SERPER_API_KEY missing?)${NC}"
  fi
else
  echo "$RESPONSE" | jq '.'
  echo -e "${YELLOW}⚠️  Web search not available${NC}"
fi
echo -e "\n"

# Test 5: Legacy Scrape Event
echo -e "${BOLD}Test 5: Legacy Scrape Event Endpoint${NC}"
echo "GET /api/scrape-event"
curl -s "${API_BASE}/scrape-event" | jq '.event' || echo "Failed"
echo -e "\n"

echo -e "${GREEN}${BOLD}✨ All tests completed!${NC}"
echo ""
echo "For more information, see server/RAG_FEATURES.md"
