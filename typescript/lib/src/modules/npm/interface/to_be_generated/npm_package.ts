import * as pi from 'pareto-core/dist/interface'

export type NPM_Package = {
    'name': string
    'version': string
    'dependencies': pi.Optional_Value<pi.Dictionary<string>>
}