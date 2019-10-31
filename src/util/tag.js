// @flow
import parseISO from 'date-fns/fp/parseISO';
import format from 'date-fns/fp/format';
import pipe from 'unmutable/pipe';

const colors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white'
].reduce((rr, color) => {
    rr[color] = (content: string) => `{${color}-fg}${content}{/${color}-fg}`;
    rr[`${color}Bg`] = (content: string) => `{${color}-bg}${content}{/${color}-bg}`;
    return rr;
}, {});

export const {
    black,
    blackBg,
    red,
    redBg,
    green,
    greenBg,
    yellow,
    yellowBg,
    blue,
    blueBg,
    magenta,
    magentaBg,
    cyan,
    cyanBg,
    white,
    whiteBg
} = colors;
export const grey= (content: string) => `{#666-fg}${content}{/}`;

export const center = (text: string) => `{center}${text}{/center}`;
export const left = (text: string) => `{left}${text}{/left}`;
export const right = (text: string) => `{right}${text}{/right}`;
export const split = (a: string, b: string) => a + '{|}' + b;
export const title = (text: string) => center(whiteBg(black(text)));

export const date = (str: string) => {
    try {
        return pipe(parseISO, format('yyyy-MM-dd HH:mm'), blue)(str);
    } catch (e) {
        return blue('Unknown Date');
    }
};

export function state(val: string) {
    switch(val) {
        case 'MERGED':
            return magenta(val);
        case 'CLOSED':
            return red(val);
        case 'OPEN':
            return green(val);
        default:
            return val;
    }
}

export function changes(props: {additions: number, deletions: number}): string {
    return `${green('+' + props.additions)} ${red('-' + props.deletions)}`;
}
