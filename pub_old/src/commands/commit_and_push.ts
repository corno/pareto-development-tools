import * as fs from "fs"
import * as path from "path"
import * as readline from "readline"
import { spawn } from "child_process"
import { determine_pre_commit_state } from "../queries/analyse_package_pre_commit"
import { pre_commit_state_to_analysis_result } from "../transformations/state_to_analysis_result"

function askUserConfirmation(question: string): Promise<boolean> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    return new Promise((resolve) => {
        rl.question(`${question} (y/n): `, (answer) => {
            rl.close()
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
    })
}

function promptUser(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close()
            resolve(answer.trim())
        })
    })
}

function runGitCommand(cwd: string, ...args: string[]): Promise<{ success: boolean; output: string; error: string }> {
    return new Promise((resolve) => {
        const gitProcess = spawn('git', args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })
        
        let stdout = ''
        let stderr = ''
        
        gitProcess.stdout.on('data', (data) => {
            stdout += data.toString()
        })
        
        gitProcess.stderr.on('data', (data) => {
            stderr += data.toString()
        })
        
        gitProcess.on('close', (code) => {
            resolve({
                success: code === 0,
                output: stdout.trim(),
                error: stderr.trim()
            })
        })
    })
}

async function hasUncommittedChanges(packagePath: string): Promise<boolean> {
    const statusResult = await runGitCommand(packagePath, 'status', '--porcelain')
    return statusResult.success && statusResult.output.trim() !== ''
}

export const $$ = async (args: string[]): Promise<void> => {
    const packagePath = args[0]
    const commitMessage = args[1]
    const dryRun = args.includes('--dry-run')
    const noPush = args.includes('--no-push')
    
    if (!packagePath) {
        console.error('Usage: commit_and_push <package-path> [commit-message] [--dry-run] [--no-push]')
        process.exit(1)
    }

    const absolutePackagePath = path.resolve(packagePath)
    
    if (!fs.existsSync(absolutePackagePath)) {
        console.error(`❌ Package path does not exist: ${absolutePackagePath}`)
        process.exit(1)
    }

    console.log(`📦 Package: ${path.basename(absolutePackagePath)}`)
    console.log(`📍 Path: ${absolutePackagePath}`)
    
    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No actual commits or pushes will be made')
    }

    // Step 1: Analyze pre-commit state
    console.log('\n� Step 1: Analyzing pre-commit state...')
    
    try {
        // Parse the package path to get required parameters
        const packageDir = path.basename(absolutePackagePath)
        const parentDir = path.dirname(absolutePackagePath)
        
        // In pareto ecosystem, package.json is in the pub/ subdirectory
        const packageJsonPath = path.join(absolutePackagePath, 'pub', 'package.json')
        
        if (!fs.existsSync(packageJsonPath)) {
            console.error('❌ No package.json found in the pub/ subdirectory')
            console.error(`   Expected at: ${packageJsonPath}`)
            
            // Check if it's directly in the package directory (non-standard)
            const directPackageJsonPath = path.join(absolutePackagePath, 'package.json')
            if (fs.existsSync(directPackageJsonPath)) {
                console.error(`   Found package.json in package root: ${directPackageJsonPath}`)
                console.error('   Hint: This package may not follow the standard pareto structure')
            }
            
            process.exit(1)
        }
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        const packageName = packageJson.name
        
        if (!packageName) {
            console.error('❌ No name field found in package.json')
            process.exit(1)
        }
        
        const pre_commit_state = determine_pre_commit_state({
            'path to package': parentDir,
            'directory name': packageDir,
            'package name': packageName
        })
        
        // Transform to analysis result
        const analysis_result = pre_commit_state_to_analysis_result(pre_commit_state)
        
        // Check for issues - look at the test results
        const hasTestFailures = pre_commit_state.test[0] === 'failure'
        
        if (hasTestFailures) {
            console.error('❌ Pre-commit analysis found test issues:')
            const [failureType, failureDetails] = pre_commit_state.test[1]
            if (failureType === 'build') {
                console.error('   Build failed')
            } else {
                console.error('   Tests failed:', failureDetails['failed tests'])
            }
            console.error('\n💡 Please fix these issues before committing.')
            process.exit(1)
        }
        
        // Check structural issues
        const structural = pre_commit_state.structural
        if (structural.structure[0] === 'invalid') {
            console.error('❌ Pre-commit analysis found structural issues:')
            structural.structure[1].errors.forEach(error => {
                console.error(`   - ${error}`)
            })
            console.error('\n💡 Please fix these issues before committing.')
            process.exit(1)
        }
        
        console.log('✅ Pre-commit analysis passed - no issues found')
        
    } catch (error) {
        console.error('❌ Failed to analyze pre-commit state:', error)
        process.exit(1)
    }

    // Check if there are uncommitted changes
    console.log('\n📋 Checking for uncommitted changes...')
    const hasChanges = await hasUncommittedChanges(absolutePackagePath)
    
    if (!hasChanges) {
        console.log('ℹ️  No uncommitted changes found. Nothing to commit.')
        return
    }
    
    console.log('✅ Found uncommitted changes')

    // Get commit message if not provided
    let finalCommitMessage = commitMessage
    if (!finalCommitMessage) {
        finalCommitMessage = await promptUser('Enter commit message: ')
        if (!finalCommitMessage.trim()) {
            console.error('❌ Commit message cannot be empty')
            process.exit(1)
        }
    }

    // Prepend [validated] since this command validates before committing
    finalCommitMessage = `[validated] ${finalCommitMessage}`

    console.log(`📝 Commit message: "${finalCommitMessage}"`)

    // Confirm before proceeding
    if (!dryRun) {
        const shouldProceed = await askUserConfirmation('Proceed with commit and push?')
        if (!shouldProceed) {
            console.log('❌ Operation cancelled by user')
            return
        }
    }

    // Step 2: Commit changes
    console.log('\n📋 Step 2: Committing changes...')
    
    if (dryRun) {
        console.log('🔍 DRY RUN: Would add all changes and commit with message:', finalCommitMessage)
    } else {
        // Add all changes
        const addResult = await runGitCommand(absolutePackagePath, 'add', '.')
        if (!addResult.success) {
            console.error('❌ Failed to add changes:', addResult.error)
            process.exit(1)
        }
        
        // Commit with message
        const commitResult = await runGitCommand(absolutePackagePath, 'commit', '-m', finalCommitMessage)
        if (!commitResult.success) {
            console.error('❌ Failed to commit:', commitResult.error)
            process.exit(1)
        }
        
        console.log('✅ Changes committed successfully')
    }

    // Step 3: Push to remote (unless --no-push)
    if (!noPush) {
        console.log('\n📋 Step 3: Pushing to remote...')
        
        if (dryRun) {
            console.log('🔍 DRY RUN: Would push to remote')
        } else {
            const pushResult = await runGitCommand(absolutePackagePath, 'push')
            if (!pushResult.success) {
                console.error('❌ Failed to push:', pushResult.error)
                console.log('💡 Commit was successful, but push failed. You may need to pull first or check remote configuration.')
                process.exit(1)
            }
            
            console.log('✅ Successfully pushed to remote')
        }
    } else {
        console.log('\n📌 Skipping push (--no-push flag specified)')
    }

    console.log('\n🎉 Commit and push completed successfully!')
}
