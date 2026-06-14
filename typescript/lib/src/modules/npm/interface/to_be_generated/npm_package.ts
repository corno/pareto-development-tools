import * as p_di from 'pareto-core/dist/data/interface'

export type NPM_Package = {
    'name': string
    'version': string
    'dependencies': p_di.Optional_Value<p_di.Dictionary<string>>
}