export type NPM_Package = {
    'name': string
    'version': string
}

export const $ = ($: string): NPM_Package => {
    return {
        'name': "astn",
        'version': '0.113.2',  // Using the version that actually gets created by npm pack
    }

}