import * as _et from 'exupery-core-types'
import { Instruction } from '../procedures/commands/git_extended_commit'

export type Error =
    | ['no commit message specified', null]

export type Processor = _et.Processor<_et.Array<string>, Instruction, Error>