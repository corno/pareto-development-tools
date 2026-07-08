
import type * as p_i from 'pareto-core/interface/transformer'
import p_text_from_list from 'pareto-core/implementation/transformer/specials/text_from_list'
import p_list_from_text from 'pareto-core/implementation/refiner/specials/list_from_text'

//data types
import type * as d_in from "../../../data/file_structure_analysis.js"
import type * as d_out from "pareto-fountain-pen/interface/generated/liana/schemas/text/data"


    export type Path = p_i.Transformer<
        d_in.Path,
        d_out.Text
    >

