#!/bin/bash
# Bash completion script for pareto CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pareto_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of all available commands
    local commands="publish ensure-valid-commit build test clean compare validate-structure update all help --help -h"
    
    # Sub-commands for 'all'
    local all_subcommands="build test clean commit stage update compare validate-structure list-wip list-loc dependency-graph"
    
    # If completing first argument after 'pareto'
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
        return 0
    fi
    
        # If previous word is 'all', provide sub-commands
        if [[ "${prev}" == "all" ]]; then
            COMPREPLY=($(compgen -W "build test clean commit ensure-valid-commits stage update validate-structure wip list-loc dependency-graph" -- "${cur}"))
            return 0
        fi    # Command-specific completions
    case "${prev}" in
        publish|ensure-valid-commit|build|test|clean|compare|validate-structure|update)
            # These commands take a directory path as argument
            COMPREPLY=($(compgen -d -- ${cur}))
            return 0
            ;;
        commit|stage|update|dependency-graph|list-wip|list-loc|ensure-valid-commits)
            # Sub-commands of 'all' that take a directory path
            if [ "${COMP_WORDS[1]}" = "all" ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
                return 0
            fi
            ;;
    esac
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pareto_completions pareto
