#!/bin/bash

# Script to fix all package.json files that have been modified with a comment
echo "Fixing JSON files in node_modules directory..."

# Use find to locate all package.json files with the added comment
for file in $(find node_modules -name "package.json" -exec grep -l "// Updated" {} \;); do
    echo "Fixing $file"
    # Remove the first line (the comment) from the file
    sed -i '1d' "$file"
done

# Also check for other key JSON files in the root directory
for file in $(find . -maxdepth 1 -name "*.json" -exec grep -l "// Updated" {} \;); do
    echo "Fixing $file"
    # Remove the first line (the comment) from the file
    sed -i '1d' "$file"
done

echo "All JSON files have been fixed!"