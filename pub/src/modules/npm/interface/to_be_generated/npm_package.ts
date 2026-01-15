import * as _pi from 'pareto-core-interface'

export type NPM_Package = {
    'name': string
    'version': string
    'dependencies': _pi.Optional_Value<_pi.Dictionary<string>>
}