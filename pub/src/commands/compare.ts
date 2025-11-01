#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { is_node_project } from '../old_lib/is_node_project';
import { compare_with_published } from '../queries/compare_with_published';

// Utility types for package extraction
interface ExtractResult {
    success: boolean;
    error?: string;
    package_exists?: boolean;
    build_failed?: boolean;
    package_name?: string;
}

// Get package directory and flags from command line arguments
const args = process.argv.slice(2);
const package_dir = args.find(arg => !arg.startsWith('-'));
const is_verbose = args.includes('-v') || args.includes('--verbose');
const skip_build = args.includes('--skip-build');

if (!package_dir) {
    console.error('Usage: pareto compare <package-directory> [-v|--verbose] [--skip-build]');
    console.error('  -v, --verbose    Show detailed output');
    console.error('  --skip-build     Skip building the local package (use existing dist)');
    process.exit(1);
}

const package_path = path.resolve(package_dir);

// Check if it's a valid Node.js project
if (!is_node_project(package_path)) {
    console.error(`Error: package.json not found in ${package_path}`);
    process.exit(1);
}

// Extract published package from npm registry
function extract_published(package_name: string, target_dir: string, options: { verbose?: boolean } = {}): ExtractResult {
    try {
        // Check if package exists on npm
        try {
            execSync(`npm view ${package_name} version`, { 
                stdio: 'pipe', 
                encoding: 'utf8' 
            });
        } catch (npmError) {
            return { success: false, package_exists: false };
        }

        if (options.verbose) {
            console.log(`Downloading published package: ${package_name}`);
        }

        // Download and extract published package
        execSync(`npm pack ${package_name}`, {
            cwd: target_dir,
            stdio: options.verbose ? 'inherit' : 'pipe'
        });
        
        const tgz_files = fs.readdirSync(target_dir).filter(file => file.endsWith('.tgz'));
        if (tgz_files.length > 0) {
            execSync(`tar -xzf "${tgz_files[0]}"`, {
                cwd: target_dir,
                stdio: 'pipe'
            });
            
            // Move contents from package/ subdirectory to target_dir
            const package_sub_dir = path.join(target_dir, 'package');
            if (fs.existsSync(package_sub_dir)) {
                const files = fs.readdirSync(package_sub_dir);
                files.forEach(file => {
                    const source_file_path = path.join(package_sub_dir, file);
                    const dest_path = path.join(target_dir, file);
                    
                    if (fs.existsSync(dest_path)) {
                        fs.rmSync(dest_path, { recursive: true, force: true });
                    }
                    
                    fs.renameSync(source_file_path, dest_path);
                });
                
                fs.rmSync(package_sub_dir, { recursive: true });
            }
            
            // Clean up tgz file
            fs.unlinkSync(path.join(target_dir, tgz_files[0]));
        }

        return { success: true, package_exists: true };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
        };
    }
}

// Extract local package using npm pack
function extract_local(package_path: string, target_dir: string, options: { verbose?: boolean, skipBuild?: boolean } = {}): ExtractResult {
    try {
        const pub_path = path.join(package_path, 'pub');
        const package_json_path = path.join(pub_path, 'package.json');
        
        if (!fs.existsSync(package_json_path)) {
            return { success: false, error: 'package.json not found in pub/ directory' };
        }

        const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
        const package_name = package_json.name;

        // Build the package if not skipping build
        if (!options.skipBuild) {
            try {
                if (options.verbose) {
                    console.log(`Building local package: ${package_name}`);
                }
                execSync('npm run build', {
                    cwd: pub_path,
                    stdio: options.verbose ? 'inherit' : 'pipe'
                });
            } catch (buildError) {
                if (options.verbose) {
                    console.log(`Build failed for ${package_name}, but proceeding...`);
                }
                return { 
                    success: true, 
                    build_failed: true, 
                    package_name 
                };
            }
        }

        if (options.verbose) {
            console.log(`Packing local package: ${package_name}`);
        }

        // Create local package using npm pack
        execSync(`npm pack "${pub_path}"`, {
            cwd: target_dir,
            stdio: options.verbose ? 'inherit' : 'pipe'
        });
        
        const tgz_files = fs.readdirSync(target_dir).filter(file => file.endsWith('.tgz'));
        if (tgz_files.length > 0) {
            execSync(`tar -xzf "${tgz_files[0]}"`, {
                cwd: target_dir,
                stdio: 'pipe'
            });
            
            // Move contents from package/ subdirectory
            const package_sub_dir = path.join(target_dir, 'package');
            if (fs.existsSync(package_sub_dir)) {
                const files = fs.readdirSync(package_sub_dir);
                files.forEach(file => {
                    const source_file_path = path.join(package_sub_dir, file);
                    const dest_path = path.join(target_dir, file);
                    
                    if (fs.existsSync(dest_path)) {
                        fs.rmSync(dest_path, { recursive: true, force: true });
                    }
                    
                    fs.renameSync(source_file_path, dest_path);
                });
                
                fs.rmSync(package_sub_dir, { recursive: true });
            }
            
            // Clean up tgz file
            fs.unlinkSync(path.join(target_dir, tgz_files[0]));
        }

        return { success: true, package_name };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
        };
    }
}

