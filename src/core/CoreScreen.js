// @flow
import blessed from 'blessed';

const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    dockBorders: true,
    debug: true,
    title: 'react-blessed hello world'
});

screen.debugLog.width = '100%';
screen.debugLog.height = '100%';
screen.debugLog.top = 0;
screen.debugLog.left = 0;

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

global.log = (...val) => screen.debug(...val);


export default screen;
