import * as _et from 'exupery-core-types'

import * as d_epe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"

export type Parameters = {
    'path': string,
    'what':
    | ['dependencies', null]
    | ['dev-dependencies', null],
    'verbose': boolean,
}

export type Error =
    | ['error while running update2latest', d_epe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]

export type Resources = {
    'commands': {
        'update2latest': _et.Command<d_epe.Parameters, d_epe.Error>
    }
}

export type Procedure =  _et.Command_Procedure<Parameters, Error, Resources>