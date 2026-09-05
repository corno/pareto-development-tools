import * as p_ from 'pareto-core/schema'

export type NPM_Package = {
    'name': string
    'version': string
    'dependencies': p_.Optional_Value<p_.Dictionary<string>>
}