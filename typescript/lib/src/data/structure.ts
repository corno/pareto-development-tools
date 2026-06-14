import * as pt from 'pareto-core-shorthands/dist/unconstrained'


import * as d_structure from "../interface/generated/liana/schemas/structure/data"

const file_manual = (): d_structure.Directory.group.D => ['file', ['manual', null]]
const file_generated = (commitToGit: boolean): d_structure.Directory.group.D => ['file', ['generated', {
    'commit to git': commitToGit,
}]]

const directory_ignore = (): d_structure.Directory.group.D => ['directory', ['ignore', null]]
const directory_freeform = (): d_structure.Directory.group.D => ['directory', ['freeform', null]]
const directory_group = (nodes: pt.Raw_Or_Normal_Dictionary<d_structure.Directory.group.D>): d_structure.Directory.group.D => ['directory', ['group', pt.dictionary.literal(nodes)]]
const dgroup = (nodes: pt.Raw_Or_Normal_Dictionary<d_structure.Directory.group.D>): d_structure.Directory => ['group', pt.dictionary.literal(nodes)]
const directory_dictionary = ($: d_structure.Directory): d_structure.Directory.group.D => ['directory', ['dictionary', $]]
const directory_generated = (commitToGit: boolean): d_structure.Directory.group.D => ['directory', ['generated', {
    'commit to git': commitToGit,
}]]
const directory_wildcards = (required_dirs: number, additional_dirs_allowed: boolean, extensions: pt.Raw_Or_Normal_List<string>, warn: boolean): d_structure.Directory.group.D => ['directory', ['wildcards', {
    'required directories': required_dirs,
    'additional directories allowed': additional_dirs_allowed,
    'extensions': pt.list.literal<string>(extensions),
    'warn': warn,
}]]

const $_interface: d_structure.Directory.group.D = directory_group({
    "generated": directory_generated(true),
    "resources.ts": file_manual(),
    "signatures.ts": file_manual(),
    "signatures": directory_group({
        "transformers": directory_wildcards(1, false, ["ts"], false),
    }),
    "to_be_generated": directory_wildcards(0, false, ["ts"], true),

})

const $_implementation: d_structure.Directory.group.D = directory_group({
    "generated": directory_generated(true),

    "manual": directory_group({
        "transformers": directory_wildcards(1, false, ["ts"], false),
        "refiners": directory_wildcards(1, false, ["ts"], false),
        "text_to_text": directory_wildcards(0, false, ["ts"], false),
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

export const $$: d_structure.Directory = ['group', pt.dictionary.literal<d_structure.Directory.group.D>({
    ".git": directory_ignore(),
    ".gitignore": file_manual(),
    "data": directory_freeform(),
    "documentation": directory_freeform(),
    "LICENSE": file_manual(),
    "out": directory_generated(false),
    "liana": directory_group({
        ".liana": directory_ignore(),
        "module.liana.lna": file_manual(),
    }),
    "typescript": directory_group({
        "app": directory_group({
            "dist": directory_generated(false),
            "node_modules": directory_ignore(),
            "package-lock.json": file_generated(true),
            "package.json": file_manual(),
            "src": directory_group({
                "bin": directory_wildcards(0, false, ["ts"], false),
                "bin.ts": file_manual(),
                "globals.ts": file_generated(true),
                "index.ts": file_generated(true),
            }),
            "tsconfig.json": file_generated(true)
        }),
        "lib": directory_group({
            "dist": directory_generated(false),
            "node_modules": directory_ignore(),
            "package-lock.json": file_generated(true),
            "package.json": file_manual(),
            "src": directory_group({
                "data": directory_wildcards(0, true, ["ts"], false),

                "globals.ts": file_generated(true),
                "implementation": $_implementation,
                "interface": $_interface,
                "index.ts": file_generated(true),
                "modules": directory_dictionary(dgroup({
                    "interface": $_interface,
                    "implementation": $_implementation,
                    "shorthands": directory_wildcards(0, false, ["ts"], false),
                })),
                "shorthands": directory_wildcards(0, false, ["ts"], false),
            }),
            "tsconfig.json": file_generated(true)
        }),
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
    }),
    "README.md": file_manual(),
    "temp": directory_ignore(),
    "testdata": directory_freeform(),
})]