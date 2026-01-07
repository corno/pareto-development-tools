import * as _pi from 'pareto-core-interface'

// import * as d_epe from "pareto-resources/dist/interface/generated/pareto/schemas/execute_procedure_executable/data_types/source"
import * as d_path from "pareto-resources/dist/interface/generated/pareto/schemas/path/data_types/target"
import * as d_push from "../../modules/git/interface/to_be_generated/push"

export type Parameters = {
    'generation':
    | ['minor', null]
    | ['patch', null]
    'path to package': d_path.Context_Path
}

export type Error =
    | ['error while running git push', d_push.Error]
