import * as path from "path"
import * as fs from "fs"
import * as buildAndTestLib from "../old_lib/build_and_test"

const build_and_test = buildAndTestLib.$$

export const $$ = async (args: string[]): Promise<void> => {
    const packagePath = args[0]
    const skipTests = args.includes('--skip-tests')

    if (!packagePath) {
        console.error('Usage: build-and-test <package-path> [--verbose|-v] [--skip-tests]')
        console.error('')
        console.error('Options:')
        console.error('  --skip-tests     Skip running tests after build')
        process.exit(1)
    }

    const absolutePackagePath = path.resolve(packagePath)
    
    if (!fs.existsSync(absolutePackagePath)) {
        console.error(`❌ Package path does not exist: ${absolutePackagePath}`)
        process.exit(1)
    }

    console.log(`🔨 Building and testing: ${path.basename(absolutePackagePath)}`)
    console.log(`📍 Path: ${absolutePackagePath}`)

    // Pass the relative path to keep tsc output relative
    const result = build_and_test(packagePath, {
        verbose: true,
        skip_tests: skipTests
    })

    if (result[0] === 'success') {
        console.log('✅ Build and test completed successfully!')
    } else {
        const [reasonType, reasonDetails] = result[1].reason
        console.error('❌ Build and test failed:')
        
        if (reasonType === 'build failing') {
            console.error('Build errors:')
            console.error(reasonDetails.details)
        } else if (reasonType === 'tests failing') {
            console.error('Test failures:')
            console.error(reasonDetails.details)
        }
        
        process.exit(1)
    }
}