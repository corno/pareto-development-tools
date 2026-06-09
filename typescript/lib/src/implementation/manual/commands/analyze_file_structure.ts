import * as _p from 'pareto-core/dist/command'
import * as _pt from 'pareto-core/dist/assign'
import * as _pi from 'pareto-core/dist/interface'
import * as _pq from 'pareto-core/dist/query'

import * as signatures from "../../../interface/signatures"


//data types
import * as d from "../../../interface/to_be_generated/get_project_files"

//dependencies
import * as t_csv_to_fountain_pen from "../../../modules/csv/implementation/manual/transformers/csv/fountain_pen"
import * as t_file_structure_analysis_to_csv from "../transformers/file_structure_analysis/csv"
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis"
import { $$ as q_get_project_files } from "../queries/get_project_files"

export const $$: signatures.commands.analyze_file_structure = _p.command_procedure(
    ($p, $cr, $q) => [

        _p.query(
            q_get_project_files($q, null)(
                {
                    'path to project': $p['path to project'],
                },
                ($): d.Error => $,

            ),
            ($, abort) => $,
            ($v) => [

                $cr.log.execute(
                    {




                        'message': t_csv_to_fountain_pen.CSV(
                            t_file_structure_analysis_to_csv.File_Analysis_List(
                                t_project_files_to_file_analysis_list.Project_Files($v)
                            ),
                            {
                                'separator': 0x2C, //comma
                            }
                        ),
                    },
                    ($): d.Error => ['log', $],
                )
            ]
        ),
    ]
)
