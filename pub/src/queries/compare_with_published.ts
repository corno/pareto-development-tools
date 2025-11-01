import * as fs from 'fs';
import * as path from 'path';
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
            'local version': string
            'published version': string
            'content differs': boolean
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
        return ['could compare', ['different', {
            'local version': local_version,
            'published version': published_version,
            'content differs': content_differs
        }]];
    }
}