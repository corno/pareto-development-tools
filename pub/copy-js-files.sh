#!/bin/bash

# Script to copy all JavaScript files from src to dist directory

SRC_DIR="src"
DIST_DIR="dist"

echo "Starting to copy JavaScript files..."
echo "Source: $SRC_DIR"
echo "Destination: $DIST_DIR"

# Check if source directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "❌ Error: Source directory '$SRC_DIR' does not exist!"
    exit 1
fi

# Create dist directory if it doesn't exist
mkdir -p "$DIST_DIR"

# Find and copy all .js files, preserving directory structure
find "$SRC_DIR" -name "*.js" -type f | while read -r file; do
    # Get the relative path from src directory
    relative_path="${file#$SRC_DIR/}"
    dest_file="$DIST_DIR/$relative_path"
    dest_dir=$(dirname "$dest_file")
    
    # Create destination directory if needed
    mkdir -p "$dest_dir"
    
    # Copy the file
    echo "Copying: $file -> $dest_file"
    cp "$file" "$dest_file"
done

echo "✅ Successfully copied all JavaScript files!"