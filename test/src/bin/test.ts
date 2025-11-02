#!/usr/bin/env node
import * as _et from 'exupery-core-types'
import * as _ea from 'exupery-core-alg'

import { run_tests } from "pareto-test/dist/run_tests"

import cluster_state_to_document from "pareto-development-tools/dist/old_lib/cluster_state_to_document";
import { project_cluster_state_to_dot } from "pareto-development-tools/dist/old_lib/project_cluster_state_to_dot";
import { dot_to_svg } from "pareto-development-tools/dist/old_lib/dot_to_svg";
import { cluster_state_to_html } from "pareto-development-tools/dist/old_lib/cluster_state_to_html";
import render_document_to_html from "pareto-development-tools/dist/old_lib/render_html_document";
import * as state_to_analysis_result_module from "pareto-development-tools/dist/transformations/state_to_analysis_result";
import type { Cluster_State, Package_State } from "pareto-development-tools/dist/interface/package_state";
import type { Package_Analysis_Result, Cluster_Analysis_Result } from "pareto-development-tools/dist/interface/analysis_result";
import type { Document } from "pareto-development-tools/dist/interface/html";

run_tests(_ea.dictionary_literal({
    "state_to_dot": {
        'target_extension': 'dot',
        'transformer': (input_content: string, filename: string): string => {
            const cluster_state: Cluster_State = JSON.parse(input_content);
            return project_cluster_state_to_dot(cluster_state, {
                'include_legend': true,
                'cluster_path': filename,
                'show_warnings': false,
                'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING'
            })
        },
    },
    "state_to_html_doc": {
        'target_extension': 'json',
        'transformer': (input_content: string, filename: string): string => {
            const cluster_state: Cluster_State = JSON.parse(input_content);
            const document = cluster_state_to_document(cluster_state, {
                'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
                'cluster path': filename
            });
            return JSON.stringify(document, null, 2);
        },
    },
    "state_to_analysis_result": {
        'target_extension': 'json',
        'transformer': (input_content: string, filename: string): string => {
            const cluster_state = JSON.parse(input_content);

            if (cluster_state[0] === 'cluster') {
                const cluster_data = cluster_state[1];
                const projects: { [key: string]: Package_Analysis_Result } = {};

                for (const [project_name, project_data] of Object.entries(cluster_data.projects)) {
                    if (project_data[0] === 'project') {
                        const package_state = project_data[1] as Package_State;
                        const analysis_result = state_to_analysis_result_module.package_state_to_analysis_result(package_state);
                        projects[project_name] = analysis_result;
                    } else {
                        const not_project_analysis: Package_Analysis_Result = ['leaf', {
                            'outcome': `${project_name}: not a project`,
                            'status': ['warning', null]
                        }];
                        projects[project_name] = not_project_analysis;
                    }
                }

                const cluster_result: Cluster_Analysis_Result = projects;

                return JSON.stringify(cluster_result, null, 2);
            } else {
                const error_result: Cluster_Analysis_Result = {
                    'invalid_cluster': ['leaf', {
                        'outcome': 'not found or invalid',
                        'status': ['issue', null]
                    }]
                };
                return JSON.stringify(error_result, null, 2);
            }
        },
    },
    "dot_to_svg": {
        'target_extension': 'svg',
        'transformer': (input_content: string, filename: string): string => {

            return dot_to_svg(input_content);
        },
    },
    "state_to_html": {
        'target_extension': 'html',
        'transformer': (input_content: string, filename: string): string => {
            const cluster_state: Cluster_State = JSON.parse(input_content);
            return cluster_state_to_html(cluster_state, {
                'time stamp': 'FIXED_TIMESTAMP_FOR_TESTING',
                'cluster path': filename
            });
        },
    },
    "html_doc_to_html": {
        'target_extension': 'html',
        'transformer': (input_content: string, filename: string): string => {
            const document: Document = JSON.parse(input_content);
            return render_document_to_html(document);
        },
    }
}))