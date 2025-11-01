import { Structural_State } from "../interface/package_state"
import { analyse_structural_state } from "./analyse_structural_state"

export type Parameters = {
    'path to package': string,
    'directory name': string,
    'package name': string,
}

export function determine_structural_state(
    $p: Parameters
): Structural_State {
    return analyse_structural_state($p);
}