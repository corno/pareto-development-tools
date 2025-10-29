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
// Get package directory from command line argument (default to current directory)
function main() {
    const package_dir = process.argv[2] || '.';
    const package_path = path.resolve(package_dir);
    const package_json_path = path.join(package_path, 'pub', 'package.json');
    if (!fs.existsSync(package_json_path)) {
        console.error(`Error: package.json not found in ${package_path}/pub`);
        console.error('Usage: pareto update [package-directory]');
        process.exit(1);
    }
    const package_name = path.basename(package_path);
    console.log(`Updating dependencies for ${package_name}...`);
    try {
        const pub_dir = path.join(package_path, 'pub');
        // Update to latest versions
        console.log('\nUpdating to latest compatible versions...');
        (0, child_process_1.execSync)('update2latest . dependencies', { cwd: pub_dir, stdio: 'inherit' });
        // Run npm update
        console.log('\nRunning npm update...');
        (0, child_process_1.execSync)('npm update', { cwd: pub_dir, stdio: 'inherit' });
        console.log(`\n✓ Successfully updated dependencies for ${package_name}`);
    }
    catch (err) {
        console.error(`\n❌ Failed to update ${package_name}:`, err.message);
        process.exit(1);
    }
}
main();
