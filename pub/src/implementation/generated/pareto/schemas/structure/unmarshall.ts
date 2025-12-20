import * as _pa from 'exupery-core-alg'
import * as _pd from 'exupery-core-dev'

import * as _i_generic from "../../generic/unmarshall"
import * as _i_signatures from "../../../../../interface/generated/pareto/schemas/structure/unmarshall"
import * as _i_in from "../../../../../interface/generated/pareto/core/astn_source"
import * as _i_out from "../../../../../interface/generated/pareto/schemas/structure/data_types/target"


export const Directory: _i_signatures._T_Directory = ($, $p) => _i_generic.process_unconstrained_state_group(
    $,
    {
        'states': _pa.dictionary_literal({
            'dictionary': ($): _i_out._T_Directory.SG => ['dictionary', Directory(
                $,
                {
                    'value deserializers': $p['value deserializers'],
                }
            )],
            'group': ($): _i_out._T_Directory.SG => ['group', _i_generic.process_unconstrained_dictionary(
                $,
                {
                    'value': ($) => _i_generic.process_unconstrained_state_group(
                        $,
                        {
                            'states': _pa.dictionary_literal({
                                'directory': ($): _i_out._T_Directory.SG.group.D.SG => ['directory', Directory(
                                    $,
                                    {
                                        'value deserializers': $p['value deserializers'],
                                    }
                                )],
                                'file': ($): _i_out._T_Directory.SG.group.D.SG => ['file', _i_generic.process_unconstrained_state_group(
                                    $,
                                    {
                                        'states': _pa.dictionary_literal({
                                            'manual': ($): _i_out._T_Directory.SG.group.D.SG.file.SG => ['manual', _i_generic.process_nothing(
                                                $,
                                                null
                                            )],
                                            'generated': ($): _i_out._T_Directory.SG.group.D.SG.file.SG => ['generated', _i_generic.process_group(
                                                $,
                                                {
                                                    'properties': ($) => ({
                                                        'commit to git': _pa.cc(_i_generic.get_entry(
                                                            $,
                                                            {
                                                                'key': "commit to git",
                                                            }
                                                        ), ($) => _i_generic.process_boolean(
                                                            $,
                                                            {
                                                                'deserializer': $p['value deserializers']['boolean'],
                                                            }
                                                        )),
                                                    }),
                                                }
                                            )],
                                        }),
                                    }
                                )],
                            }),
                        }
                    ),
                }
            )],
            'wildcards': ($): _i_out._T_Directory.SG => ['wildcards', _i_generic.process_group(
                $,
                {
                    'properties': ($) => ({
                        'required directories': _pa.cc(_i_generic.get_entry(
                            $,
                            {
                                'key': "required directories",
                            }
                        ), ($) => _i_generic.process_number(
                            $,
                            {
                                'deserializer': $p['value deserializers']['default number'],
                            }
                        )),
                        'additional directories allowed': _pa.cc(_i_generic.get_entry(
                            $,
                            {
                                'key': "additional directories allowed",
                            }
                        ), ($) => _i_generic.process_boolean(
                            $,
                            {
                                'deserializer': $p['value deserializers']['boolean'],
                            }
                        )),
                        'extensions': _pa.cc(_i_generic.get_entry(
                            $,
                            {
                                'key': "extensions",
                            }
                        ), ($) => _i_generic.process_unconstrained_list(
                            $,
                            {
                                'value': ($) => _i_generic.process_text(
                                    $,
                                    null
                                ),
                            }
                        )),
                        'warn': _pa.cc(_i_generic.get_entry(
                            $,
                            {
                                'key': "warn",
                            }
                        ), ($) => _i_generic.process_boolean(
                            $,
                            {
                                'deserializer': $p['value deserializers']['boolean'],
                            }
                        )),
                    }),
                }
            )],
            'freeform': ($): _i_out._T_Directory.SG => ['freeform', _i_generic.process_nothing(
                $,
                null
            )],
            'ignore': ($): _i_out._T_Directory.SG => ['ignore', _i_generic.process_nothing(
                $,
                null
            )],
            'generated': ($): _i_out._T_Directory.SG => ['generated', _i_generic.process_group(
                $,
                {
                    'properties': ($) => ({
                        'commit to git': _pa.cc(_i_generic.get_entry(
                            $,
                            {
                                'key': "commit to git",
                            }
                        ), ($) => _i_generic.process_boolean(
                            $,
                            {
                                'deserializer': $p['value deserializers']['boolean'],
                            }
                        )),
                    }),
                }
            )],
        }),
    }
)
