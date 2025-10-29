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
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Get target directory from command line argument
function main() {
    const target_dir = process.argv[2];
    if (!target_dir) {
        console.error('Error: Please provide a target directory path');
        console.error('Usage: pareto all update <directory>');
        process.exit(1);
    }
    const base_dir = path.resolve(target_dir);
    if (!fs.existsSync(base_dir)) {
        console.error(`Error: Directory ${target_dir} does not exist`);
        process.exit(1);
    }
    const get_relative_path = (absolute_path) => {
        const rel = path.relative(process.cwd(), absolute_path);
        return rel.startsWith('..') || rel.startsWith('.') ? rel : './' + rel;
    };
    fs.readdirSync(base_dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .forEach(dirent => {
        const dir_path = path.join(base_dir, dirent.name);
        const package_json = path.join(dir_path, 'pub', 'package.json');
        if (fs.existsSync(package_json)) {
            console.log(`Updating ${get_relative_path(dir_path)}...`);
            try {
                (0, child_process_1.execSync)('update2latest . dependencies', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
                // execSync('update2latest . devDependencies', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
                (0, child_process_1.execSync)('npm update', { cwd: path.join(dir_path, 'pub'), stdio: 'inherit' });
            }
            catch (err) {
                console.error(`Failed to update ${get_relative_path(dir_path)}:`, err.message);
            }
        }
    });
}
main();
