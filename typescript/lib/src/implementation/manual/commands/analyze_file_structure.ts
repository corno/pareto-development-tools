import * as pt from 'pareto-core/dist/command'

import * as signatures from "../../../interface/signatures"


//data types
import * as d from "../../../interface/to_be_generated/get_project_files"

//dependencies
import * as t_csv_to_fountain_pen from "../../../modules/csv/implementation/manual/transformers/csv/fountain_pen"
import * as t_file_structure_analysis_to_csv from "../transformers/file_structure_analysis/csv"
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis"
import { $$ as q_get_project_files } from "../queries/get_project_files"

export const $$: signatures.commands.analyze_file_structure = pt.command_procedure(
    ($d, $s, $q, $c) => [

        pt.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): d.Error => $,

            ),
            ($, abort) => $,
            ($v) => [

                $c.log.execute(
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
