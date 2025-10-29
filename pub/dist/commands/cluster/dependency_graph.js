#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const determine_project_cluster_state_1 = require("../../lib/determine_project_cluster_state");
const project_cluster_state_to_dot_1 = require("../../lib/project_cluster_state_to_dot");
const differs_from_published_1 = require("../../lib/differs_from_published");
// Get target directory from command line argument
const args = process.argv.slice(2);
// Parse flags
const verbose = args.includes('--verbose') || args.includes('-v');
const show_path = args.includes('--show-path') || args.includes('-p');
const show_command = args.includes('--show-command') || args.includes('-c');
const output_dot = args.includes('--dot');
const show_legend = args.includes('--legend') || args.includes('-l');
const skip_publish_compare = args.includes('--skip-publish-compare');
const output_svg = !output_dot; // SVG is default
// Filter out flags to get positional arguments
const positional_args = args.filter(arg => !arg.startsWith('--') && !arg.startsWith('-'));
const target_dir = positional_args[0];
// Default output file
let output_file;
if (positional_args.length === 1) {
    output_file = output_svg ? 'dependencies.svg' : 'dependencies.dot';
}
else {
    output_file = positional_args[1];
}
if (!target_dir || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: dependency-graph <directory> [output_file] [options]');
    console.log('');
    console.log('Generates an SVG dependency graph by default and opens it automatically.');
    console.log('');
    console.log('Options:');
    console.log('  --verbose, -v            Show verbose output');
    console.log('  --dot                    Output DOT format instead of SVG format');
    console.log('  --legend, -l             Include legend in the graph');
    console.log('  --skip-publish-compare   Skip checking if packages are in sync with published versions');
    console.log('  --show-path, -p          Show file path after generation (skips auto-open)');
    console.log('  --show-command, -c       Show command to open it (skips auto-open)');
    console.log('  --help, -h               Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  dependency-graph ../my-repos');
    console.log('  dependency-graph ../my-repos deps.svg --verbose');
    console.log('  dependency-graph ../my-repos deps.dot --dot');
    if (!target_dir) {
        process.exit(1);
    }
    else {
        process.exit(0);
    }
}
const base_dir = path.resolve(target_dir);
if (!fs.existsSync(base_dir)) {
    console.error(`Error: Directory ${target_dir} does not exist`);
    process.exit(1);
}
console.log(`Analyzing dependencies in ${target_dir}...`);
// Analyze project cluster state
const cluster_state = (0, determine_project_cluster_state_1.determine_project_cluster_state)(base_dir);
const project_names = Object.keys(cluster_state.projects).filter(name => cluster_state.projects[name][0] === 'project');
if (project_names.length === 0) {
    console.error('No projects found in the specified directory');
    process.exit(1);
}
// Helper to get relative path for display
const get_relative_path = (absolute_path) => {
    const rel = path.relative(process.cwd(), absolute_path);
    return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
};
console.log(`Found ${project_names.length} projects:`);
for (const project_name of project_names) {
    const project_entry = cluster_state.projects[project_name];
    if (project_entry && project_entry[0] === 'project') {
        const project_state = project_entry[1];
        const project_path = path.join(base_dir, project_name);
        const dep_count = Object.keys(project_state.dependencies).length;
        const info = verbose ? ` (${dep_count} deps)` : '';
        // Check if package name matches directory name
        const name_mismatch = !project_state['package name in sync with directory name'];
        const warning = name_mismatch ? ' ⚠️  (name mismatch)' : '';
        console.log(`  - ${get_relative_path(project_path)}${info}${warning}`);
        if (name_mismatch && verbose) {
            console.log(`    ⚠️  Warning: Package name doesn't match directory name '${project_name}'`);
        }
    }
}
// Check sync status with published versions if not skipped
const publish_sync_status = new Map();
if (!skip_publish_compare) {
    console.log('\nChecking sync status with published versions... (skip with --skip-publish-compare)');
    for (const project_name of project_names) {
        const project_path = path.join(base_dir, project_name);
        const differs = (0, differs_from_published_1.differs_from_published)(project_path);
        publish_sync_status.set(project_name, !differs); // in_sync = !differs
        if (verbose) {
            console.log(`  - ${project_name}: ${differs ? 'differs' : 'in sync'}`);
        }
    }
    const in_sync_count = Array.from(publish_sync_status.values()).filter(sync => sync).length;
    const out_of_sync_count = publish_sync_status.size - in_sync_count;
    console.log(`Sync check complete: ${in_sync_count} in sync, ${out_of_sync_count} out of sync`);
}
else {
    console.log('\nSkipping publish sync check (--skip-publish-compare flag used)');
    // Set all to null (unknown)
    for (const project_name of project_names) {
        publish_sync_status.set(project_name, true); // Assume in sync when skipped
    }
}
// Generate DOT content using our new function
const dot_content = (0, project_cluster_state_to_dot_1.project_cluster_state_to_dot)(cluster_state, {
    include_legend: show_legend,
    cluster_path: base_dir,
    show_warnings: verbose
});
// Write the output file (DOT or SVG)
const output_path = path.resolve(output_file);
if (output_svg) {
    // Generate SVG directly using GraphViz
    try {
        // Check if dot command is available
        try {
            (0, child_process_1.execSync)('which dot', { stdio: 'pipe' });
        }
        catch {
            console.error('❌ Error: GraphViz (dot command) not found. Please install GraphViz first.');
            console.error('On Ubuntu/Debian: sudo apt-get install graphviz');
            console.error('On CentOS/RHEL: sudo yum install graphviz');
            console.error('On macOS: brew install graphviz');
            process.exit(1);
        }
        // Create a temporary DOT file for processing
        const temp_dot_file = `/tmp/temp-${Date.now()}.dot`;
        fs.writeFileSync(temp_dot_file, dot_content);
        // Generate SVG from DOT
        (0, child_process_1.execSync)(`dot -Tsvg ${temp_dot_file} -o ${output_path}`, { stdio: 'pipe' });
        // Clean up temporary DOT file
        fs.unlinkSync(temp_dot_file);
        console.log(`\nDependency graph generated as SVG: ${output_path}`);
    }
    catch (err) {
        console.error(`❌ Error generating SVG:`, err.message);
        console.error('Falling back to DOT format...');
        fs.writeFileSync(output_path, dot_content);
        console.log(`\nDependency graph generated as DOT: ${output_path}`);
        console.log(`\nTo generate SVG manually, run:`);
        console.log(`  dot -Tsvg ${path.basename(output_file)} -o ${path.basename(output_file, '.svg')}.svg`);
    }
}
else {
    // Write DOT file
    fs.writeFileSync(output_path, dot_content);
    console.log(`\nDependency graph generated: ${output_path}`);
    console.log(`\nTo generate an image, run one of:`);
    console.log(`  dot -Tpng ${path.basename(output_file)} -o dependencies.png`);
    console.log(`  dot -Tsvg ${path.basename(output_file)} -o dependencies.svg`);
    console.log(`  dot -Tpdf ${path.basename(output_file)} -o dependencies.pdf`);
}
// Show summary statistics
const total_deps = project_names.reduce((sum, name) => {
    const project_entry = cluster_state.projects[name];
    if (project_entry && project_entry[0] === 'project') {
        return sum + Object.keys(project_entry[1].dependencies).length;
    }
    return sum;
}, 0);
const sibling_deps = project_names.reduce((sum, name) => {
    const project_entry = cluster_state.projects[name];
    if (project_entry && project_entry[0] === 'project') {
        const project_deps = Object.keys(project_entry[1].dependencies);
        return sum + project_deps.filter(dep => project_names.includes(dep)).length;
    }
    return sum;
}, 0);
const external_deps = new Set();
project_names.forEach(name => {
    const project_entry = cluster_state.projects[name];
    if (project_entry && project_entry[0] === 'project') {
        Object.keys(project_entry[1].dependencies).forEach(dep => {
            if (!project_names.includes(dep)) {
                external_deps.add(dep);
            }
        });
    }
});
console.log(`\nSummary:`);
console.log(`  - ${project_names.length} projects`);
console.log(`  - ${external_deps.size} external dependencies`);
console.log(`  - ${total_deps} total dependency relationships`);
console.log(`  - ${sibling_deps} sibling dependencies`);
console.log(`  - ${total_deps - sibling_deps} external dependencies`);
// Show sync status summary
if (!skip_publish_compare) {
    const in_sync_count = Array.from(publish_sync_status.values()).filter(sync => sync).length;
    const out_of_sync_count = publish_sync_status.size - in_sync_count;
    console.log(`  - ${in_sync_count} packages in sync with published versions`);
    console.log(`  - ${out_of_sync_count} packages out of sync with published versions`);
}
else {
    console.log(`  - Publish sync check skipped`);
}
// Auto-generate and open SVG
if (output_svg && !show_path && !show_command) {
    console.log(`\nOpening dependency graph...`);
    try {
        // Try to open the file
        let open_command;
        const platform = process.platform;
        if (platform === 'darwin') {
            open_command = 'open';
        }
        else if (platform === 'win32') {
            open_command = 'start';
        }
        else {
            // Linux and other Unix-like systems
            open_command = 'xdg-open';
        }
        try {
            // For Linux, use xdg-open with clean environment to avoid snap conflicts
            if (platform === 'linux') {
                try {
                    // Clean environment to avoid snap library conflicts
                    const cleanEnv = Object.assign({}, process.env);
                    delete cleanEnv.LD_LIBRARY_PATH;
                    const proc = (0, child_process_1.spawn)('xdg-open', [output_path], {
                        detached: true,
                        stdio: 'ignore',
                        env: cleanEnv
                    });
                    proc.unref();
                    console.log(`✓ Opened in default viewer`);
                }
                catch (xdgError) {
                    console.log(`❌ Could not open automatically: ${xdgError.message}`);
                    console.log(`📁 SVG file created at: ${output_path}`);
                    console.log(`You can open it manually.`);
                }
            }
            else {
                // For macOS and Windows, use the original approach
                (0, child_process_1.execSync)(`${open_command} "${output_path}"`, { stdio: 'ignore' });
                console.log(`✓ Opened in default viewer`);
            }
        }
        catch (openError) {
            console.error(`❌ Failed to open:`, openError.message);
            console.log(`📁 SVG file created at: ${output_path}`);
            console.log(`You can open it manually with your preferred viewer.`);
        }
    }
    catch (err) {
        console.error(`❌ Error opening SVG:`, err.message);
    }
}
else if (output_svg && (show_path || show_command)) {
    if (show_path) {
        console.log(`\n📁 SVG file created at: ${output_path}`);
        console.log(`You can open it with your preferred viewer.`);
    }
    if (show_command) {
        console.log(`\n📁 SVG file created at: ${output_path}`);
        console.log(`\nTo open it, run one of these commands:`);
        console.log(`  firefox "${output_path}"`);
        console.log(`  google-chrome "${output_path}"`);
        console.log(`  eog "${output_path}"`);
        console.log(`  xdg-open "${output_path}"`);
    }
}
