import * as p_ from 'pareto-core/interface/schema'


import type * as s_git_commit from "./git_commit.js"
import type * as s_path from "./fs_unrestricted_path.js"
import type * as s_publish from "./publish.js"

export type Parameters = {
    'type':
    | ['all packages', All_Packages]
    | ['package', Package]
    | ['project', Project]



    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', {
        'path to package': s_path.Context_Path
    }]
    | ['publish', s_publish.Parameters]
}

export type All_Packages = {
    'path to project': s_path.Context_Path
    'instruction': All_Pacakges_Instruction
}

export type Package = {
    'path': s_path.Context_Path
    'instruction':
    /**
     * asserts that the git working tree is clean for 1 specified package
     */
    | ['assert no open changes', null]


    | ['build and test', null]
    | ['commit changes', s_git_commit.Instruction]
    | ['update package dependencies', null]

}

export type Project = {
    'path': s_path.Context_Path
    'instruction':

    | ['dependency graph', null]


    | ['analyze file structure', null]


    | ['list file structure problems', null]
}

export type All_Pacakges_Instruction =

    /**
     * verifies that the git working tree is clean, raises an error if not
     */
    | ['assert no open changes', null]

    /**
     * builds all packages and runs their tests
     */
    | ['build and test', {
        'concise': boolean
    }]

    | ['build', null]

    /**
     * stages all changes, makes a commit with the given message, and pushes the commit
     */
    | ['commit changes', s_git_commit.Instruction]

    /**
     * sets up 2 directories in /temp of the package dir; one of the local package and one of the published package
     * these directories can be diffed to determine what changes have not been published yet
     */
    | ['set up comparison', null]

    /**
     * for both the lib and test packages;
     * first runs  git clean
     * then        update2latest
     * then        npm install
     */
    | ['update package dependencies', null]
