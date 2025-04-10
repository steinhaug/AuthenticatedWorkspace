#!/bin/bash

# Script to update key files for GitHub sync
# Avoids JSON files and only targets key directories

echo "Updating key files for GitHub sync..."

# Update TypeScript/JavaScript files
for file in $(find ./client ./server ./shared ./scripts -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"); do
    echo "Updating $file"
    # Add a space at the end of the file
    echo "" >> "$file"
done

# Update CSS files
for file in $(find ./client -type f -name "*.css"); do
    echo "Updating $file"
    # Add a comment at the end of the file
    echo "/* Updated for GitHub sync */" >> "$file"
done

# Update HTML files
for file in $(find ./client -type f -name "*.html"); do
    echo "Updating $file"
    # Add a comment at the end of the file
    echo "<!-- Updated for GitHub sync -->" >> "$file"
done

echo "All key files have been updated for GitHub sync!"