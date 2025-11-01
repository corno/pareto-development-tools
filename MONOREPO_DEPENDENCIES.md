# Monorepo Dependency Management

## Rationale

This monorepo uses `file:` dependencies during development and version ranges (e.g., `^1.2.3`) when publishing to npm. This approach provides:

- **Fast local development**: Changes to sibling packages are immediately available without publishing
- **Type safety**: TypeScript resolves types directly from source code
- **Safe publishing**: Pre-publish validation ensures local code matches published versions
- **Standard npm compatibility**: Published packages use normal version ranges

## How It Works

### Development Phase

All sibling dependencies use `file:../sibling` protocol:

```json
{
  "dependencies": {
    "sibling-package": "file:../sibling-package"
  }
}
```

Node.js creates symlinks in `node_modules/`, giving instant access to sibling code changes.

### Publishing Phase

Before publishing a package:

1. **Validation**: The `compare published` check ensures local sibling code is identical to the published version it references
2. **Dependency swap**: `switch_package_to_published_dependencies` converts `file:../sibling` → `^1.2.3` (reading version from sibling's `package.json`)
3. **Publish**: Package is published to npm with version range dependencies
4. **Restore**: `switch_package_to_sibling_dependencies` restores `file:` dependencies for continued development

### Safety Guarantees

- **No testing gap**: Pre-publish validation ensures tested code (with `file:` deps) matches published code (with version deps)
- **Race condition proof**: Version ranges reference specific published versions that are proven to work
- **Atomic operations**: Swap scripts include error handling to prevent inconsistent states

## Tools

### `switch_package_to_published_dependencies`

Converts a package's `file:` dependencies to version ranges for publishing.

**What it does:**
- Reads `package.json`
- For each `file:../sibling` dependency:
  - Resolves the sibling's `package.json`
  - Reads the sibling's version field
  - Replaces `file:../sibling` with `^version`
- Writes updated `package.json`
- Creates backup for rollback if needed

**Usage:**
```bash
./switch_package_to_published_dependencies.sh <package-directory>
```

### `switch_package_to_sibling_dependencies`

Restores `file:` dependencies after publishing.

**What it does:**
- Reads `package.json`
- For each known sibling dependency:
  - Replaces version range with `file:../sibling`
- Writes updated `package.json`

**Usage:**
```bash
./switch_package_to_sibling_dependencies.sh <package-directory>
```

## Workflow Example

```bash
# 1. Develop with file: dependencies
cd pub/
npm test

# 2. Validate (enforced by tooling)
pareto compare-published

# 3. Switch to version ranges
./switch_package_to_published_dependencies.sh pub/

# 4. Publish
cd pub/
npm publish

# 5. Restore file: dependencies
cd ..
./switch_package_to_sibling_dependencies.sh pub/
```

## Important Notes

- **Lock files**: `package-lock.json` is gitignored to avoid churn from dependency swaps, but is still published with packages
- **Topological order**: Publish dependencies before dependents (enforced by existing tooling)
- **Cluster structure**: The `structure.json` file defines sibling relationships for dependency detection
