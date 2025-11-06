import { execSync } from 'child_process';
import * as fs from 'fs';

/**
 * Convert DOT content to SVG using GraphViz
 * @param dot_content - The DOT format content
 * @returns SVG content as string
 */
export function dot_to_svg(dot_content: string): string {
    // Check if dot command is available
    try {
        execSync('which dot', { stdio: 'pipe' });
    } catch {
        throw new Error('GraphViz (dot command) not found. Please install GraphViz first.');
    }
    
    // Create a temporary DOT file
    const temp_dot_file = `/tmp/temp-${Date.now()}.dot`;
    const temp_svg_file = `/tmp/temp-${Date.now()}.svg`;
    
    try {
        // Write DOT content to temporary file
        fs.writeFileSync(temp_dot_file, dot_content);
        
        // Generate SVG from DOT
        execSync(`dot -Tsvg ${temp_dot_file} -o ${temp_svg_file}`, { stdio: 'pipe' });
        
        // Read the generated SVG
        const svg_content = fs.readFileSync(temp_svg_file, 'utf8');
        
        // Clean up temporary files
        fs.unlinkSync(temp_dot_file);
        fs.unlinkSync(temp_svg_file);
        
        return svg_content;
    } catch (err: any) {
        // Clean up temporary files in case of error
        if (fs.existsSync(temp_dot_file)) {
            fs.unlinkSync(temp_dot_file);
        }
        if (fs.existsSync(temp_svg_file)) {
            fs.unlinkSync(temp_svg_file);
        }
        throw new Error(`Failed to convert DOT to SVG: ${err.message}`);
    }
}
