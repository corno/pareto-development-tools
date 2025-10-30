#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const data_dir = path.join(__dirname, '../../../data');
const test_data_dir = path.join(data_dir, 'test');
const expected_html_dir = path.join(test_data_dir, 'expected/html');
const pdf_output_dir = path.join(test_data_dir, 'pdfs');

console.log('Generating PDFs from HTML files...\n');

// Ensure PDF output directory exists
if (!fs.existsSync(pdf_output_dir)) {
    fs.mkdirSync(pdf_output_dir, { recursive: true });
    console.log(`✓ Created ${pdf_output_dir}\n`);
}

// Read all HTML files
const html_files = fs.readdirSync(expected_html_dir)
    .filter(file => file.endsWith('.html'));

console.log(`Found ${html_files.length} HTML file(s) to convert\n`);

for (const html_file of html_files) {
    const base_name = path.basename(html_file, '.html');
    const pdf_name = `${base_name}.pdf`;
    
    console.log(`Converting ${html_file}...`);
    
    const html_path = path.join(expected_html_dir, html_file);
    const pdf_path = path.join(pdf_output_dir, pdf_name);
    
    try {
        // Use Chrome/Chromium headless to generate PDF
        execSync(`google-chrome --headless --disable-gpu --print-to-pdf="${pdf_path}" "${html_path}"`, {
            stdio: 'pipe'
        });
        console.log(`  ✓ Generated: ${pdf_name}`);
    } catch (err) {
        try {
            // Try chromium as fallback
            execSync(`chromium --headless --disable-gpu --print-to-pdf="${pdf_path}" "${html_path}"`, {
                stdio: 'pipe'
            });
            console.log(`  ✓ Generated: ${pdf_name}`);
        } catch (err2) {
            try {
                // Try chromium-browser as another fallback
                execSync(`chromium-browser --headless --disable-gpu --print-to-pdf="${pdf_path}" "${html_path}"`, {
                    stdio: 'pipe'
                });
                console.log(`  ✓ Generated: ${pdf_name}`);
            } catch (err3) {
                console.error(`  ❌ Failed to convert ${html_file}`);
                console.error(`     Make sure Chrome/Chromium is installed`);
            }
        }
    }
}

console.log(`\n✓ PDF generation complete`);
console.log(`Output directory: ${pdf_output_dir}`);
