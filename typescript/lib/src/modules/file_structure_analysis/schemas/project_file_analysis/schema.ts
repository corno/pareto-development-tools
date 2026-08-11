import * as p_ from 'pareto-core/interface/schema'

import * as s_file_structure_analysis from "../file_structure_analysis/schema.js"

export type Project_File_Analysis_List = p_.List<Project_File_Analysis>

export type Project_File_Analysis = {
    'package': string,
    'path': string,
    'analysis': s_file_structure_analysis.Analyzed_Node,
}