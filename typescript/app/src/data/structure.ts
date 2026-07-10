import * as sh from "lib/shorthands/structure/manual"

const $_declarations = sh.g.directory_group({
    "commands.ts": sh.g.file_manual(),
    "queries.ts": sh.g.file_manual(),
    "refiners": sh.g.directory_wildcards(1, false, ["ts"], false),
    "transformers": sh.g.directory_wildcards(1, false, ["ts"], false),
})

const $_interface = sh.g.directory_group({
    "commands.ts": sh.g.file_manual(),
    "queries.ts": sh.g.file_manual(),
    "data": sh.g.directory_wildcards(0, false, ["ts"], true),
    "generated": sh.g.directory_generated(true),
})

const $_implementation = sh.g.directory_group({
    "commands": sh.g.directory_wildcards(0, false, ["ts"], false),
    "generated": sh.g.directory_generated(true),
    "queries": sh.g.directory_wildcards(0, false, ["ts"], false),
    "refiners": sh.g.directory_wildcards(1, false, ["ts"], false),
    "to_be_generated": sh.g.directory_wildcards(0, true, ["ts"], true),
    "transformers": sh.g.directory_wildcards(1, false, ["ts"], false),
})

const $_shorthands = sh.g.directory_dictionary(
    sh.dgroup({
        "deprecated.ts": sh.g.file_manual(),
        "manual.ts": sh.g.file_manual(),
        "target.ts": sh.g.file_manual(),
    })
)

export const $$ = sh.dgroup({
    ".git": sh.g.directory_ignore(),
    ".gitignore": sh.g.file_generated(true),
    "data": sh.g.directory_freeform(),
    "documentation": sh.g.directory_freeform(),
    "LICENSE": sh.g.file_generated(true),
    "out": sh.g.directory_generated(false),
    "liana": sh.g.directory_group({
        ".liana": sh.g.directory_ignore(),
        "module.liana.lna": sh.g.file_manual(),
    }),
    "completions": sh.g.directory_wildcards(0, false, ["bash"], false),
    "typescript": sh.g.directory_group({
        "app": sh.g.directory_group({
            "dist": sh.g.directory_generated(false),
            "node_modules": sh.g.directory_ignore(),
            "package-lock.json": sh.g.file_generated(true),
            "package.json": sh.g.file_manual(),
            "src": sh.g.directory_group({
                "bin": sh.g.directory_wildcards(0, false, ["ts"], false),
                "bin.ts": sh.g.file_manual(),
                "data": sh.g.directory_wildcards(0, true, ["ts"], false),
                "globals.ts": sh.g.file_generated(true),
                "index.ts": sh.g.file_generated(true),
            }),
            "tsconfig.json": sh.g.file_generated(true)
        }),
        "lib": sh.g.directory_group({
            "dist": sh.g.directory_generated(false),
            "node_modules": sh.g.directory_ignore(),
            "package-lock.json": sh.g.file_generated(true),
            "package.json": sh.g.file_manual(),
            "src": sh.g.directory_group({
                "modules": sh.g.directory_dictionary(
                    sh.dgroup({
                        "interface": $_interface,
                        "shorthands": $_shorthands,
                        "declarations": $_declarations,
                        "implementation": $_implementation,
                    })
                ),
                "interface": $_interface,
                "shorthands": $_shorthands,
                "declarations": $_declarations,
                "implementation": $_implementation,
                "globals.ts": sh.g.file_generated(true),
                "index.ts": sh.g.file_generated(true),
            }),
            "tsconfig.json": sh.g.file_generated(true)
        }),
        "test": sh.g.directory_group({
            "dist": sh.g.directory_generated(false),
            "node_modules": sh.g.directory_ignore(),
            "package-lock.json": sh.g.file_generated(true),
            "package.json": sh.g.file_manual(),
            "src": sh.g.directory_group({
                "data": sh.g.directory_wildcards(0, true, ["ts"], false),
                "bin": sh.g.directory_group({
                    "test.ts": sh.g.file_generated(true)
                }),
                "globals.ts": sh.g.file_generated(true)
            }),
            "tsconfig.json": sh.g.file_generated(true)
        }),
    }),
    "README.md": sh.g.file_manual(),
    "testdata": sh.g.directory_freeform(),
})