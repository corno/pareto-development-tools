#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { validate_repository_structure } from '../lib/structure_validation_utils';

// Get target repository from command line argument

function main(): void {
    const args = process.argv.slice(2);
    const target_repo = args.find(arg => !arg.startsWith('-'));
    const verbose = args.includes('-v') || args.includes('--verbose');
    const raw = args.includes('--raw');
    const help = args.includes('-h') || args.includes('--help');
    if (help || !target_repo) {
        console.log('Usage: pareto validate-structure <repository-path> [options]');
        console.log('');
        console.log('Validates that a single repository only contains files');
        console.log('specified in structure.json.');
        console.log('');
        console.log('Options:');
        console.log('  -v, --verbose    Show all violations');
        console.log('  --raw            Output raw JSON array of issues');
        console.log('  -h, --help       Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  validate_structure.js ../my-repo');
        console.log('  validate_structure.js ../my-repo --verbose');
        console.log('  validate_structure.js ../my-repo --raw');
        
        if (!target_repo) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }
    const repo_path = path.resolve(target_repo);
    if (!fs.existsSync(repo_path)) {
        console.error(`Error: Repository ${repo_path} does not exist`);
        process.exit(1);
    }
    if (!fs.statSync(repo_path).isDirectory()) {
        console.error(`Error: ${repo_path} is not a directory`);
        process.exit(1);
    }
    const structure_path = path.join(__dirname, '..', 'data', 'structure.json');
    if (!fs.existsSync(structure_path)) {
        console.error('Error: structure.json not found');
        process.exit(1);
    }
    const allowed_structure = JSON.parse(fs.readFileSync(structure_path, 'utf8'));
    const validation_result = validate_repository_structure(repo_path, allowed_structure, verbose);
    if (raw) {
        console.log(JSON.stringify(validation_result.issues, null, 2));
        process.exit(validation_result.errors.length > 0 ? 1 : 0);
    }
    console.log(`Validating: ${repo_path}`);
    console.log('');
    if (validation_result.errors.length === 0 && validation_result.warnings.length === 0) {
        console.log('✅ No violations found');
        process.exit(0);
    }
    if (validation_result.errors.length > 0) {
        console.log(`❌ Found ${validation_result.errors.length} error(s):`);
        for (const error_path of validation_result.errors) {
            const relative_path = path.relative(repo_path, error_path);
            const type = fs.existsSync(error_path) && fs.statSync(error_path).isDirectory() ? '📁' : '📄';
            console.log(`   ${type} ${relative_path}`);
        }
        console.log('');
    }
    if (validation_result.warnings.length > 0) {
        console.log(`⚠️  Found ${validation_result.warnings.length} warning(s):`);
        for (const warning_path of validation_result.warnings) {
            const relative_path = path.relative(repo_path, warning_path);
            const type = fs.existsSync(warning_path) && fs.statSync(warning_path).isDirectory() ? '📁' : '📄';
            console.log(`   ${type} ${relative_path}`);
        }
        console.log('');
    }
    if (validation_result.errors.length > 0) {
        process.exit(1);
    }
}

main();
