// @flow
import React  from 'react';
import {green, blue, magenta, underline, bold, yellow, link} from '../util/tag';
import remark from 'remark';
import {pipe} from 'unfunctional';
import visit from 'unist-util-visit';
import toString from 'mdast-util-to-string';

type Props = {
    markdown: string
};

const visitNode = (tree, type, fn) => {
    visit(tree, type, (node) => {
        node.type = 'text';
        node.value = fn(node);
        node.children = undefined;
        return node;
    });
}

export default function Markdown({markdown}: Props) {
    const processor = remark()
        .data('settings', {gfm: true})
    const tree = processor.parse(markdown);

    visitNode(tree, 'heading', ({depth, children}) => yellow(`${'#'.repeat(depth)} ${children[0].value}`));
    visitNode(tree, 'blockquote', node => blue(`> ${toString(node)}`));

    visitNode(tree, 'list', node => {
        const {children, ordered, start} = node;
        return children
            .map((ii, index) => {
                const {checked} = ii;
                const prefix = yellow(ordered ? `${index + start}.` : '*');
                const check = (checked == null) ? '' : checked ? '[x] ' : '[ ] ';
                return `${prefix} ${check}${toString(ii)}`
            })
            .join('\n');
    });

    visitNode(tree, 'emphasis', pipe(toString, bold));
    visitNode(tree, 'strong', pipe(toString, bold));
    visitNode(tree, 'inlineCode', ({value}) => magenta('`' + value + '`'));
    visitNode(tree, 'code', pipe(toString, x => '```\n' + x + '\n```', magenta));
    visitNode(tree, 'definition', ({label, url}) => `[${green(label)}]: ${link(url)}`);
    visitNode(tree, 'link', (node) => {
        const text = toString(node);
        const title = node.title ? ` "${green(node.title)}"` : '';
        return `[${green(text)}](${link(node.url)}${title})`;
    })

    let content = processor.stringify(tree);
    content = content.replace(/\\([[`*])/g, '$1'); //`
    content = content.replace(/&#x3A;/g, ':');
    content = content.replace(/(@\S*)/g, yellow('$1'));

    return <box tags scrollable keys mouse vi focused content={content} />;
}

