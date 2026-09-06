import * as p_ from 'pareto-core/schema'


import type * as s_git_commit from "../git_commit/schema.js"
import type * as s_path from "pareto-filesystem-unrestricted-api/modules/unrestricted/schemas/path/schema"
import type * as s_publish from "../publish/schema.js"

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
}

export type All_Packages = {
    'path to project': s_path.Context_Path
    'instruction': All_Pacakges_Instruction
}

export namespace Package {
    export type instruction =
        /**
         * asserts that the git working tree is clean for 1 specified package
         */
        | ['assert no open changes', null]


        | ['build and validate', null]
        | ['commit changes', s_git_commit.Instruction]


        | ['list file structure problems', null]
        | ['publish', s_publish.Parameters2]
        | ['update package dependencies', null]
}

export type Package = {
    'path': s_path.Context_Path
    'instruction': Package.instruction

}

export namespace Project {
    export type instruction =

        | ['analyze file structure', null]

        | ['dependency graph', null]
}

export type Project = {
    'path': s_path.Context_Path
    'instruction': Project.instruction
}

export type All_Pacakges_Instruction =


    /**
     * verifies that the git working tree is clean, raises an error if not
     */
    | ['assert no open changes', null]

    /**
     * builds all packages and runs their tests
     */
    | ['build and validate', {
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
