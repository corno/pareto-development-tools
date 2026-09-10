import * as p_ from 'pareto-core/schema'
import * as p_t from 'pareto-core/transformer'

export const single_entry_dictionary = <T extends p_.Value>(
    id: string,
    value: T,
): p_.Dictionary<T> => {
    return p_t.literal.dictionary({
        [id]: value,
    })
}