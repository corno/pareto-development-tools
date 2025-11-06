
export namespace Basics {

    export type Cluste_State<Level> =
        | ['not found', null]
        | ['cluster', {
            'projects': {
                [node_name: string]:
                | ['not a project', null]
                | ['project', Package_State<Level>]
            },
            'topological order':
            | ['circular dependencies', null]
            | ['valid order', string[]]
        }]

    export type Package_State<Level> = {
        'package name in package.json': string
        'version': null | string
        'level': Level
    }
}




export type Pre_Publish_State = {
    'pre-commit': Pre_Commit_State
    'git': {
        'staged files': boolean
        'dirty working tree': boolean
        'unpushed commits': boolean
    }
    'dependencies': {
        [name: string]: {
            'version': string
            'target': (
                /** the target is found if there is a sibling directory with this name, this is not about the npm registry */
                | ['not found', null]
                | ['found', {
                    'dependency up to date': boolean
                }]
            )
        }
    },
    'published comparison': (
        | ['could not compare',
            | ['no package', null]
            | ['no package name', null]
            | ['not published', null]
        ]
        | ['could compare',
            | ['identical', null]
            | ['different', null]
        ]
    )
}

export type Pre_Commit_State = {
    'test': (
        | ['success', null]
        | ['failure', (
            | ['build', null]
            | ['test', { 'failed tests': string[] }]
        )
        ]
    )
    'structural': Structural_State
}

export type Structural_State = {
    'package name the same as directory': boolean
    'structure': (
        | ['valid', {
            'warnings': string[]
        }]
        | ['invalid', { errors: string[] }]
    )
    'interface implementation match': (
        | ['root interface direcory missing', null]
        | ['root implementation direcory missing', null]
        | ['matched', null]
        | ['mismatched', {
            'differences': {
                'path': string
                'problem': (
                    | ['missing', null]
                    | ['superfluous', null]
                )
            }[]
        }]
    )
}







export type Cluster_Pre_Publish_State = Basics.Cluste_State<Pre_Publish_State>

export type Package_Pre_Publish_State = Basics.Package_State<Pre_Publish_State>





export type Cluster_Pre_Commit_State = Basics.Cluste_State<Pre_Commit_State>

export type Package_Pre_Commit_State = Basics.Package_State<Pre_Commit_State>






export type Cluster_Structural_State = Basics.Cluste_State<Structural_State>

export type Package_Structural_State = Basics.Package_State<Structural_State>



