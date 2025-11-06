import { Pre_Commit_State } from "../interface/package_state"
import { analyse_pre_commit_state } from "./analyse_pre_commit_state"

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
}

export function determine_pre_commit_state(
    $p: Parameters
): Pre_Commit_State {
    return analyse_pre_commit_state($p);
}