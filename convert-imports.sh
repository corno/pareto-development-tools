#!/bin/bash

# Script to convert require statements to ES6 imports in TypeScript files

convert_requires() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    echo "Converting requires to imports in $file..."
    
    # Use sed to convert common require patterns to imports
    sed \
        -e "s/const fs = require('fs');/import * as fs from 'fs';/g" \
        -e "s/const path = require('path');/import * as path from 'path';/g" \
        -e "s/const os = require('os');/import * as os from 'os';/g" \
        -e "s/const readline = require('readline');/import * as readline from 'readline';/g" \
        -e "s/const { execSync } = require('child_process');/import { execSync } from 'child_process';/g" \
        -e "s/const { spawn } = require('child_process');/import { spawn } from 'child_process';/g" \
        -e "s/const { \([^}]*\) } = require('\([^']*\)');/import { \1 } from '\2';/g" \
        -e "s/const \([a-zA-Z_][a-zA-Z0-9_]*\) = require('\([^']*\)');/import * as \1 from '\2';/g" \
        "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
}

# Process all TypeScript command files
find /home/corno/workspace/pareto-development-tools/pub/src/commands -name "*.ts" -type f | while read -r file; do
    if grep -q "require(" "$file"; then
        convert_requires "$file"
    else
        echo "No requires found in $file"
    fi
done

echo "Done converting requires to imports!"