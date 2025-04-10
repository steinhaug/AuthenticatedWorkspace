#!/bin/bash

# Script to fix JSON data files
echo "Fixing JSON data files..."

# Fix the specific data files we found
for file in node_modules/@babel/compat-data/data/corejs2-built-ins.json \
            node_modules/@babel/compat-data/data/corejs3-shipped-proposals.json \
            node_modules/@babel/compat-data/data/native-modules.json \
            node_modules/@babel/compat-data/data/overlapping-plugins.json \
            node_modules/@babel/compat-data/data/plugin-bugfixes.json \
            node_modules/@babel/compat-data/data/plugins.json; do
    echo "Fixing $file"
    # Remove the first line (the comment) from the file
    sed -i '1d' "$file"
done

echo "All JSON data files have been fixed!"