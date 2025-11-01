
export type Analysis_Result = {
    'status':
    | ['success', null]
    | ['error', null]
    | ['warning', null]
    'children': Analysis_Result[]
}