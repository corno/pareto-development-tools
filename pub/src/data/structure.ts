import * as _psh from 'pareto-core-shorthands/dist/unconstrained'

import {
    Raw_Or_Normal_Dictionary,
    Raw_Or_Normal_List,
    wrap_dictionary,
    wrap_list,
} from 'pareto-core-shorthands/dist/unconstrained'


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
    "signatures": directory_group({
        "transformers": directory_wildcards(1, false, ["ts"], false),
    }),
    "to_be_generated": directory_wildcards(0, false, ["ts"], true),

})

const $_implementation: d_structure.Directory.SG.group.D = directory_group({
    "generated": directory_generated(true),

    "manual": directory_group({
        "schemas": directory_dictionary(dgroup({
            "transformers": directory_wildcards(0, false, ["ts"], false),
            "serializers.ts": file_manual(),
            "deserializers.ts": file_manual(),
            "refiners": directory_wildcards(0, false, ["ts"], false),
            "productions": directory_wildcards(0, false, ["ts"], false),
        })),
        "primitives": directory_group({
            "text": directory_group({
                "serializers": directory_wildcards(0, false, ["ts"], false),
                "deserializers": directory_wildcards(0, false, ["ts"], false),
            }),
            "integer": directory_group({
                "serializers": directory_wildcards(0, false, ["ts"], false),
                "deserializers": directory_wildcards(0, false, ["ts"], false),
            }),
            "boolean": directory_group({
                "serializers": directory_wildcards(0, false, ["ts"], false),
                "deserializers": directory_wildcards(0, false, ["ts"], false),
            }),
            "approximate_number": directory_group({
                "serializers": directory_wildcards(0, false, ["ts"], false),
                "deserializers": directory_wildcards(0, false, ["ts"], false),
            }),
        }),
        "queries": directory_wildcards(0, false, ["ts"], false),
        "commands": directory_wildcards(0, false, ["ts"], false),
    }),

    "operations": directory_group({
        "pure": directory_group({
            "dictionary": directory_wildcards(0, false, ["ts"], false),
            "list": directory_wildcards(0, false, ["ts"], false),
        }),
        "impure": directory_group({
            "dictionary": directory_wildcards(0, false, ["ts"], false),
            "list": directory_wildcards(0, false, ["ts"], false),
        }),
    }),
    "temp": directory_wildcards(0, true, ["ts"], true),

})

export const $$: d_structure.Directory = ['group', _psh.wrap_dictionary<d_structure.Directory.SG.group.D>({
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
            "bin": directory_wildcards(0, false, ["ts"], false),
            "data": directory_wildcards(0, true, ["ts"], false),

            "globals.ts": file_generated(true),
            "implementation": $_implementation,
            "interface": $_interface,
            "index.ts": file_generated(true),
            "modules": directory_dictionary(dgroup({
                "interface": $_interface,
                "implementation": $_implementation,
            })),
            "shorthands": directory_wildcards(0, false, ["ts"], false),
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