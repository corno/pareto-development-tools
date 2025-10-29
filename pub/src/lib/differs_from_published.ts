import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';

/**
 * Check if a package differs from its published version
 * 
 * This function replicates the publish-compare logic from the dependency graph:
 * 1. Downloads the published package from npm
 * 2. Creates a local package using npm pack
 * 3. Compares the contents using diff
 * 
 * @param package_path - Path to the package directory (should contain pub/ subdirectory)
 * @returns boolean - True if package differs from published version
 */
export function differs_from_published(package_path: string): boolean {
    const pub_path = path.join(package_path, 'pub');
    const package_json_path = path.join(pub_path, 'package.json');
    
    // Check if package.json exists
    if (!fs.existsSync(package_json_path)) {
        return true; // No package.json = differs (can't be published)
    }
    
    try {
        const package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const package_name = package_content.name;
        const package_version = package_content.version;
        
        if (!package_name) {
            return true; // No package name = differs
        }
        
        // Check if package exists on npm
        try {
            const npm_view_output = execSync(`npm view ${package_name} version`, { 
                stdio: 'pipe', 
                encoding: 'utf8' 
            }).trim();
            
            if (!npm_view_output || npm_view_output.includes('npm ERR!')) {
                return true; // Not published = differs
            }
            
            const published_version = npm_view_output.trim();
            
            if (published_version !== package_version) {
                return true; // Version mismatch = differs
            }
            
        } catch (npmError) {
            return true; // Can't check npm = assume differs
        }
        
        // Create comparison directories
        const { published_dir, local_dir, cleanup } = create_comparison_dirs(package_name);
        
        try {
            // Extract published package
            extract_published_package(package_name, published_dir);
            
            // Create local package
            extract_local_package(pub_path, local_dir);
            
            // Compare the directories
            return compare_package_contents(published_dir, local_dir);
            
        } finally {
            cleanup();
        }
        
    } catch (err) {
        // Any error = assume differs
        return true;
    }
}

/**
 * Create temporary directories for package comparison
 * 
 * @param package_name - Name of the package (used for temp dir naming)
 * @returns Object with directory paths and cleanup function
 */
function create_comparison_dirs(package_name: string): {
    published_dir: string,
    local_dir: string,
    cleanup: () => void
} {
    const safe_name = package_name.replace(/[^a-zA-Z0-9]/g, '_');
    const temp_dir = fs.mkdtempSync(path.join(os.tmpdir(), `sync-check-${safe_name}-`));
    const published_dir = path.join(temp_dir, 'published');
    const local_dir = path.join(temp_dir, 'local');
    
    fs.mkdirSync(published_dir, { recursive: true });
    fs.mkdirSync(local_dir, { recursive: true });
    
    const cleanup = () => {
        if (fs.existsSync(temp_dir)) {
            fs.rmSync(temp_dir, { recursive: true, force: true });
        }
    };
    
    return { published_dir, local_dir, cleanup };
}

/**
 * Extract published package from npm registry
 * 
 * @param package_name - Name of the package to download
 * @param published_dir - Directory to extract package into
 */
function extract_published_package(package_name: string, published_dir: string): void {
    // Download and extract published package
    execSync(`npm pack ${package_name}`, {
        cwd: published_dir,
        stdio: 'pipe'
    });
    
    const tgz_files = fs.readdirSync(published_dir).filter(file => file.endsWith('.tgz'));
    if (tgz_files.length > 0) {
        execSync(`tar -xzf "${tgz_files[0]}"`, {
            cwd: published_dir,
            stdio: 'pipe'
        });
        
        // Move contents from package/ subdirectory to published_dir
        const package_sub_dir = path.join(published_dir, 'package');
        if (fs.existsSync(package_sub_dir)) {
            move_package_contents(package_sub_dir, published_dir);
        }
        
        // Clean up tgz file
        fs.unlinkSync(path.join(published_dir, tgz_files[0]));
    }
}

/**
 * Extract local package using npm pack
 * 
 * @param pub_path - Path to the pub directory
 * @param local_dir - Directory to extract package into
 */
function extract_local_package(pub_path: string, local_dir: string): void {
    // Create local package
    execSync(`npm pack "${pub_path}"`, {
        cwd: local_dir,
        stdio: 'pipe'
    });
    
    const local_tgz_files = fs.readdirSync(local_dir).filter(file => file.endsWith('.tgz'));
    if (local_tgz_files.length > 0) {
        execSync(`tar -xzf "${local_tgz_files[0]}"`, {
            cwd: local_dir,
            stdio: 'pipe'
        });
        
        // Move contents from package/ subdirectory
        const local_package_sub_dir = path.join(local_dir, 'package');
        if (fs.existsSync(local_package_sub_dir)) {
            move_package_contents(local_package_sub_dir, local_dir);
        }
        
        // Clean up tgz file
        fs.unlinkSync(path.join(local_dir, local_tgz_files[0]));
    }
}

/**
 * Move package contents from subdirectory to parent directory
 * 
 * @param source_dir - Source directory (package/ subdirectory)
 * @param target_dir - Target directory (parent)
 */
function move_package_contents(source_dir: string, target_dir: string): void {
    const files = fs.readdirSync(source_dir);
    files.forEach(file => {
        const source_file_path = path.join(source_dir, file);
        const dest_path = path.join(target_dir, file);
        
        // Remove existing file/directory if it exists
        if (fs.existsSync(dest_path)) {
            fs.rmSync(dest_path, { recursive: true, force: true });
        }
        
        // Move the file/directory
        fs.renameSync(source_file_path, dest_path);
    });
    
    // Remove the now-empty package subdirectory
    fs.rmSync(source_dir, { recursive: true });
}

/**
 * Compare package contents using diff
 * 
 * @param published_dir - Directory containing published package
 * @param local_dir - Directory containing local package
 * @returns boolean - True if packages differ, false if identical
 */
function compare_package_contents(published_dir: string, local_dir: string): boolean {
    try {
        execSync(`diff -r "${published_dir}" "${local_dir}"`, {
            stdio: 'pipe'
        });
        
        // If diff succeeds with no output, packages are identical
        return false;
        
    } catch (diffError) {
        // If diff fails or has output, packages differ
        return true;
    }
}