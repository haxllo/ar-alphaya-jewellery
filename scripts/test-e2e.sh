#!/bin/bash
# E2E Test Script for Playwright
# Run Playwright tests with optional arguments

set -e

# Default to running all tests
npx playwright test "$@"
