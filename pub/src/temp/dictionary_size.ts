import * as _et from 'exupery-core-types'

export const $$ = <T>($: _et.Dictionary<T>): number => {
    let count = 0
    $.map(
        () => {
            count += 1
        }
    )
    return count
}