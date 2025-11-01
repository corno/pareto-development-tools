// #!/usr/bin/env node
// import * as fs from 'fs';
// import * as path from 'path';
// import * as os from 'os';
// import { is_node_project } from '../old_lib/build_test_utils';
// import { extract_local, extract_published, launch_beyond_compare_if_directories_are_not_equal } from '../old_lib/package_compare_utils';

// // Get package directory and flags from command line arguments
// const args = process.argv.slice(2);
// const package_dir = args.find(arg => !arg.startsWith('-'));
// const is_verbose = args.includes('-v') || args.includes('--verbose');
// const skip_build = args.includes('--skip-build');

// if (!package_dir) {
//     console.error('Usage: pareto compare <package-directory> [-v|--verbose] [--skip-build]');
//     console.error('  -v, --verbose    Show detailed output');
//     console.error('  --skip-build     Skip building the local package (use existing dist)');
//     process.exit(1);
// }

// const package_path = path.resolve(package_dir);

// // Check if it's a valid Node.js project
// if (!is_node_project(package_path)) {
//     console.error(`Error: package.json not found in ${package_path}`);
//     process.exit(1);
// }

// console.log(`Comparing package at: ${package_path}`);

// async function main() {
//     let temp_dir;
    
//     try {
//         // Create temporary directory
//         temp_dir = fs.mkdtempSync(path.join(os.tmpdir(), 'package-compare-'));
//         const published_dir = path.join(temp_dir, 'published');
//         const local_dir = path.join(temp_dir, 'local');
        
//         if (is_verbose) {
//             console.log(`Created temp directory: ${temp_dir}`);
//         }
        
//         // Read package.json to get package name
//         const package_json_path = path.join(package_path, 'pub', 'package.json');
//         const package_json = JSON.parse(fs.readFileSync(package_json_path, 'utf8'));
//         const package_name = package_json.name;
        
//         // Extract published package
//         const published_result = extract_published(package_name, published_dir, { verbose: is_verbose });
        
//         if (published_result.error) {
//             console.error(`❌ Error extracting published package: ${published_result.error}`);
//             process.exit(1);
//         }
        
//         if (!published_result.package_exists) {
//             console.error(`❌ Package "${package_name}" not found on npm registry`);
//             console.error('This might be a new package that hasn\'t been published yet.');
//             process.exit(1);
//         }
        
//         // Extract local package
//         const local_result = extract_local(package_path, local_dir, { 
//             verbose: is_verbose, 
//             skipBuild: skip_build 
//         });
        
//         if (local_result.error) {
//             console.error(`❌ Error extracting local package: ${local_result.error}`);
//             process.exit(1);
//         }
        
//         if (local_result.build_failed) {
//             console.log(`⚠️ Build failed for ${local_result.package_name}, but proceeding with comparison...`);
//         }
        
//         // Compare the directories
//         const compare_result = launch_beyond_compare_if_directories_are_not_equal(published_dir, local_dir, { 
//             verbose: is_verbose 
//         });
        
//         if (compare_result.error) {
//             console.error(`❌ Error comparing packages: ${compare_result.error}`);
//             process.exit(1);
//         }
        
//         if (compare_result.identical) {
//             console.log('🎉 Packages are identical!');
//             console.log('The local package matches the published version.');
//         } else {
//             if (local_result.build_failed) {
//                 console.log('🔧 Local build failed - showing what the published package contains:');
//             } else {
//                 console.log('📊 Packages differ!');
//             }
            
//             if (is_verbose) {
//                 console.log(`Published package: ${published_dir}`);
//                 console.log(`Local package: ${local_dir}`);
//             }
            
//             if (compare_result.beyond_compare_launched) {
//                 if (local_result.build_failed) {
//                     console.log('Beyond Compare launched - you can see the published package contents and fix the build.');
//                 } else {
//                     console.log('Beyond Compare launched for detailed comparison.');
//                 }
//                 console.log(`\nTemp directory preserved: ${temp_dir}`);
//                 console.log('You can manually delete it when done with Beyond Compare.');
//                 // Don't clean up temp directory since Beyond Compare is using it
//                 return;
//             }
//         }
        
//     } catch (err) {
//         console.error(`❌ Unexpected error: ${err.message}`);
//         process.exit(1);
//     } finally {
//         // Clean up temp directory if Beyond Compare wasn't launched
//         if (temp_dir && fs.existsSync(temp_dir)) {
//             try {
//                 fs.rmSync(temp_dir, { recursive: true, force: true });
//             } catch (cleanup_err) {
//                 // Ignore cleanup errors
//             }
//         }
//     }
// }

// main();