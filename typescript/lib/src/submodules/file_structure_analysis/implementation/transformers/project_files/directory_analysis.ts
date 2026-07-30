import * as p_ from 'pareto-core/implementation/transformer'

import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/implementation/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'
import type * as p_di from 'pareto-core/interface/schema'

//schemas
import type * as s_in_directory_content from "../../../schemas/nested_directory_content_as_read.js"
import type * as s_structure from "../../../schemas/structure.js"

namespace s_xxx {
    export type Parameters = {
        'expected structure': s_structure.Directory,
        'structure path': s_path.Path,
    }
}
import type * as s_in from "../../../schemas/project_files.js"
import type * as s_out from "../../../schemas/file_structure_analysis.js"
import type * as s_path from "../../../schemas/path.js"

namespace declarations {
    export type line_count = p_.Transformer<
        p_di.List<number>,
        number
    >
    export type extension = p_.Transformer<
        string,
        p_di.Optional_Value<string>
    >
    export type Project_Files = p_.Transformer_With_Parameter<
        s_in.Project_Files,
        s_out.Project_File_Analysis_List,
        {
            'structure': s_structure.Directory,
        }
    >
    export namespace wildcard {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            {
                'wildcard': s_structure.Directory.wildcards,
                'structure path': s_path.Path,
                'tail': s_path.Path,
                'number of directories encountered': number,
            }
        >

    }
    export namespace defined {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            s_xxx.Parameters
        >

    }
    export namespace undefined {
        export type Directory = p_.Transformer_With_Parameter<
            s_in_directory_content.Directory,
            s_out.Directory,
            {
                'structure': s_out.Structure_Analysis,
                'unexpected path tail': p_di.Optional_Value<s_path.Path>,
            }
        >
        export type Node = p_.Transformer_With_Parameter<
            s_in_directory_content.Node,
            s_out.Node,
            {
                'structure': s_out.Structure_Analysis,
                'name': string,
                'unexpected path tail': p_di.Optional_Value<s_path.Path>,
            }
        >

    }




}

//data
// import { $$ as x_structure } from "../../../data/structure.js"

//dependencies
import * as t_package_files_to_directory_analysis from "../package_files/directory_analysis.js"

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