import * as _et from 'exupery-core-types'

import * as d_console_error from "./to_be_generated/console_error"
import * as d_console_log from "./to_be_generated/console_log"
import * as d_write_to_directory from "./to_be_generated/write_to_dictionary"
import * as d_write_to_file from "./to_be_generated/write_to_file"

export namespace commands {

    export type console_error = _et.Command<d_console_error.Error, d_console_error.Parameters>
    export type console_log = _et.Command<d_console_log.Error, d_console_log.Parameters>
    export type write_to_directory = _et.Command<d_write_to_directory.Error, d_write_to_directory.Parameters>
    export type write_to_file = _et.Command<d_write_to_file.Error, d_write_to_file.Parameters>

}