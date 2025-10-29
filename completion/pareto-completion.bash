#!/bin/bash
# Bash completion script for pareto CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pareto_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of all available commands
    local commands="publish ensure-valid-commit build test clean compare validate-structure update cluster help --help -h"
    
    # Sub-commands for 'cluster'
    local cluster_subcommands="build test clean commit stage update compare validate-structure ensure-valid-commits wip list-loc dependency-graph"
    
    # If completing first argument after 'pareto'
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
        return 0
    fi
    
        # If previous word is 'cluster', provide sub-commands
        if [[ "${prev}" == "cluster" ]]; then
            COMPREPLY=($(compgen -W "${cluster_subcommands}" -- "${cur}"))
            return 0
        fi    # Command-specific completions
    case "${prev}" in
        publish|ensure-valid-commit|build|test|clean|compare|validate-structure|update)
            # These commands take a directory path as argument
            COMPREPLY=($(compgen -d -- ${cur}))
            return 0
            ;;
        commit|stage|update|dependency-graph|wip|list-loc|ensure-valid-commits)
            # Sub-commands of 'cluster' that take a directory path
            if [[ "${COMP_WORDS[1]}" == "cluster" ]]; then
                COMPREPLY=($(compgen -d -- ${cur}))
                return 0
            fi
            ;;
    esac
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pareto_completions pareto
