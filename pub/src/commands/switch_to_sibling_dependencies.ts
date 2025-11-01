import * as fs from "fs"
import * as path from "path"

/**
 * Switches version range dependencies back to file: dependencies for sibling packages
 * @param clusterPath - Path to the cluster directory (e.g., /path/to/workspace)
 * @param packageName - Name of the package subdirectory (e.g., "pub" or "test")
 */
export function switchToSiblingDependencies(
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

    // Get list of sibling directories
    const siblingDirs = fs.readdirSync(clusterPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== packageName)
        .map(dirent => dirent.name)

    let changesMade = false

    for (const [depName, depVersion] of Object.entries(packageJson.dependencies)) {
        if (typeof depVersion !== "string") {
            continue
        }

        // Skip if already a file: dependency
        if (depVersion.startsWith("file:")) {
            continue
        }

        // Check if any sibling directory has this dependency
        for (const siblingName of siblingDirs) {
            const siblingPackageJsonPath = path.join(clusterPath, siblingName, "package.json")
            
            if (!fs.existsSync(siblingPackageJsonPath)) {
                continue
            }

            const siblingPackageJson = JSON.parse(fs.readFileSync(siblingPackageJsonPath, "utf-8"))
            
            if (siblingPackageJson.name === depName) {
                packageJson.dependencies[depName] = `file:../${siblingName}`
                console.log(`${depName}: ${depVersion} → file:../${siblingName}`)
                changesMade = true
                break
            }
        }
    }

    if (changesMade) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n")
        console.log(`Updated ${packageJsonPath}`)
    } else {
        console.log("No sibling dependencies found to convert")
    }
}
