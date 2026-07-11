
import type * as p_di from 'pareto-core/interface/data'
import type * as p_ from 'pareto-core/interface/transformer'

//data types
import type * as d_in from "../../../interface/schemas/project_files.js"
import type * as d_in_directory_content from "pareto-filesystem-unrestricted-api/interface/data/directory_content"
import type * as d_out from "../../../interface/schemas/file_structure_analysis.js"
import type * as d_structure from "../../../interface/schemas/structure.js"

export namespace d_xxx {
    export type Parameters = {
        'expected structure': d_structure.Directory,
        'structure path': d_out.Path,
    }

}


export type line_count = p_.Transformer<
    string,
    number
>

export type extension = p_.Transformer<
    string,
    p_di.Optional_Value<string>
>

export type Project_Files = p_.Transformer_With_Parameter<
    d_in.Project_Files,
    d_out.File_Analysis_List,
    {
        'structure': d_structure.Directory,
    }
>


export namespace defined {

    export type Directory = p_.Transformer_With_Parameter<
        d_in_directory_content.Directory,
        d_out.Directory,
        d_xxx.Parameters
    >

}

export namespace undefined {

    export type Directory = p_.Transformer_With_Parameter<
        d_in_directory_content.Directory,
        d_out.Directory,
        {
            'structure': d_out.Structure_Analysis,
            'unexpected path tail': p_di.Optional_Value<d_out.Path>,
        }
    >

    export type Node = p_.Transformer_With_Parameter<
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

    export type Directory = p_.Transformer_With_Parameter<
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


