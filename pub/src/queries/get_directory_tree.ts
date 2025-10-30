import * as fs from 'fs'
import * as path from 'path'

export type Directory = { [name: string]: Node }

export type Node =
 | ['file', null]
 | ['directory', Directory]


export const get_directory_tree = (directory_path: string): Directory => {
    const result: Directory = {}
    
    const entries = fs.readdirSync(directory_path, { withFileTypes: true })
    
    for (const entry of entries) {
        const entry_path = path.join(directory_path, entry.name)
        
        if (entry.isDirectory()) {
            result[entry.name] = ['directory', get_directory_tree(entry_path)]
        } else if (entry.isFile()) {
            result[entry.name] = ['file', null]
        }
        // Note: ignoring symlinks and other special file types
    }
    
    return result
}