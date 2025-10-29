import { Project_State } from "./project_state";

export type Project_Cluster_State = {
    [projectName: string]: Project_State
}