import * as _et from 'exupery-core-types'

import * as d_espe from "exupery-resources/dist/interface/generated/pareto/schemas/execute_smelly_procedure_executable/data_types/source"


export type Error =
    | ['error while running tsc', d_espe.Error]
// | ['could not commit', d_eqe.Error]
// | ['could not push', d_eqe.Error]


export type Parameters = {
    'path': _et.Optional_Value<string>,
}

export type Resources = {
    'commands': {
        'tsc': _et.Command<d_espe.Parameters, d_espe.Error>
    }
}

export type Procedure =  _et.Command_Procedure<Parameters, Error, Resources>