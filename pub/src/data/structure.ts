import * as _edata from 'exupery-core-data'
import { d } from 'exupery-core-data'

import {
    Raw_Or_Normal_Dictionary,
    Raw_Or_Normal_List,
    wrap_dictionary,
    wrap_list,
} from 'exupery-core-data/dist/shorthands/unconstrained'


import * as d_structure from "../interface/generated/pareto/schemas/structure/data_types/source"

const file_manual = (): d_structure.Directory.SG.group.D => ['file', ['manual', null]]
const file_generated = (commitToGit: boolean): d_structure.Directory.SG.group.D => ['file', ['generated', {
    'commit to git': commitToGit,
}]]

const directory_ignore = (): d_structure.Directory.SG.group.D => ['directory', ['ignore', null]]
const directory_freeform = (): d_structure.Directory.SG.group.D => ['directory', ['freeform', null]]
const directory_group = (nodes: Raw_Or_Normal_Dictionary<d_structure.Directory.SG.group.D>): d_structure.Directory.SG.group.D => ['directory', ['group', wrap_dictionary(nodes)]]
const dgroup = (nodes: Raw_Or_Normal_Dictionary<d_structure.Directory.SG.group.D>): d_structure.Directory => ['group', wrap_dictionary(nodes)]
const directory_dictionary = ($: d_structure.Directory): d_structure.Directory.SG.group.D => ['directory', ['dictionary', $]]
const directory_generated = (commitToGit: boolean): d_structure.Directory.SG.group.D => ['directory', ['generated', {
    'commit to git': commitToGit,
}]]
const directory_wildcards = (required_dirs: number, additional_dirs_allowed: boolean, extensions: Raw_Or_Normal_List<string>, warn: boolean): d_structure.Directory.SG.group.D => ['directory', ['wildcards', {
    'required directories': required_dirs,
    'additional directories allowed': additional_dirs_allowed,
    'extensions': wrap_list<string>(extensions),
    'warn': warn,
}]]

const $_interface: d_structure.Directory.SG.group.D = directory_group({
    "generated": directory_generated(true),
    "resources.ts": file_manual(),
    "signatures.ts": file_manual(),
    "to_be_generated": directory_wildcards(0, false, ["ts"], false),

})

const $_implementation: d_structure.Directory.SG.group.D = directory_group({
    "generated": directory_generated(true),

    //these are now doubly defined as both exist. I don't know yet which one is preferred

    "operations": directory_group({
        "pure": directory_wildcards(1, false, ["ts"], false),
        "impure": directory_wildcards(1, false, ["ts"], false),
    }),
    "transformers": directory_group({
        "schemas": directory_wildcards(1, false, ["ts"], false),
        "primitives": directory_wildcards(1, false, ["ts"], false),
    }),
    "productions": directory_group({
        "schemas": directory_wildcards(1, false, ["ts"], false),
        "primitives": directory_wildcards(1, false, ["ts"], false),
    }),
    "refiners": directory_group({
        "schemas": directory_wildcards(1, false, ["ts"], false),
        "primitives": directory_wildcards(1, false, ["ts"], false),
    }),
    "serializers": directory_group({
        "schemas": directory_wildcards(0, false, ["ts"], false),
        "primitives": directory_wildcards(1, false, ["ts"], false),
    }),
    "deserializers": directory_group({
        "schemas": directory_wildcards(0, false, ["ts"], false),
        "primitives": directory_wildcards(1, false, ["ts"], false),
    }),
    "queries": directory_wildcards(0, false, ["ts"], false),
    "commands": directory_wildcards(0, false, ["ts"], false),
            "temp": directory_wildcards(0, false, ["ts"], false),

})

export const $$: d_structure.Directory = ['group', d<d_structure.Directory.SG.group.D>({
    ".git": directory_ignore(),
    ".gitignore": file_manual(),
    "data": directory_freeform(),
    "documentation": directory_freeform(),
    "LICENSE": file_manual(),
    "out": directory_generated(false),
    "pub": directory_group({
        "dist": directory_generated(false),
        "node_modules": directory_ignore(),
        "package-lock.json": file_generated(true),
        "package.json": file_manual(),
        "src": directory_group({
            "interface": $_interface,
            "implementation": $_implementation,

            "bin": directory_wildcards(0, false, ["ts"], false),
            "globals.ts": file_generated(true),
            "index.ts": file_generated(true),
            "shorthands": directory_wildcards(0, false, ["ts"], false),
            "modules": directory_dictionary(dgroup({
                "interface": $_interface,
                "implementation": $_implementation,
            }))
        }),
        "tsconfig.json": file_generated(true)
    }),
    "README.md": file_manual(),
    "temp": directory_ignore(),
    "test": directory_group({
        "dist": directory_generated(false),
        "node_modules": directory_ignore(),
        "package-lock.json": file_generated(true),
        "package.json": file_manual(),
        "src": directory_group({
            "bin": directory_group({
                "test.ts": file_generated(true)
            }),
            "globals.ts": file_generated(true)
        }),
        "tsconfig.json": file_generated(true)
    }),
    "testdata": directory_freeform(),
})]