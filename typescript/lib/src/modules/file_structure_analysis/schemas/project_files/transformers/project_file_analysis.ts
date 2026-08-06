import * as p_ from 'pareto-core/implementation/transformer'

//schemas
import type * as s_structure from "../../structure/schema.js"

import type * as s_in from "../schema.js"
import type * as s_out from "../../project_file_analysis/schema.js"

namespace declarations {

    export type Project_Files = p_.Transformer_With_Parameter<
        s_in.Project_Files,
        s_out.Project_File_Analysis_List,
        {
            'structure': s_structure.Directory,
        }
    >
    




}

//dependencies
import * as t_package_files_to_directory_analysis from "../../package_files/transformers/directory_analysis.js"

export const Project_Files: declarations.Project_Files = ($, $p) => p_.from.dictionary($).flatten_to_list(
    ($, id): s_out.Project_File_Analysis_List => {
        const package_name = id
        return p_.from.list(
            t_package_files_to_directory_analysis.Package_Files(
                $,
                {
                    'structure': $p.structure,
                }
            )
        ).map(
            ($) => ({
                'package': package_name,
                'path': $.path,
                'analysis': $.analysis,
            })
        )
    }
)