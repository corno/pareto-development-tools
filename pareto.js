#!/usr/bin/env node
/**
 * Pareto - Main CLI entry point wrapper
 * 
 * This is a thin wrapper that calls the actual implementation in pub/dist/pareto.js
 */

const path = require('path');

// Forward to the actual implementation
require(path.join(__dirname, 'pub', 'dist', 'pareto.js'));
