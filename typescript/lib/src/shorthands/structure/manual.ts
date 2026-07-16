import * as p_ from 'pareto-core-shorthands/unconstrained_manual'


import type * as s_structure from "../../submodules/file_structure_analysis/schemas/structure.js"

export namespace g {

    export const file_manual = (): s_structure.Directory.group.D => ['file', ['manual', null]]
    export const file_generated = (commitToGit: boolean): s_structure.Directory.group.D => ['file', ['generated', {
        'commit to git': commitToGit,
    }]]

    export const directory_ignore = (): s_structure.Directory.group.D => ['directory', ['ignore', null]]
    export const directory_freeform = (): s_structure.Directory.group.D => ['directory', ['freeform', null]]
    export const directory_group = (
        nodes: p_.Raw_Dictionary<s_structure.Directory.group.D>
    ): s_structure.Directory.group.D => ['directory', ['group', p_.dictionary(nodes)]]

    export const directory_dictionary = ($: s_structure.Directory): s_structure.Directory.group.D => ['directory', ['dictionary', $]]

    export const directory_wildcards = (
        required_dirs: number,
        additional_dirs_allowed: boolean,
        extensions: p_.Raw_List<string>,
        warn: boolean
    ): s_structure.Directory.group.D => ['directory', ['wildcards', {
        'required directories': required_dirs,
        'additional directories allowed': additional_dirs_allowed,
        'extensions': p_.list<string>(extensions),
        'warn': warn,
    }]]

    export const directory_generated = (
        commitToGit: boolean
    ): s_structure.Directory.group.D => ['directory', ['generated', {
        'commit to git': commitToGit,
    }]]

}


export const dgroup = (
    nodes: p_.Raw_Dictionary<s_structure.Directory.group.D>
): s_structure.Directory => ['group', p_.dictionary(nodes)]
