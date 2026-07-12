
import type * as p_di from 'pareto-core/interface/data'
import type * as p_ from 'pareto-core/interface/transformer'

//schemas
import type * as s_in from "../../../interface/schemas/project_files.js"
import type * as s_in_directory_content from "pareto-filesystem-unrestricted-api/interface/data/directory_content"
import type * as s_out from "../../../interface/schemas/file_structure_analysis.js"
import type * as s_structure from "../../../interface/schemas/structure.js"

export namespace s_xxx {
    export type Parameters = {
        'expected structure': s_structure.Directory,
        'structure path': s_out.Path,
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
    s_in.Project_Files,
    s_out.File_Analysis_List,
    {
        'structure': s_structure.Directory,
    }
>


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
            'unexpected path tail': p_di.Optional_Value<s_out.Path>,
        }
    >

    export type Node = p_.Transformer_With_Parameter<
        s_in_directory_content.Node,
        s_out.Node,
        {
            'structure': s_out.Structure_Analysis,
            'name': string,
            'unexpected path tail': p_di.Optional_Value<s_out.Path>,
        }
    >

}

export namespace wildcard {

    export type Directory = p_.Transformer_With_Parameter<
        s_in_directory_content.Directory,
        s_out.Directory,
        {
            'wildcard': s_structure.Directory.wildcards,
            'structure path': s_out.Path,
            'tail': s_out.Path,
            'number of directories encountered': number,
        }
    >

}


