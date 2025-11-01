#!/bin/bash
# Bash completion script for pareto CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pareto_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of currently available commands (only uncommented ones)
    local commands="build compare analyse cluster-analyse help --help -h"
    
    # Analysis flags for analyse and cluster-analyse commands
    local analyse_flags="--help -h --structural --pre-commit --pre-publish"
    
    # If completing first argument after 'pareto'
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
        return 0
    fi
    
    # Command-specific completions
    case "${prev}" in
        build|compare)
            # These commands take a directory path as argument
            COMPREPLY=($(compgen -d -- ${cur}))
            return 0
            ;;
        analyse|cluster-analyse)
            # Check if we're completing a flag
            if [[ "${cur}" == -* ]]; then
                COMPREPLY=($(compgen -W "${analyse_flags}" -- ${cur}))
            else
                # Complete directory path
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
            return 0
            ;;
    esac
    
    # If previous argument was analyse or cluster-analyse, and current is a flag, 
    # still allow directory completion for the path argument
    if [[ "${COMP_WORDS[1]}" == "analyse" || "${COMP_WORDS[1]}" == "cluster-analyse" ]]; then
        # Check if previous word was a flag
        if [[ "${prev}" == "--structural" || "${prev}" == "--pre-commit" || "${prev}" == "--pre-publish" || "${prev}" == "--help" ]]; then
            COMPREPLY=($(compgen -d -- ${cur}))
            return 0
        fi
    fi
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pareto_completions pareto
