// @flow
import parseISO from 'date-fns/fp/parseISO';
import format from 'date-fns/fp/format';
import pipe from 'unmutable/pipe';
import blessed from 'blessed';

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
    rr[`${color}Bg`] = (content: string, escape?: boolean) => `{${color}-bg}${escape ? blessed.escape(content) : content}{/${color}-bg}`;
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
export const grey = (content: string) => `{#666-fg}${content}{/}`;

export const center = (text: string) => `{center}${text}{/center}`;
export const left = (text: string) => `{left}${text}{/left}`;
export const right = (text: string) => `{right}${text}{/right}`;
export const split = (a: string, b: string) => a + '{|}' + b;
export const title = (text: string) => center(whiteBg(black(text)));


export const bold = (a: string) => `{bold}${a}{/}`;
export const italic = bold;
export const underline = (a: string) => `{underline}${a}{/}`;
export const blink = (a: string) => `{underline}${a}{/}`;
export const inverse = (a: string) => `{underline}${a}{/}`;
export const invisible = (a: string) => `{underline}${a}{/}`;
//""

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

type DiffProps = {
    highlightLine?: number,
    window?: [number, numer]
};
export function diff(text: string, props?: DiffProps = {}): string {
    let textArray = text
        .replace(/^(@@.*)/gm, magenta('$1'))
        .split('\n');

    if(props.window) {
        let [lower, upper] = props.window;
        textArray = textArray.slice(lower).slice(upper);
    }

    return textArray
        .map((line, index) => {
            if(index === props.highlightLine) return line;
            if(/^[+](?![+])/.test(line)) return green(line, true);
            if(/^[-](?![-])/.test(line)) return red(line, true);
            return line;
        })
        .join('\n');
}

export function ellipsis(string: string, limit: number): string {
    return string.length > limit - 3
        ? `${string.slice(0, limit)}...`
        : string
    ;
}

export function label({name, color}: {name: string, color: string}): string {
    return `{#${color}-fg}${name}{/}`;
}
