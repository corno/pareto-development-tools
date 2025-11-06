#!/usr/bin/env node

import { switchToPublishedDependencies } from "../commands/switch_to_published_dependencies"

const args = process.argv.slice(2)

if (args.length !== 2) {
    console.error("Usage: switch_to_published_dependencies <cluster-path> <package-name>")
    console.error("Example: switch_to_published_dependencies /home/user/workspace/my-cluster pub")
    process.exit(1)
}

const [clusterPath, packageName] = args

try {
    switchToPublishedDependencies(clusterPath, packageName)
} catch (error) {
    console.error("Error:", error instanceof Error ? error.message : String(error))
    process.exit(1)
}
