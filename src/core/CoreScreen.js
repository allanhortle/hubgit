// @flow
import blessed from 'neo-blessed';

const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'react-blessed hello world'
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

export default screen;
