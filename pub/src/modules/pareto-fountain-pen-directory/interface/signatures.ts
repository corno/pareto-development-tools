import * as _pi from 'pareto-core-interface'

import * as resources from "./resources"
import * as resources_exupery from "exupery-resources/dist/interface/resources"

export namespace commands {

    export type console_error = _pi.Command_Procedure<
        resources.commands.console_error,
        {
            'log error': resources_exupery.commands.log_error
        },
        null
    >

    export type console_log = _pi.Command_Procedure<
        resources.commands.console_log,
        {
            'log': resources_exupery.commands.log
        },
        null
    >

    export type write_to_directory = _pi.Command_Procedure<
        resources.commands.write_to_directory,
        {
            'remove': resources_exupery.commands.remove
            'write to_file': resources.commands.write_to_file
        },
        null
    >

    export type write_to_file = _pi.Command_Procedure<
        resources.commands.write_to_file,
        {
            'make directory': resources_exupery.commands.make_directory
            'write file': resources_exupery.commands.write_file
        },
        null
    >

}