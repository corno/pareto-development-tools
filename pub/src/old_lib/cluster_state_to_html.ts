import * as d_in from "../interface/package_state"
import cluster_state_to_document from "./cluster_state_to_document"
import render_document_to_html from "./render_html_document"

/**
 * Convert Cluster_State to HTML by first transforming to the intermediate
 * Document format and then rendering that Document to HTML.
 */
export function cluster_state_to_html(
    cluster_state: d_in.Cluster_State,
    options: {
        'time stamp': string
    }
): string {
    const doc = cluster_state_to_document(cluster_state, options)
    return render_document_to_html(doc)
}
