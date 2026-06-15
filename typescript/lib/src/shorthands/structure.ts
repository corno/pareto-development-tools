import * as pt from 'pareto-core-shorthands/dist/unconstrained'


import * as d_structure from "../interface/generated/liana/schemas/structure/data"

export namespace g {

    export const file_manual = (): d_structure.Directory.group.D => ['file', ['manual', null]]
    export const file_generated = (commitToGit: boolean): d_structure.Directory.group.D => ['file', ['generated', {
        'commit to git': commitToGit,
    }]]

    export const directory_ignore = (): d_structure.Directory.group.D => ['directory', ['ignore', null]]
    export const directory_freeform = (): d_structure.Directory.group.D => ['directory', ['freeform', null]]
    export const directory_group = (nodes: pt.Raw_Or_Normal_Dictionary<d_structure.Directory.group.D>): d_structure.Directory.group.D => ['directory', ['group', pt.dictionary(nodes)]]

    export const directory_dictionary = ($: d_structure.Directory): d_structure.Directory.group.D => ['directory', ['dictionary', $]]

    export const directory_wildcards = (required_dirs: number, additional_dirs_allowed: boolean, extensions: pt.Raw_Or_Normal_List<string>, warn: boolean): d_structure.Directory.group.D => ['directory', ['wildcards', {
        'required directories': required_dirs,
        'additional directories allowed': additional_dirs_allowed,
        'extensions': pt.list<string>(extensions),
        'warn': warn,
    }]]

    export const directory_generated = (commitToGit: boolean): d_structure.Directory.group.D => ['directory', ['generated', {
        'commit to git': commitToGit,
    }]]

}


export const dgroup = (nodes: pt.Raw_Or_Normal_Dictionary<d_structure.Directory.group.D>): d_structure.Directory => ['group', pt.dictionary(nodes)]
