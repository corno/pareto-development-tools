import { Package_Cluster_State } from "pareto-development-tools/dist/interface/package_state"

import { $$ as analyse_cluster } from "pareto-development-tools/dist/queries/analyse_cluster"

import * as fs from "fs"


export const $$ = (path_to_cluster: string, test_name: string): void => {

    const result: Package_Cluster_State = analyse_cluster(path_to_cluster)

   fs.writeFileSync(`../tests/analysed_structures/${test_name}.json`, JSON.stringify(result, null, 4))

}