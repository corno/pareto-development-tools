import * as p_ from 'pareto-core/interface/command_interface'

import type * as s_create_dependency_graph from "../schemas/create_dependency_graph/schema.js"

export type create_dependency_graph = p_.Command_Interface<
    s_create_dependency_graph.Error,
    s_create_dependency_graph.Parameters
>