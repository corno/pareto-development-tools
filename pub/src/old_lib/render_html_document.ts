import { Document, Div, Span, Table_Section, Table_Row } from "../interface/html"

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function renderSpan(span: Span): string {
    const classAttr = span.classes.length > 0 ? ` class="${span.classes.join(' ')}"` : ''
    const titleAttr = span.title ? ` title="${escapeHtml(span.title)}"` : ''
    
    const childrenHtml = span.children.map(child => {
        const childClassAttr = child.classes.length > 0 ? ` class="${child.classes.join(' ')}"` : ''
        
        if (child.type[0] === 'p') {
            return `<span${childClassAttr}>${escapeHtml(child.type[1].text)}</span>`
        } else if (child.type[0] === 'a') {
            const href = escapeHtml(child.type[1].href)
            const text = escapeHtml(child.type[1].text)
            return `<a${childClassAttr} href="${href}">${text}</a>`
        } else { // 'span'
            return renderSpan(child.type[1])
        }
    }).join('')
    
    return `<span${classAttr}${titleAttr}>${childrenHtml}</span>`
}

function renderDiv(div: Div): string {
    const classAttr = div.classes.length > 0 ? ` class="${div.classes.join(' ')}"` : ''
    
    const childrenHtml = div.children.map(child => {
        if (child.type[0] === 'div') {
            return renderDiv(child.type[1])
        } else if (child.type[0] === 'span') {
            return renderSpan(child.type[1])
        } else if (child.type[0] === 'label') {
            const label = child.type[1]
            const labelClassAttr = label.classes.length > 0 ? ` class="${label.classes.join(' ')}"` : ''
            return `<div${labelClassAttr}><label>${escapeHtml(label.text)}</label>${renderDiv(label.div)}</div>`
        } else { // 'table'
            return renderTable(child.type[1])
        }
    }).join('')
    
    return `<div${classAttr}>${childrenHtml}</div>`
}

function renderTable(table: { classes: string[]; children: Table_Section[] }): string {
    const classAttr = table.classes.length > 0 ? ` class="${table.classes.join(' ')}"` : ''
    
    const header = table.children.filter(s => s.type[0] === 'header')
    const body = table.children.filter(s => s.type[0] === 'body')
    const footer = table.children.filter(s => s.type[0] === 'footer')

    const renderRows = (rows: Table_Row[]) => rows.map(r => {
        if (r.type[0] === 'th') {
            // Header row - render cells as <th> elements
            const cells = r.cells.map(c => {
                const cellClassAttr = c.classes.length > 0 ? ` class="${c.classes.join(' ')}"` : ''
                return `<th${cellClassAttr}>${renderDiv(c.div)}</th>`
            }).join('')
            return `<tr>${cells}</tr>`
        } else {
            // Data row - render cells as <td> elements
            const cells = r.cells.map(c => {
                const cellClassAttr = c.classes.length > 0 ? ` class="${c.classes.join(' ')}"` : ''
                return `<td${cellClassAttr}>${renderDiv(c.div)}</td>`
            }).join('')
            return `<tr>${cells}</tr>`
        }
    }).join('\n')

    const headerHtml = header.map(h => `<thead>\n${renderRows(h.rows)}\n</thead>`).join('\n')
    const bodyHtml = body.map(b => `<tbody>\n${renderRows(b.rows)}\n</tbody>`).join('\n')
    const footerHtml = footer.map(f => `<tfoot>\n${renderRows(f.rows)}\n</tfoot>`).join('\n')

    return `<table${classAttr}>\n${headerHtml}\n${bodyHtml}\n${footerHtml}\n</table>`
}

export function render_document_to_html(doc: Document): string {
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${doc.css}
</style>
</head>
<body>
${renderDiv(doc.root)}
</body>
</html>`
    
    return html
}

export default render_document_to_html
