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
exports.main = main;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const get_directory_tree_1 = require("../queries/get_directory_tree");
const compare_directories_1 = require("../transformations/compare_directories");
function print_diff(diff, indent = '') {
    let has_errors = false;
    for (const [name, node_diff] of Object.entries(diff).sort()) {
        if (node_diff[0] === 'error') {
            has_errors = true;
            const error_type = node_diff[1][0];
            switch (error_type) {
                case 'missing':
                    console.log(`${indent}❌ ${name} - MISSING in implementation`);
                    break;
                case 'superfluous':
                    console.log(`${indent}⚠️  ${name} - SUPERFLUOUS (not in interface)`);
                    break;
                case 'not a directory':
                    console.log(`${indent}❌ ${name} - should be a DIRECTORY`);
                    break;
                case 'not a file':
                    console.log(`${indent}❌ ${name} - should be a FILE`);
                    break;
            }
        }
        else {
            const success_node = node_diff[1];
            if (success_node[0] === 'directory') {
                console.log(`${indent}📁 ${name}/`);
                const sub_has_errors = print_diff(success_node[1], indent + '  ');
                if (sub_has_errors) {
                    has_errors = true;
                }
            }
            else {
                console.log(`${indent}✓ ${name}`);
            }
        }
    }
    return has_errors;
}
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        console.log('Usage: check-interface-implementation <project_directory>');
        console.log('');
        console.log('Compares /pub/src/interface/algorithms against /pub/src/implementation/algorithms');
        console.log('to ensure the implementation matches the interface structure.');
        console.log('');
        console.log('Example:');
        console.log('  check-interface-implementation ../my-project');
        process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
    }
    const project_dir = path.resolve(args[0]);
    const interface_dir = path.join(project_dir, 'pub', 'src', 'interface', 'algorithms');
    const implementation_dir = path.join(project_dir, 'pub', 'src', 'implementation', 'algorithms');
    // Check if directories exist
    if (!fs.existsSync(interface_dir)) {
        console.log(`❌ Interface directory not found: ${interface_dir}`);
        process.exit(1);
    }
    if (!fs.existsSync(implementation_dir)) {
        console.log(`❌ Implementation directory not found: ${implementation_dir}`);
        process.exit(1);
    }
    console.log('🔍 Comparing interface vs implementation...');
    console.log(`Interface:      ${interface_dir}`);
    console.log(`Implementation: ${implementation_dir}`);
    console.log('');
    // Get directory trees
    const interface_tree = (0, get_directory_tree_1.get_directory_tree)(interface_dir);
    const implementation_tree = (0, get_directory_tree_1.get_directory_tree)(implementation_dir);
    // Compare
    const diff = (0, compare_directories_1.compare_directories)(interface_tree, implementation_tree);
    // Print results
    const has_errors = print_diff(diff);
    console.log('');
    if (has_errors) {
        console.log('❌ Interface and implementation do NOT match');
        process.exit(1);
    }
    else {
        console.log('✅ Interface and implementation match');
        process.exit(0);
    }
}
if (require.main === module) {
    main();
}
