#!/bin/bash

# Script to touch all files in the repository
# This ensures all files are included in the next GitHub sync

echo "Touching all files in the repository for GitHub sync..."

# Find all files and touch them (excludes .git directory)
find . -type f -not -path "*/\.git/*" -not -path "*/node_modules/*" -exec touch {} \;

echo "All files have been touched successfully!"