import blessed from 'blessed';



const screen = blessed.screen();

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

export default screen;
