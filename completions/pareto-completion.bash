#!/bin/bash
# Bash completion script for pdt CLI
#
# To enable, add this to your ~/.bashrc:
#   source /path/to/tools/completion/pareto-completion.bash

_pdt_completions() {
    local cur="${COMP_WORDS[COMP_CWORD]}"
    local prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # List of currently available commands (updated from text.ts)
    local commands="all package project set-up-comparison"
    
    # All packages sub-commands
    local all_subcommands="assert-no-open-changes build-and-validate build commit-changes list-file-structure-problems set-up-comparison update-dependencies"
    
    # Package sub-commands
    local package_subcommands="assert-no-open-changes build-and-validate commit-changes list-file-structure-problems publish update-dependencies"
    
    # Project sub-commands
    local project_subcommands="analyze-file-structure dependency-graph"
    
    # Publish generation options
    local publish_generations="patch minor"
    
    # If completing first argument after 'pdt'
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=($(compgen -W "${commands}" -- ${cur}))
        return 0
    fi
    
    # Command-specific completions
    case "${COMP_WORDS[1]}" in
        all)
            if [ "$COMP_CWORD" -eq 2 ]; then
                # Complete project path
                COMPREPLY=($(compgen -d -- ${cur}))
            elif [ "$COMP_CWORD" -eq 3 ]; then
                # Complete all sub-command
                COMPREPLY=($(compgen -W "${all_subcommands}" -- ${cur}))
            elif [ "$COMP_CWORD" -eq 4 ] && [ "${COMP_WORDS[3]}" == "commit-changes" ]; then
                # For commit-changes, expect a commit message (no completion)
                COMPREPLY=()
            elif [ "$COMP_CWORD" -eq 4 ] && [ "${COMP_WORDS[3]}" == "build-and-validate" ]; then
                # Optional 'concise' flag for build-and-validate
                COMPREPLY=($(compgen -W "concise" -- ${cur}))
            fi
            return 0
            ;;
        package)
            if [ "$COMP_CWORD" -eq 2 ]; then
                # Complete package path
                COMPREPLY=($(compgen -d -- ${cur}))
            elif [ "$COMP_CWORD" -eq 3 ]; then
                # Complete package sub-command
                COMPREPLY=($(compgen -W "${package_subcommands}" -- ${cur}))
            elif [ "$COMP_CWORD" -eq 4 ] && [ "${COMP_WORDS[3]}" == "publish" ]; then
                # Complete generation type for publish
                COMPREPLY=($(compgen -W "${publish_generations}" -- ${cur}))
            elif [ "$COMP_CWORD" -eq 5 ] && [ "${COMP_WORDS[3]}" == "publish" ]; then
                # For --dry-run flag
                COMPREPLY=($(compgen -W "--dry-run" -- ${cur}))
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
            fi
            return 0
            ;;
        dependency-graph)
            # This command takes a project path
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
            return 0
            ;;
        assert-no-open-changes|build-and-validate)
            # These commands take a project path
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
            elif [ "$COMP_CWORD" -eq 3 ] && [ "${COMP_WORDS[1]}" == "build-and-validate" ]; then
                # Optional 'concise' flag for build-and-validate
                COMPREPLY=($(compgen -W "concise" -- ${cur}))
            fi
            return 0
            ;;

        set-up-comparison)
            # This command takes a package path
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=($(compgen -d -- ${cur}))
            fi
            return 0
            ;;
    esac
    
    # Default to no completion
    COMPREPLY=()
}

complete -F _pdt_completions pdt
