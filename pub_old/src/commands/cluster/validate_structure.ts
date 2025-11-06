// #!/usr/bin/env node
// import * as fs from 'fs';
// import * as path from 'path';
// import { validate_repository_structure } from '../../old_lib/structure_validation_utils';
// import { analyze_dependencies, get_build_order } from '../../old_lib/dependency_graph_utils';

// // Get target directory from command line argument

// function main(): void {
//     const args = process.argv.slice(2);
//     const target_dir = args.find(arg => !arg.startsWith('-'));
//     const verbose = args.includes('-v') || args.includes('--verbose');
//     const help = args.includes('-h') || args.includes('--help');
//     if (help || !target_dir) {
//         console.log('Usage: pareto all validate-structure <directory> [options]');
//         console.log('');
//         console.log('Validates that all repositories in a directory only contain files');
//         console.log('specified in structure.json.');
//         console.log('');
//         console.log('Options:');
//         console.log('  -v, --verbose    Show all violations for each repository');
//         console.log('  -h, --help       Show this help message');
//         console.log('');
//         console.log('Examples:');
//         console.log('  validate_structure.js ../pareto-repositories');
//         console.log('  validate_structure.js ../my-repos --verbose');
        
//         if (!target_dir) {
//             process.exit(1);
//         } else {
//             process.exit(0);
//         }
//     }
//     const base_dir = path.resolve(target_dir);
//     if (!fs.existsSync(base_dir)) {
//         console.error(`Error: Directory ${target_dir} does not exist`);
//         process.exit(1);
//     }
//     const structure_path = path.join(__dirname, '../../../..', 'data', 'structure.json');
//     if (!fs.existsSync(structure_path)) {
//         console.error('Error: structure.json not found');
//         process.exit(1);
//     }
//     const allowed_structure = JSON.parse(fs.readFileSync(structure_path, 'utf8'));
//     console.log(`Analyzing dependencies in ${target_dir}...`);
//     const graph_data = analyze_dependencies(base_dir, true);
//     if (!graph_data || !graph_data.projects || graph_data.projects.length === 0) {
//         console.log('No Node.js projects found in the specified directory.');
//         process.exit(0);
//     }
//     const ordered_projects_data = get_build_order(graph_data);
//     const projects = ordered_projects_data.map(pkg => ({
//         name: pkg.name,
//         path: pkg.path
//     }));
//     console.log(`Found ${projects.length} projects to validate (in dependency order)`);
//     console.log('');
//     let total_violations = 0;
//     let total_warnings = 0;
//     const results = [];
//     for (const project of projects) {
//         const validation_result = validate_repository_structure(project.path, allowed_structure, verbose);
        
//         const violations = validation_result.errors.map(full_path => ({
//             type: fs.statSync(full_path).isDirectory() ? 'directory' : 'file',
//             path: path.relative(project.path, full_path),
//             full_path: full_path
//         }));
        
//         const warnings = validation_result.warnings.map(full_path => ({
//             type: fs.statSync(full_path).isDirectory() ? 'directory' : 'file',
//             path: path.relative(project.path, full_path),
//             full_path: full_path
//         }));
        
//         results.push({
//             name: project.name,
//             path: project.path,
//             violations: violations,
//             warnings: warnings,
//             violation_count: violations.length,
//             warning_count: warnings.length
//         });
        
//         total_violations += violations.length;
//         total_warnings += warnings.length;
//     }
//     for (const result of results) {
//         if (result.violation_count === 0 && result.warning_count === 0) {
//             console.log(`✅ ${result.name}: No violations`);
//         } else {
//             const parts = [];
//             if (result.violation_count > 0) {
//                 parts.push(`${result.violation_count} error(s)`);
//             }
//             if (result.warning_count > 0) {
//                 parts.push(`${result.warning_count} warning(s)`);
//             }
//             const icon = result.violation_count > 0 ? '❌' : '⚠️';
//             console.log(`${icon} ${result.name}: ${parts.join(', ')}`);
            
//             // Always show the repository path as a clickable link
//             console.log(`   📂 ${result.path}`);
            
//             if (verbose) {
//                 if (result.violations.length > 0) {
//                     for (const violation of result.violations) {
//                         console.log(`   ❌ ${violation.type === 'directory' ? '📁' : '📄'} ${violation.full_path}`);
//                     }
//                 }
//                 if (result.warnings.length > 0) {
//                     for (const warning of result.warnings) {
//                         console.log(`   ⚠️  ${warning.type === 'directory' ? '📁' : '📄'} ${warning.full_path}`);
//                     }
//                 }
//             }
//         }
//     }
//     console.log('');
//     console.log('Summary:');
//     console.log(`  Total projects: ${projects.length}`);
//     console.log(`  Projects with violations: ${results.filter(r => r.violation_count > 0).length}`);
//     console.log(`  Projects without violations: ${results.filter(r => r.violation_count === 0).length}`);
//     console.log(`  Total violations: ${total_violations}`);
//     if (total_violations > 0) {
//         if (!verbose) {
//             console.log('');
//             console.log('💡 Tip: Use --verbose to see all violations');
//         }
//         process.exit(1);
//     }
// }

// main();
