export type Package_State = {
    'package name in sync with directory name': boolean
    'version': null | string
    'git': {
        'staged files': boolean
        'dirty working tree': boolean
        'unpushed commits': boolean
    }
    'structure': (
        | ['valid', {
            'warnings': string[]
        }]
        | ['invalid', { errors: string[] }]
    )
    'test': (
        | ['skipped', null]
        | ['success', null]
        | ['failure', (
            | ['build', null]
            | ['test', { 'failed tests': string[] }]
        )
        ]
    )
    'dependencies': {
        [name: string]: {
            'version': string
            'target': (
                | ['not found', null]
                | ['found', {
                    'dependency up to date': boolean
                }]
            )
        }
    },
    'published comparison': (
        | ['not published', null]
        | ['identical', null]
        | ['different', {
            'details': string
        }]
        | ['skipped', null]
    )
}

export type Cluster_State = 
| ['not found', null]
| ['cluster', {
    'projects': {
        [node_name: string]: 
        | ['not a project', null]
        | ['project', Package_State]
    },
    'topological order': 
    | ['circular dependencies', null]
    | ['valid order', string[]]
}]