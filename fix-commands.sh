#!/bin/bash

# Script to wrap command files in main() functions to fix TypeScript scoping issues

# Function to process a single file
process_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Processing $file..."
    
    # Read the file and wrap in main function
    {
        # Print shebang and imports (everything up to first non-import/require line)
        awk '
        BEGIN { in_header = 1 }
        /^#!/ || /^import / || /^const .* = require/ || /^$/ || /^\/\// { 
            if (in_header) print $0
            next
        }
        {
            if (in_header) {
                in_header = 0
                print ""
                print "function main(): void {"
                print "    " $0
            } else {
                print "    " $0
            }
        }
        END {
            if (!in_header) {
                print "}"
                print ""
                print "main();"
            }
        }
        ' "$file"
    } > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
}

# Process all TypeScript command files
find /home/corno/workspace/pareto-development-tools/pub/src/commands -name "*.ts" -type f | while read -r file; do
    # Skip files that already have main() function
    if ! grep -q "function main()" "$file" && ! grep -q "async function main()" "$file"; then
        process_file "$file"
    else
        echo "Skipping $file (already has main function)"
    fi
done

echo "Done processing command files!"