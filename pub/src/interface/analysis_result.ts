export type Package_Analysis_Result = {
    'category': string
    'outcome': string
    'status':
    | ['success', null]
    | ['error', null]
    | ['warning', null]
    | ['unknown', null]
    'children': Package_Analysis_Result[]
}

export type Cluster_Analysis_Result = { [key: string]: Package_Analysis_Result }