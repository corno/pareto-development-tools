import { Cluster_State } from "pareto-development-tools/dist/interface/package_state"

import { $$ as analyse_cluster, Parameters } from "pareto-development-tools/dist/queries/analyse_cluster"

import * as fs from "fs"


export const $$ = (
    $p: {
        'analyse parameters': Parameters
        'path to test': string,
        'test name': string,
    }
): void => {

    const result: Cluster_State = analyse_cluster($p['analyse parameters'])

   fs.writeFileSync(`${$p['path to test']}/analysed_structures/${$p['test name']}.json`, JSON.stringify(result, null, 4))

}