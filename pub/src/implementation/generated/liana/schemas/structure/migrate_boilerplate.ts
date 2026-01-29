
import * as _p from "pareto-core/dist/transformer"

import {
    _p_unreachable_code_path,
} from "pareto-core/dist/unreachable_code_path"

import {
    _p_cc,
} from "pareto-core/dist/change_context"

import * as t_signatures from "../../../../../interface/generated/liana/schemas/structure/migrate_boilerplate"

import * as t_out from "../../../../../interface/generated/liana/schemas/structure/data"

export const Directory: t_signatures.Directory = ($) => _p.decide.state(
    $,
    ($): t_out.Directory => {
        switch ($[0]) {
            case 'dictionary':
                return _p.ss(
                    $,
                    ($) => ['dictionary', Directory(
                        $
                    )]
                )
            case 'group':
                return _p.ss(
                    $,
                    ($) => ['group', $.__d_map(
                        ($, id) => _p.decide.state(
                            $,
                            ($): t_out.Directory.group.D => {
                                switch ($[0]) {
                                    case 'directory':
                                        return _p.ss(
                                            $,
                                            ($) => ['directory', Directory(
                                                $
                                            )]
                                        )
                                    case 'file':
                                        return _p.ss(
                                            $,
                                            ($) => ['file', _p.decide.state(
                                                $,
                                                ($): t_out.Directory.group.D.file => {
                                                    switch ($[0]) {
                                                        case 'manual':
                                                            return _p.ss(
                                                                $,
                                                                ($) => ['manual', null]
                                                            )
                                                        case 'generated':
                                                            return _p.ss(
                                                                $,
                                                                ($) => ['generated', ({
                                                                    'commit to git': _p_cc(
                                                                        $['commit to git'],
                                                                        ($) => $
                                                                    ),
                                                                })]
                                                            )
                                                        default:
                                                            return _p.au(
                                                                $[0]
                                                            )
                                                    }
                                                }
                                            )]
                                        )
                                    default:
                                        return _p.au(
                                            $[0]
                                        )
                                }
                            }
                        )
                    )]
                )
            case 'wildcards':
                return _p.ss(
                    $,
                    ($) => ['wildcards', ({
                        'required directories': _p_cc(
                            $['required directories'],
                            ($) => $
                        ),
                        'additional directories allowed': _p_cc(
                            $['additional directories allowed'],
                            ($) => $
                        ),
                        'extensions': _p_cc(
                            $['extensions'],
                            ($) => $.__l_map(
                                ($) => $
                            )
                        ),
                        'warn': _p_cc(
                            $['warn'],
                            ($) => $
                        ),
                    })]
                )
            case 'freeform':
                return _p.ss(
                    $,
                    ($) => ['freeform', null]
                )
            case 'ignore':
                return _p.ss(
                    $,
                    ($) => ['ignore', null]
                )
            case 'generated':
                return _p.ss(
                    $,
                    ($) => ['generated', ({
                        'commit to git': _p_cc(
                            $['commit to git'],
                            ($) => $
                        ),
                    })]
                )
            default:
                return _p.au(
                    $[0]
                )
        }
    }
)
