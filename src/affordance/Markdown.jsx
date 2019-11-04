// @flow
import React  from 'react';
import * as t from '../util/tag';

class Slimdown {

    rules: Array<{
        regex: RegExp,
        replacement: string
    }>
    constructor() {
        // Rules
    }

    render(text) {
    }
}

type Props = {
    markdown: string
};
let rules = [
    {regex: /```[\s\S]*?```/mg, replacement: t.magenta},                                         // headers
    {regex: /<code>[\s\S]*?<\/code>/mg, replacement: t.magenta},                                         // headers
    {regex: /^(#+)(.*)/mg, replacement: t.yellow('$1 $2')},                                         // headers
    //{regex: /!\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>'}, // image
    //{regex: /\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<a href=\'$2\'>$1</a>'},        // hyperlink
    {regex: /(\*\*|__)(.*?)\1/g, replacement: t.bold('$2')},                           // bold
    {regex: /(\*|_)(.*?)\1/g, replacement: t.italic('_$2_')},                          // emphasis
    {regex: /\~\~(.*?)\~\~/g, replacement: t.red},                           // del
    {regex: /`(.*?)`/g, replacement: t.magenta},                               // inline code
    {regex: /\n\*(.*)/g, replacement: t.green},                                         // ul lists
    {regex: /\n([0-9]+\..*)/g, replacement: t.green},                                   // ol lists
    {regex: /\n(&gt;|\>)(.*)/g, replacement: t.blue},                              // blockquotes
    //{regex: /\n-{5,}/g, replacement: '\n<hr />'},                                      // horizontal rule
    //{regex: /\n([^\n]+)\n/g, replacement: para},                                       // add paragraphs
    //{regex: /<\/ul>\s?<ul>/g, replacement: ''},                                        // fix extra ul
    //{regex: /<\/ol>\s?<ol>/g, replacement: ''},                                        // fix extra ol
    //{regex: /<\/blockquote><blockquote>/g, replacement: '\n'}                          // fix extra blockquote
];


////////////

//function para(text, line) {
    //const trimmed = line.trim();
    //if (/^<\/?(ul|ol|li|h|p|bl)/i.test(trimmed)) {
        //return `\n${line}\n`;
    //}
    //return `\n${trimmed}\n`;
//}

function ulList(text, item) {
    return `\n<ul>\n\t<li>${item.trim()}</li>\n</ul>`;
}

function olList(text, item) {
    return t.green(`\n${item.trim()}`);
}

function blockquote(text, tmp, item) {
    return t.blue(`\n> ${item.trim()}`);
}

function header(text, chars, content) {
    return t.yellow(`${chars} ${content.trim()}`);
}

export default function Markdown({markdown}: Props) {
    markdown = `\n${markdown}\n`;
    rules.forEach(({regex, replacement}) => {
        markdown = markdown.replace(regex, replacement);
    });
    markdown.trim();
    return <box tags scrollable keys mouse vi focused content={markdown} />;
}

