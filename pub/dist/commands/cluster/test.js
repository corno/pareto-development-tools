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
const build_test_utils_1 = require("../../lib/build_test_utils");
const build_and_test_1 = require("../../lib/build_and_test");
// Get target directory from command line argument (skip --silent flag)
function main() {
    const args = process.argv.slice(2);
    const target_dir = args.find(arg => !arg.startsWith('--'));
    if (!target_dir) {
        console.error('Error: Please provide a target directory path');
        console.error('Usage: pareto all test <directory> [--silent]');
        process.exit(1);
    }
    const base_dir = path.resolve(target_dir);
    if (!fs.existsSync(base_dir)) {
        console.error(`Error: Directory ${target_dir} does not exist`);
        process.exit(1);
    }
    const silent = process.argv.includes('--silent');
    const get_relative_path = (absolute_path) => {
        const rel = path.relative(process.cwd(), absolute_path);
        return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
    };
    fs.readdirSync(base_dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .forEach(dirent => {
        const dir_path = path.join(base_dir, dirent.name);
        if ((0, build_test_utils_1.is_node_project)(dir_path)) {
            console.log(`Building and testing ${get_relative_path(dir_path)}...`);
            try {
                const result = (0, build_and_test_1.$$)(dir_path, {
                    verbose: !silent,
                    throw_on_error: false
                });
                if (result[0] === 'success') {
                    console.log(`✓ ${get_relative_path(dir_path)} build and tests passed`);
                }
                else {
                    const [_, details] = result;
                    const [reason_type, reason_details] = details.reason;
                    if (reason_type === 'build failing') {
                        console.error(`❌ ${get_relative_path(dir_path)} build failed`);
                    }
                    else if (reason_type === 'tests failing') {
                        console.error(`❌ ${get_relative_path(dir_path)} tests failed`);
                    }
                }
            }
            catch (err) {
                console.error(`❌ Build/test failed in ${get_relative_path(dir_path)}:`, err.message);
            }
        }
    });
}
main();
