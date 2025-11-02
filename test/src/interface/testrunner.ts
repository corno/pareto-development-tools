
export type TestRunner = {
    'target_extension': string,  // e.g., 'json', 'txt', 'dot'
    'transformer': (input_content: string, filename_without_extension: string) => string,
}
