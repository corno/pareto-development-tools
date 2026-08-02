import * as p_ from 'pareto-core/interface/schema'

import type * as s_npm_package from "../../../npm/schemas/npm_package/schema.js"

export type Package_Dependencies = {
    'packages': p_.Dictionary<s_npm_package.NPM_Package>
}