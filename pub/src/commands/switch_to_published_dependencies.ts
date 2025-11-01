import * as fs from "fs"
import * as path from "path"

/**
 * Switches file: dependencies to published version ranges
 * @param clusterPath - Path to the cluster directory (e.g., /path/to/workspace)
 * @param packageName - Name of the package subdirectory (e.g., "pub" or "test")
 */
export function switchToPublishedDependencies(
    clusterPath: string,
    packageName: string
): void {
    const packageDir = path.join(clusterPath, packageName)
    const packageJsonPath = path.join(packageDir, "package.json")

    if (!fs.existsSync(packageJsonPath)) {
        throw new Error(`package.json not found at: ${packageJsonPath}`)
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"))

    if (!packageJson.dependencies) {
        console.log("No dependencies found, nothing to do")
        return
    }

    let changesMade = false

    for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
        if (typeof depVersion !== "string") {
            continue
        }

        // Check if it's a file: dependency
        const fileMatch = depVersion.match(/^file:\.\.\/(.+)$/)
        if (!fileMatch) {
            continue
        }

        const siblingName = fileMatch[1]
        const siblingDir = path.join(clusterPath, siblingName)
        const siblingPackageJsonPath = path.join(siblingDir, "package.json")

        if (!fs.existsSync(siblingPackageJsonPath)) {
            console.warn(`Warning: Sibling package.json not found at ${siblingPackageJsonPath}, skipping ${depName}`)
            continue
        }

        const siblingPackageJson = JSON.parse(fs.readFileSync(siblingPackageJsonPath, "utf-8"))
        
        if (!siblingPackageJson.version) {
            console.warn(`Warning: No version found in ${siblingPackageJsonPath}, skipping ${depName}`)
            continue
        }

        const version = siblingPackageJson.version
        packageJson.dependencies[depName] = `^${version}`
        console.log(`${depName}: file:../${siblingName} → ^${version}`)
        changesMade = true
    }

    if (changesMade) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
        console.log(`Updated ${packageJsonPath}`)
    } else {
        console.log("No file: dependencies found")
    }
}
