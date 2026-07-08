import * as p_ from 'pareto-core/implementation/command'

import type * as interface_ from "../../../interface/declarations/commands.js"


//data types
import * as d from "../../../interface/data/get_project_files.js"

//dependencies
import * as t_csv_to_prose from "../../../modules/csv/implementation/manual/transformers/csv/prose.js"
import * as t_file_structure_analysis_to_csv from "../transformers/file_structure_analysis/csv.js"
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis.js"
import { $$ as q_get_project_files } from "../queries/get_project_files.js"

export const $$: interface_.analyze_file_structure = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): d.Error => $,

            ),
            ($v) => [

                $c.log.execute(
                    {
                        'message': t_csv_to_prose.CSV(
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
