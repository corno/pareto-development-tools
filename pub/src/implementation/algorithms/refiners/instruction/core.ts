import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

export type Iterator<Element, State> = {
    'consume current': () => _et.Optional_Value<Element>,
    'look ahead': (offset: number) => _et.Optional_Value<Element>
    'consume': () => void,
    'get state': () => State,
}

class Refine_Guard_Abort_Error<Error> {
    constructor(
        public readonly error: Error,
    ) { }
}

export type Abort<Error> = (error: Error) => never

export const create_refinement_context = <Result, Error, State>(
    callback: (abort: Abort<Error>) => Result,
): _et.Staging_Result<Result, Error> => {
    try {
        return _ea.data_processing.successful(callback(
            (error) => {
                throw new Refine_Guard_Abort_Error(error);
            },
        ))
    } catch (e) {
        if (e instanceof Refine_Guard_Abort_Error) {
            return _ea.data_processing.failed<Result, Error>(e.error)
        }
        //okay, this is unexpected, rethrow
        throw e
    }
}


export const create_array_iterator = <Element>($: _et.List<Element>): Iterator<Element, number> => {
    const length = $.__get_number_of_elements()
    let position = 0
    return {
        'consume current': () => {
            position += 1
            return $.__get_element_at(position - 1)
        },
        'look ahead': (offset: number) => {
            return $.__get_element_at(position + offset)
        },
        'get state': () => {
            return position
        },
        'consume': () => {
            position += 1
        },
    }
}

export const create_array_refiner = <Type, Error, Iterator_Element>(
    builder: (abort: Abort<Error>, iterator: Iterator<Iterator_Element, number>) => Type
): _et.Stager<Type, Error, _et.List<Iterator_Element>> => {
    return ($: _et.List<Iterator_Element>) => {
        const iter = create_array_iterator($)
        return create_refinement_context<Type, Error, Iterator<Iterator_Element, number>>(
            (abort) => {
                return builder(
                    abort,
                    iter
                )
            }
        )
    }
}