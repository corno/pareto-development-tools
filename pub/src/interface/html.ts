
export type Document = {
    'css': string
    'root': Div
}

export type Classes = string[]

export type Div = {
    'classes': Classes
    'width'?: number
    'height'?: number

    'children': Div.Child[]
}

export type Span = {
    'classes': Classes
    'title'?: string
    'children': {
        'classes': Classes
        'type': (
            | ['span', Span]
            | ['a', {
                'text': string
                'href': string
            }]
            | ['p', {
                'text': string
            }]
        )
    }[]
}

export namespace Div {
    export type Child = {
        'type': (
            | ['div', Div]
            | ['table', {
                'classes': Classes
                'children': Table_Section[]
            }]
            | ['span', Span]
            | ['label', {
                'classes': Classes
                'text': string
                'div': Div
            }]
            | ['img', {
                'classes': Classes
                'src': string
                'alt': string
                'width'?: number
                'height'?: number
            }]
            | ['svg', {
                'classes': Classes
                'content': string  // SVG markup as string
                'width'?: number
                'height'?: number
            }]
        )
    }

}

export type Table_Section = {
    'classes': Classes
    'type': (
        | ['header', null]
        | ['body', null]
        | ['footer', null]
    )
    'rows': Table_Row[]
}

export type Table_Row = {
    'classes': Classes
    'type': (
        | ['th', null]
        | ['td', null]
    )
    'height'?: number
    'cells': Table_Cell[]
}

export type Table_Cell = {
    'classes': Classes
    'width'?: number
    'height'?: number
    'div': Div
}