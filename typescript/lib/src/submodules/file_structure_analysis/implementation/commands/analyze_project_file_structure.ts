import * as p_ from 'pareto-core/implementation/command'

//interface dependencies
import type * as command_interfaces from "../../commands.js"
import type * as command_interfaces_pareto_stream_api from "pareto-stream-api/interface/commands"
import type * as query_interfaces_pareto_filesystem_unrestricted_api from "pareto-filesystem-unrestricted-api/modules/unrestricted/interface/queries"
import type * as s_structure from "../../schemas/structure.js"


//schemas
import * as d from "../../schemas/get_project_files.js"

//dependencies
import * as t_csv_to_paragraph from "pareto-csv/implementation/transformers/csv/paragraph"
import * as t_paragraph_to_serialized from "pareto-fountain-pen/modules/paragraph/implementation/transformers/paragraph/serialized"
import * as t_file_structure_analysis_to_csv from "../transformers/file_structure_analysis/csv.js"
import * as t_project_files_to_file_analysis_list from "../transformers/project_files/directory_analysis.js"
import { $$ as q_get_project_files } from "../queries/get_project_files.js"

export const $$: p_.Command_Implementation<
    command_interfaces.analyze_project_file_structure,
    {
        'structure': s_structure.Directory
        'indentation': string
    },
    {
        'read directory': query_interfaces_pareto_filesystem_unrestricted_api.read_directory,
        'read file': query_interfaces_pareto_filesystem_unrestricted_api.read_file
    },
    {
        'log lines': command_interfaces_pareto_stream_api.log_lines
    }
> = p_.command(
    ($d, $s, $q, $c) => [

        p_.s.query(
            q_get_project_files(null, $q)(
                {
                    'path to project': $d['path to project'],
                },
                ($): d.Error => $,

            ),
            ($v) => [

                $c['log lines'].execute(
                    {
                        'lines': t_paragraph_to_serialized.Paragraph(
                            t_csv_to_paragraph.CSV(
                                t_file_structure_analysis_to_csv.File_Analysis_List(
                                    t_project_files_to_file_analysis_list.Project_Files(
                                        $v,
                                        {
                                            'structure': $s.structure,
                                        }
                                    )
                                ),
                                {
                                    'separator': 0x2C, //comma
                                }
                            ),
                            {
                                'indentation': $s.indentation,
                            }
                        ),
                    },
                    ($): d.Error => ['log', $],
                )
            ]
        ),
    ]
)
