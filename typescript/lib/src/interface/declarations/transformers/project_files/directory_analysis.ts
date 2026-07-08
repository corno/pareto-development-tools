import * as p_ from 'pareto-core/implementation/transformer'
import type * as p_di from 'pareto-core/interface/data'
import type * as p_i from 'pareto-core/interface/transformer'

import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'
import p_list_build_deprecated from 'pareto-core/implementation/refiner/specials/list_build_deprecated'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_change_context from 'pareto-core/implementation/refiner/specials/change_context'

//data types
import type * as d_in from "../../../../interface/data/project_files.js"
import type * as d_in_directory_content from "pareto-filesystem-unrestricted-api/interface/data/directory_content"
import type * as d_out from "../../../../interface/data/file_structure_analysis.js"
import type * as d_structure from "../../../../interface/generated/liana/schemas/structure/data.js"

export namespace d_xxx {
    export type Parameters = {
        'expected structure': d_structure.Directory,
        'structure path': d_out.Path,
    }
}

export namespace interface_ {

    export type line_count = p_i.Transformer<
        string,
        number
    >

    export type extension = p_i.Transformer<
        string,
        p_di.Optional_Value<string>
    >

    export type Project_Files = p_i.Transformer<
        d_in.Project_Files,
        d_out.File_Analysis_List
    >


    export namespace defined {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            d_xxx.Parameters
        >

    }

    export namespace undefined {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            {
                'structure': d_out.Structure_Analysis,
                'unexpected path tail': p_di.Optional_Value<d_out.Path>,
            }
        >

        export type Node = p_i.Transformer_With_Parameter<
            d_in_directory_content.Node,
            d_out.Node,
            {
                'structure': d_out.Structure_Analysis,
                'name': string,
                'unexpected path tail': p_di.Optional_Value<d_out.Path>,
            }
        >

    }

    export namespace wildcard {

        export type Directory = p_i.Transformer_With_Parameter<
            d_in_directory_content.Directory,
            d_out.Directory,
            {
                'wildcard': d_structure.Directory.wildcards,
                'structure path': d_out.Path,
                'tail': d_out.Path,
                'number of directories encountered': number,
            }
        >

    }

}
