#!/bin/bash
# Bash completion script for pdt CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pdt_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of currently available commands
    local commands="analyze-file-structure assert-clean dependency-graph list-file-structure-problems project publish set-up-comparison"
    
    # Project sub-commands
    local project_subcommands="assert-clean build-and-test build git-commit git-remove-tracked-but-ignored set-up-comparison update-dependencies"
    
    # Publish generation options
    local publish_generations="patch minor"
    
    # If completing first argument after 'pdt'
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
        return 0
    fi
    
    # Command-specific completions
    case "${COMP_WORDS[1]}" in
        analyze-file-structure|dependency-graph|list-file-structure-problems)
            # These commands take a project path
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
            return 0
            ;;
        assert-clean|set-up-comparison)
            # These commands take an optional package path
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
            return 0
            ;;
        project)
            if [ "$COMP_CWORD" -eq 2 ]; then
                # Complete project path
                COMPREPLY=($(compgen -d -- ${cur}))
            elif [ "$COMP_CWORD" -eq 3 ]; then
                # Complete project sub-command
                COMPREPLY=($(compgen -W "${project_subcommands}" -- ${cur}))
            elif [ "$COMP_CWORD" -eq 4 ] && [ "${COMP_WORDS[3]}" == "git-commit" ]; then
                # For git-commit, expect a commit message (no completion)
                COMPREPLY=()
            fi
            return 0
            ;;
        publish)
            if [ "$COMP_CWORD" -eq 2 ]; then
                # Complete package path
                COMPREPLY=($(compgen -d -- ${cur}))
            elif [ "$COMP_CWORD" -eq 3 ]; then
                # Complete generation type
                COMPREPLY=($(compgen -W "${publish_generations}" -- ${cur}))
            elif [ "$COMP_CWORD" -eq 4 ]; then
                # For one time password, no completion
                COMPREPLY=()
            fi
            return 0
            ;;
    esac
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pdt_completions pdt
