import { Cluster_State } from "pareto-development-tools/dist/interface/package_state"

import { $$ as analyse_cluster } from "pareto-development-tools/dist/queries/analyse_cluster"

import * as fs from "fs"


export const $$ = (path_to_cluster: string, path_to_test: string, test_name: string): void => {

    const result: Cluster_State = analyse_cluster(path_to_cluster)

   fs.writeFileSync(`${path_to_test}/analysed_structures/${test_name}.json`, JSON.stringify(result, null, 4))

}