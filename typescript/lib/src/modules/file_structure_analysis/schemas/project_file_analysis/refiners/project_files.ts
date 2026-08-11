import * as p_ from 'pareto-core/implementation/refiner'
import * as p_temp from 'pareto-core/implementation/transformer'

//schemas
import type * as s_structure from "../../structure/schema.js"

import type * as s_in from "../../project_files/schema.js"
import type * as s_out from "../schema.js"

namespace declarations {

    export type Project_File_Analysis_List = p_.Refiner_Without_Error_With_Parameter<
        s_out.Project_File_Analysis_List,
        s_in.Project_Files,
        {
            'structure': s_structure.Directory,
        }
    >

}

//dependencies
import * as r_analysis_from_package_files from "../../package_file_analysis/refiners/package_files.js"

export const Project_File_Analysis_List: declarations.Project_File_Analysis_List = ($, $p) => p_temp.from.dictionary($).flatten_to_list(
    ($, id): s_out.Project_File_Analysis_List => {
        const package_name = id
        return p_temp.from.dictionary(
            r_analysis_from_package_files.Analyzed_Package_Nodes(
                $,
                {
                    'structure': $p.structure,
                }
            )
        ).convert_to_list(
            ($, id) => ({
                'package': package_name,
                'path': id,
                'analysis': $,
            })
        )
    }
)