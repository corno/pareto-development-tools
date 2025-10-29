#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Recursively copy all .js files from source directory to destination directory
 * @param {string} srcDir - Source directory path
 * @param {string} destDir - Destination directory path
 */
function copyJsFiles(srcDir, destDir) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Read all items in the source directory
    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // Recursively copy subdirectories
            copyJsFiles(srcPath, destPath);
        } else if (stat.isFile() && path.extname(item) === '.js') {
            // Copy .js files
            console.log(`Copying: ${srcPath} -> ${destPath}`);
            
            // Ensure destination directory exists
            const destDirPath = path.dirname(destPath);
            if (!fs.existsSync(destDirPath)) {
                fs.mkdirSync(destDirPath, { recursive: true });
            }
            
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

console.log('Starting to copy JavaScript files...');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${distDir}`);

if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory '${srcDir}' does not exist!`);
    process.exit(1);
}

try {
    copyJsFiles(srcDir, distDir);
    console.log('✅ Successfully copied all JavaScript files!');
} catch (error) {
    console.error('❌ Error copying files:', error.message);
    process.exit(1);
}