import ora from 'ora';

export function tag(type) {
    return (color) => (string) => `{${color}-${type}}${string}{/}`;
}

export const fg = tag('fg');
export const bg = tag('bg');

export const yellow = fg('yellow');
export const blue = fg('blue');
export const green = fg('green');
export const grey = fg('grey');
