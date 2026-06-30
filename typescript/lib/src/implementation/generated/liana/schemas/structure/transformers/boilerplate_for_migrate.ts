
import * as p_ from 'pareto-core/dist/implementation/transformer'

import p_change_context from 'pareto-core/dist/implementation/refiner/specials/change_context'

import * as t_signatures from "../../../../../../interface/generated/liana/schemas/structure/signatures/transformers/boilerplate_for_migrate"

import * as t_out from "../../../../../../interface/generated/liana/schemas/structure/data"

const p_decide_state = <State, B>($: State,  assign: ($: State) => B) => assign($)


export const Directory: t_signatures.Directory = ($) => p_decide_state(
    $,
    ($): t_out.Directory => {
        switch ($[0]) {
            case 'dictionary':
                return p_.option(
                    $,
                    ($) => ['dictionary', Directory(
                        $,
                    )],
                )
            case 'group':
                return p_.option(
                    $,
                    ($) => ['group', p_.from.dictionary($,
                    ).map(
                        ($, id) => p_decide_state(
                            $,
                            ($): t_out.Directory.group.D => {
                                switch ($[0]) {
                                    case 'directory':
                                        return p_.option(
                                            $,
                                            ($) => ['directory', Directory(
                                                $,
                                            )],
                                        )
                                    case 'file':
                                        return p_.option(
                                            $,
                                            ($) => ['file', p_decide_state(
                                                $,
                                                ($): t_out.Directory.group.D.file => {
                                                    switch ($[0]) {
                                                        case 'manual':
                                                            return p_.option(
                                                                $,
                                                                ($) => ['manual', null],
                                                            )
                                                        case 'generated':
                                                            return p_.option(
                                                                $,
                                                                ($) => ['generated', {
                                                                    'commit to git': p_change_context(
                                                                        $['commit to git'],
                                                                        ($) => $,
                                                                    ),
                                                                }],
                                                            )
                                                        default:
                                                            return p_.au(
                                                                $[0],
                                                            )
                                                    }
                                                },
                                            )],
                                        )
                                    default:
                                        return p_.au(
                                            $[0],
                                        )
                                }
                            },
                        ),
                    )],
                )
            case 'wildcards':
                return p_.option(
                    $,
                    ($) => ['wildcards', {
                        'required directories': p_change_context(
                            $['required directories'],
                            ($) => $,
                        ),
                        'additional directories allowed': p_change_context(
                            $['additional directories allowed'],
                            ($) => $,
                        ),
                        'extensions': p_change_context(
                            $['extensions'],
                            ($) => p_.from.list($,
                            ).map(
                                ($) => $,
                            ),
                        ),
                        'warn': p_change_context(
                            $['warn'],
                            ($) => $,
                        ),
                    }],
                )
            case 'freeform':
                return p_.option(
                    $,
                    ($) => ['freeform', null],
                )
            case 'ignore':
                return p_.option(
                    $,
                    ($) => ['ignore', null],
                )
            case 'generated':
                return p_.option(
                    $,
                    ($) => ['generated', {
                        'commit to git': p_change_context(
                            $['commit to git'],
                            ($) => $,
                        ),
                    }],
                )
            default:
                return p_.au(
                    $[0],
                )
        }
    },
)
