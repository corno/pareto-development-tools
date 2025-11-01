#!/usr/bin/env node

import { switchToSiblingDependencies } from "../commands/switch_to_sibling_dependencies"

const args = process.argv.slice(2)

if (args.length !== 2) {
    console.error("Usage: switch_to_sibling_dependencies <cluster-path> <package-name>")
    console.error("Example: switch_to_sibling_dependencies /home/user/workspace/my-cluster pub")
    process.exit(1)
}

const [clusterPath, packageName] = args

try {
    switchToSiblingDependencies(clusterPath, packageName)
} catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error))
    process.exit(1)
}
