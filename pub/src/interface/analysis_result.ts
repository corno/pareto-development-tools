export type Package_Analysis_Result =
    | ['composite', { [key: string]: Package_Analysis_Result }]
    | ['leaf', {
        'outcome': string
        'status':
        | ['success', null]
        | ['issue', null]
        | ['warning', null]
        | ['unknown', null]
    }]

export type Cluster_Analysis_Result = { [key: string]: Package_Analysis_Result }