// Try to launch Beyond Compare
function launch_beyond_compare(dir1: string, dir2: string, options: { verbose?: boolean } = {}): boolean {
    const beyond_compare_commands = [
        'bcompare',  // Linux/macOS
        'bcomp',     // Alternative Linux command
        '/usr/bin/bcompare',  // Explicit path
        '/opt/beyondcompare/bin/bcompare'  // Alternative path
    ];

    for (const cmd of beyond_compare_commands) {
        try {
            if (options.verbose) {
                console.log(`Attempting to launch Beyond Compare with: ${cmd}`);
            }
            
            execSync(`${cmd} "${dir1}" "${dir2}"`, {
                stdio: 'pipe'
            });
            
            return true;
        } catch (error) {
            // Try next command
            continue;
        }
    }

    if (options.verbose) {
        console.log('Beyond Compare not found, trying generic diff viewer...');
    }

    // Fallback to other diff tools
    const fallback_commands = [
        `meld "${dir1}" "${dir2}"`,
        `kompare "${dir1}" "${dir2}"`,
        `diff -r "${dir1}" "${dir2}"`
    ];

    for (const cmd of fallback_commands) {
        try {
            execSync(cmd, {
                stdio: 'inherit'
            });
            return true;
        } catch (error) {
            continue;
        }
    }

    return false;
}

console.log(`Comparing package at: ${package_path}`);

async function main() {
    
    // Use the new compare_with_published query
    const comparison_result = compare_with_published({ 'package path': package_path });
    
    if (comparison_result[0] === 'could not compare') {
        const [_, reason] = comparison_result;
        
        switch (reason[0]) {
            case 'no package json':
                console.error('❌ No package.json found in pub/ directory');
                break;
            case 'no package name':
                console.error('❌ No package name specified in package.json');
                break;
            case 'not published':
                console.error('❌ Package not found on npm registry');
                console.error('This might be a new package that hasn\'t been published yet.');
                break;
        }
        process.exit(1);
    }
    
    // comparison_result[0] === 'could compare'
    const [_, result] = comparison_result;
    
    if (result[0] === 'identical') {
        console.log('🎉 Packages are identical!');
        console.log('The local package matches the published version.');
        return;
    }
    
    // Packages differ - show info and optionally launch Beyond Compare
    const { 'local version': local_version, 'published version': published_version, 'content differs': content_differs } = result[1];
    
    console.log('📊 Packages differ!');
    
    if (local_version !== published_version) {
        console.log(`Version difference: local=${local_version}, published=${published_version}`);
    }
    
    if (content_differs) {
        console.log('Content differences detected');
    }
    
    if (is_verbose) {
        console.log(`Local version: ${local_version}`);
        console.log(`Published version: ${published_version}`);
        console.log(`Content differs: ${content_differs}`);
    }
    
    // If user wants detailed comparison, extract packages and launch Beyond Compare
    if (content_differs) {
        let temp_dir;
        
        try {
            // Create temporary directory
            temp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'package-compare-'));
            const published_dir = path.join(temp_dir, 'published');
            const local_dir = path.join(temp_dir, 'local');
            
            if (is_verbose) {
                console.log(`Created temp directory: ${temp_dir}`);
            }
            
            // Read package.json to get package name
            const package_json_path = path.join(package_path, 'pub', 'package.json');
            const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
            const package_name = package_json.name;
            
            // Extract published package
            const published_result = extract_published(package_name, published_dir, { verbose: is_verbose });
            
            if (!published_result.success) {
                console.error(`❌ Error extracting published package: ${published_result.error}`);
                return;
            }
            
            // Extract local package
            const local_result = extract_local(package_path, local_dir, { 
                verbose: is_verbose, 
                skipBuild: skip_build 
            });
            
            if (!local_result.success) {
                console.error(`❌ Error extracting local package: ${local_result.error}`);
                return;
            }
            
            if (local_result.build_failed) {
                console.log(`⚠️ Build failed for ${local_result.package_name}, but proceeding with comparison...`);
            }
            
            // Try to launch Beyond Compare
            const beyond_compare_launched = launch_beyond_compare(published_dir, local_dir, { verbose: is_verbose });
            
            if (beyond_compare_launched) {
                if (local_result.build_failed) {
                    console.log('Beyond Compare launched - you can see the published package contents and fix the build.');
                } else {
                    console.log('Beyond Compare launched for detailed comparison.');
                }
                console.log(`\nTemp directory preserved: ${temp_dir}`);
                console.log('You can manually delete it when done with Beyond Compare.');
                // Don't clean up temp directory since Beyond Compare is using it
                return;
            } else {
                console.log('Could not launch Beyond Compare or other diff tools.');
                
                if (is_verbose) {
                    console.log(`Published package: ${published_dir}`);
                    console.log(`Local package: ${local_dir}`);
                    console.log('You can manually compare these directories.');
                }
            }
            
        } catch (err) {
            console.error(`❌ Error during detailed comparison: ${(err as Error).message}`);
        } finally {
            // Clean up temp directory if Beyond Compare wasn't launched
            if (temp_dir && fs.existsSync(temp_dir)) {
                try {
                    fs.rmSync(temp_dir, { recursive: true, force: true });
                } catch (cleanup_err) {
                    // Ignore cleanup errors
                }
            }
        }
    }
}

main();