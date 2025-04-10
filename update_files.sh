#!/bin/bash

# Script to add a comment to the top of all source files
# This ensures all files are marked as modified for GitHub sync

for file in $(find . -type f -not -path "*/\.git/*" -not -path "*/node_modules/*" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.css" -o -name "*.html"); do
    # Add comment to top of file
    if [ -f "$file" ]; then
        echo "Updating $file"
        sed -i '1i// Updated for GitHub sync' "$file" || echo "Failed to update $file"
    fi
done

echo "All files have been updated for GitHub sync!"