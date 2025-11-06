import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync } from 'child_process';
import { differs_from_published } from '../old_lib/differs_from_published';

export type Compare_With_Published_Parameters = {
    'package path': string
}

export type Compare_With_Published_Result = 
    | ['could not compare',
        | ['no package json', null]
        | ['no package name', null] 
        | ['not published', null]
    ]
    | ['could compare',
        | ['identical', null]
        | ['different', {
            'path to local': string
            'path to published': string
        }]
    ]

/**
 * Compare a local package with its published version on npm
 * 
 * This query checks if a package differs from its published version by:
 * 1. Verifying package.json exists and has a name
 * 2. Checking if the package exists on npm
 * 3. Comparing local and published versions
 * 4. Performing content comparison using differs_from_published
 * 
 * @param $p Parameters containing the package path
 * @returns Result indicating whether comparison was possible and the outcome
 */
export function compare_with_published(
    $p: Compare_With_Published_Parameters
): Compare_With_Published_Result {
    const package_json_path = path.join($p['package path'], 'pub', 'package.json');
    
    // Check if package.json exists
    if (!fs.existsSync(package_json_path)) {
        return ['could not compare', ['no package json', null]];
    }

    let package_content: any;
    try {
        package_content = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
    } catch (error) {
        return ['could not compare', ['no package json', null]];
    }

    const package_name = package_content.name;
    if (!package_name) {
        return ['could not compare', ['no package name', null]];
    }

    const local_version = package_content.version || '0.0.0';

    // Check if package exists on npm and get published version
    let published_version: string;
    try {
        const npm_view_output = execSync(`npm view ${package_name} version`, {
            stdio: 'pipe',
            encoding: 'utf8'
        }).trim();

        if (!npm_view_output || npm_view_output.includes('npm ERR!')) {
            return ['could not compare', ['not published', null]];
        }

        published_version = npm_view_output;
    } catch (npmError: any) {
        // Check if the error is due to package not found
        const error_text = (npmError.stdout || '') + (npmError.stderr || '') + (npmError.message || '');
        if (error_text.includes('E404') || error_text.includes('Not Found') || error_text.includes('not in this registry')) {
            return ['could not compare', ['not published', null]];
        }
        console.error('Error while checking npm registry:', npmError.message);
        process.exit(1);
    }

    // Package exists on npm, now check if content differs
    let content_differs: boolean;
    try {
        content_differs = differs_from_published($p['package path']);
    } catch (error) {
        // If we can't determine content differences, assume they differ
        content_differs = true;
    }

    // Determine if versions differ
    const version_differs = local_version !== published_version;

    if (!content_differs && !version_differs) {
        return ['could compare', ['identical', null]];
    } else {
        // Packages differ - extract both for comparison
        const temp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'package-compare-'));
        const published_dir = path.join(temp_dir, 'published');
        const local_dir = path.join(temp_dir, 'local');
        
        try {
            // Extract published package
            fs.mkdirSync(published_dir, { recursive: true });
            execSync(`npm pack ${package_name}`, {
                cwd: published_dir,
                stdio: 'pipe'
            });
            
            const published_tgz = fs.readdirSync(published_dir).find(file => file.endsWith('.tgz'));
            if (published_tgz) {
                execSync(`tar -xzf "${published_tgz}"`, {
                    cwd: published_dir,
                    stdio: 'pipe'
                });
                
                // Move contents from package/ subdirectory
                const package_sub_dir = path.join(published_dir, 'package');
                if (fs.existsSync(package_sub_dir)) {
                    const files = fs.readdirSync(package_sub_dir);
                    files.forEach(file => {
                        const source = path.join(package_sub_dir, file);
                        const dest = path.join(published_dir, file);
                        fs.renameSync(source, dest);
                    });
                    fs.rmSync(package_sub_dir, { recursive: true });
                }
                
                // Clean up tgz file
                fs.unlinkSync(path.join(published_dir, published_tgz));
            }
            
            // Extract local package
            fs.mkdirSync(local_dir, { recursive: true });
            const pub_path = path.join($p['package path'], 'pub');
            execSync(`npm pack "${pub_path}"`, {
                cwd: local_dir,
                stdio: 'pipe'
            });
            
            const local_tgz = fs.readdirSync(local_dir).find(file => file.endsWith('.tgz'));
            if (local_tgz) {
                execSync(`tar -xzf "${local_tgz}"`, {
                    cwd: local_dir,
                    stdio: 'pipe'
                });
                
                // Move contents from package/ subdirectory
                const package_sub_dir = path.join(local_dir, 'package');
                if (fs.existsSync(package_sub_dir)) {
                    const files = fs.readdirSync(package_sub_dir);
                    files.forEach(file => {
                        const source = path.join(package_sub_dir, file);
                        const dest = path.join(local_dir, file);
                        fs.renameSync(source, dest);
                    });
                    fs.rmSync(package_sub_dir, { recursive: true });
                }
                
                // Clean up tgz file
                fs.unlinkSync(path.join(local_dir, local_tgz));
            }
            
            return ['could compare', ['different', {
                'path to local': local_dir,
                'path to published': published_dir
            }]];
            
        } catch (error) {
            // Clean up on error
            if (fs.existsSync(temp_dir)) {
                fs.rmSync(temp_dir, { recursive: true, force: true });
            }
            // If extraction fails, fall back to just indicating difference
            return ['could compare', ['different', {
                'path to local': '',
                'path to published': ''
            }]];
        }
    }
}