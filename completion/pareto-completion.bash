#!/bin/bash
# Bash completion script for pareto CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pareto_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of currently available commands (only uncommented ones)
            commands="build compare analyse cluster-analyse commit-and-push"
    
    # Analysis flags for analyse and cluster-analyse commands
    local analyse_flags="--help -h --structural --pre-commit --pre-publish"
    
    # Commit and push flags
    local commit_push_flags="--help -h --dry-run --no-push"
    
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
        commit-and-push)
            # Check if we're completing a flag
            if [[ "${cur}" == -* ]]; then
                COMPREPLY=($(compgen -W "${commit_push_flags}" -- ${cur}))
            else
                # Complete directory path
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
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
    
    # If previous argument was commit-and-push, and current is a flag,
    # still allow directory completion for the path argument
    if [[ "${COMP_WORDS[1]}" == "commit-and-push" ]]; then
        # Check if previous word was a flag
        if [[ "${prev}" == "--dry-run" || "${prev}" == "--no-push" || "${prev}" == "--help" ]]; then
            COMPREPLY=($(compgen -d -- ${cur}))
            return 0
        fi
    fi
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pareto_completions pareto
