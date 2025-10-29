# Repository Tools Collection

This directory contains a collection of tools for managing and analyzing multiple Node.js/npm repositories.

## Tools Overview

### Package Analysis Tools

#### `list_problem_packages.js` - Problem Package Analyzer 🆕

Lists packages that either deviate from published versions or have lagging dependencies, sorted topologically.

**Usage:**
```bash
./list_problem_packages.js <directory> [options]
```

**Options:**
- `-v, --verbose`: Show detailed output including specific lagging dependencies
- `--skip-build`: Skip building packages (use existing dist)
- `-d, --include-dev`: Include devDependencies in dependency analysis
- `-p, --publish`: Publishing mode - walk through problem packages and ask to publish each one
- `-h, --help`: Show help message

**Features:**
- **Deviation Detection**: Identifies packages that differ from their published npm versions
- **Lagging Dependency Detection**: Finds packages using outdated versions of sibling packages
- **Topological Sorting**: Orders results so dependencies appear before dependents
- **Recursive Safety Analysis**: Determines which packages are safe to publish without creating new dependency issues
- **Publishing Mode**: Ask to publish each safe package in dependency order
- **Name Validation**: Detects mismatches between package name and directory name
- **Comprehensive Analysis**: Covers build failures, unpublished packages, and version mismatches

**Example:**
```bash
./list_problem_packages.js ../my-repos --verbose
./list_problem_packages.js ../my-repos --publish  # Publishing mode
```

**Sample Output:**
```
🚨 PROBLEM PACKAGES (topologically sorted):
══════════════════════════════════════════════════════════════════════════════════════════
NAME                 PUBLISH              DEPENDENCIES               SAFE TO PUBLISH
──────────────────── ──────────────────── ────────────────────────── ───────────────
base-package         🔄 DIFFERS           ✅ OK                      ✅ YES        
dependent-package    ✅ OK                ⚠️  2 LAGGING               ➖ N/A        
risky-package        🔄 DIFFERS           ✅ OK                      ❌ NO         
  (verbose mode shows detailed dependency info below each package)
```

#### `compare_package.js` - Single Package Comparator

Compares a single local package with its published npm version.

**Usage:**
```bash
./compare_package.js <package-directory> [options]
```

#### `compare_all.js` - Batch Package Comparator

Compares all packages in a directory with their published versions and launches Beyond Compare for consolidated viewing.

**Usage:**
```bash
./compare_all.js <directory> [options]
```

### Dependency Analysis Tools

#### `generate_dependency_graph.js` - Dependency Graph Generator

Analyzes Node.js/npm repositories and generates GraphViz dependency graphs.

**Usage:**
```bash
./generate_dependency_graph.js <directory> [output_file] [options]
```

**Features:**
- Visual distinction between sibling and external dependencies
- Version mismatch highlighting (red edges for outdated sibling dependencies)
- Support for multiple output formats (DOT, SVG, PNG, PDF)
- Auto-open functionality

**Options:**
- `--include-dev, -d`: Include devDependencies
- `--verbose, -v`: Show verbose output
- `--svg, -s`: Output SVG format
- `--open, -o`: Generate and open automatically

### Build and Test Tools

#### `tsc.js` - Minimalistic TypeScript Compiler

Runs TypeScript compiler on a project's `pub` directory.

**Usage:**
```bash
./tsc.js <project-directory>
```

**Features:**
- Minimal wrapper around `tsc --project <project>/pub`
- Shows all TypeScript compiler output
- Fast and direct compilation
- No additional processing or dependencies

#### `build.js` - Single Project Builder

Builds a single Node.js/TypeScript project with full error visibility.

**Usage:**
```bash
./build.js <package-directory>
```

**Features:**
- Builds both `pub` and `test` directories (if they exist)
- Shows all build output and errors (nothing suppressed)
- Installs test dependencies automatically
- Makes bin files executable
- Clear success/failure reporting

#### `build_all.js` - Batch Builder
Builds all Node.js projects in a directory.

#### `test.js` - Single Project Tester
Runs tests for a single project.

#### `test_all.js` - Batch Tester  
Runs tests for all Node.js projects in a directory.

### Maintenance Tools

#### `clean_all.js` - Batch Cleaner
Cleans build artifacts from all projects.

#### `clean.js` - Single Project Cleaner
Cleans build artifacts from a single project.

#### `update_all.js` - Dependency Updater
Updates dependencies across all projects.

### Git Tools

#### `commit_and_push_all.js` - Batch Git Operations
Commits and pushes changes across all repositories.

#### `stage_all.js` - Batch Git Staging
Stages changes across all repositories.

### Publishing Tools

#### `publish.js` - Package Publisher
Publishes packages to npm registry.

### Utility Tools

#### `list_all_files.js` - File Lister
Lists all files across projects.

## Typical Workflow

1. **Analyze Problems**: Use `list_problem_packages.js` to identify issues
2. **Visual Analysis**: Use `generate_dependency_graph.js` to understand relationships
3. **Fix Individual Packages**: Use `compare_package.js` for detailed comparison
4. **Build and Test**: Use `build_all.js` and `test_all.js`
5. **Verify Fixes**: Re-run `list_problem_packages.js` to confirm issues are resolved

## Common Use Cases

### Finding Outdated Dependencies
```bash
# Find all packages with problems, including lagging dependencies
./list_problem_packages.js ../my-repos --verbose --include-dev
```

### Visualizing Dependency Issues
```bash  
# Generate dependency graph highlighting version mismatches in red
./generate_dependency_graph.js ../my-repos --open --verbose
```

### Batch Package Comparison
```bash
# Compare all packages with published versions
./compare_all.js ../my-repos --verbose
```

### Complete Analysis Pipeline
```bash
# 1. Check for problems
./list_problem_packages.js ../my-repos --verbose

# 2. Publishing mode for problem packages (in dependency order)
./list_problem_packages.js ../my-repos --publish

# 3. Generate visual graph to verify fixes
./generate_dependency_graph.js ../my-repos --open

# 4. Compare specific packages if needed
./compare_package.js ../my-repos/problem-package --verbose
```

## Requirements

- Node.js
- GraphViz (for dependency graph generation)
- Beyond Compare (optional, for package comparison)

## Installation

Make scripts executable:
```bash
chmod +x *.js
```

## Library Dependencies

The tools use shared utilities in the `lib/` directory:
- `build_test_utils.js`: Build and test functionality
- `clean_utils.js`: Cleaning utilities  
- `package_compare_utils.js`: Package comparison functionality