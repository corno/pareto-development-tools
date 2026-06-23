import * as sh from "../shorthands/structure/manual"

const $_interface = sh.g.directory_group({
    "commands.ts": sh.g.file_manual(),
    "generated": sh.g.directory_generated(true),
    "queries.ts": sh.g.file_manual(),
    "data": sh.g.directory_wildcards(0, false, ["ts"], true),
    "refiners": sh.g.directory_wildcards(1, false, ["ts"], false),
    "transformers": sh.g.directory_wildcards(1, false, ["ts"], false),
})

const $_implementation = sh.g.directory_group({
    "generated": sh.g.directory_generated(true),
    "manual": sh.g.directory_group({
        "commands": sh.g.directory_wildcards(0, false, ["ts"], false),
        "productions": sh.g.directory_wildcards(1, false, ["ts"], false),
        "queries": sh.g.directory_wildcards(0, false, ["ts"], false),
        "refiners": sh.g.directory_wildcards(1, false, ["ts"], false),
        "transformers": sh.g.directory_wildcards(1, false, ["ts"], false),
    }),
    "to_be_generated": sh.g.directory_group({
        "commands": sh.g.directory_generated(false),
        "productions": sh.g.directory_generated(false),
        "queries": sh.g.directory_generated(false),
        "refiners": sh.g.directory_generated(false),
        "transformers": sh.g.directory_generated(false),
    }),

})

export const $$ = sh.dgroup({
    ".git": sh.g.directory_ignore(),
    ".gitignore": sh.g.file_manual(),
    "data": sh.g.directory_freeform(),
    "documentation": sh.g.directory_freeform(),
    "LICENSE": sh.g.file_manual(),
    "out": sh.g.directory_generated(false),
    "liana": sh.g.directory_group({
        ".liana": sh.g.directory_ignore(),
        "module.liana.lna": sh.g.file_manual(),
    }),
    "typescript": sh.g.directory_group({
        "app": sh.g.directory_group({
            "dist": sh.g.directory_generated(false),
            "node_modules": sh.g.directory_ignore(),
            "package-lock.json": sh.g.file_generated(true),
            "package.json": sh.g.file_manual(),
            "src": sh.g.directory_group({
                "bin": sh.g.directory_wildcards(0, false, ["ts"], false),
                "bin.ts": sh.g.file_manual(),
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
                "data": sh.g.directory_wildcards(0, true, ["ts"], false),

                "globals.ts": sh.g.file_generated(true),
                "implementation": $_implementation,
                "interface": $_interface,
                "index.ts": sh.g.file_generated(true),
                "modules": sh.g.directory_dictionary(sh.dgroup({
                    "interface": $_interface,
                    "implementation": $_implementation,
                    "shorthands": sh.g.directory_dictionary(sh.dgroup({
                        "deprecated.ts": sh.g.file_manual(),
                        "manual.ts": sh.g.file_manual(),
                        "target.ts": sh.g.file_manual(),
                    })),
                })),
                "shorthands": sh.g.directory_dictionary(sh.dgroup({
                    "deprecated.ts": sh.g.file_manual(),
                    "manual.ts": sh.g.file_manual(),
                    "target.ts": sh.g.file_manual(),
                })),
            }),
            "tsconfig.json": sh.g.file_generated(true)
        }),
        "test": sh.g.directory_group({
            "dist": sh.g.directory_generated(false),
            "node_modules": sh.g.directory_ignore(),
            "package-lock.json": sh.g.file_generated(true),
            "package.json": sh.g.file_manual(),
            "src": sh.g.directory_group({
                "bin": sh.g.directory_group({
                    "test.ts": sh.g.file_generated(true)
                }),
                "globals.ts": sh.g.file_generated(true)
            }),
            "tsconfig.json": sh.g.file_generated(true)
        }),
    }),
    "README.md": sh.g.file_manual(),
    "temp": sh.g.directory_ignore(),
    "testdata": sh.g.directory_freeform(),
})