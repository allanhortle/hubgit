import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default function(screen) {
    var grid = new contrib.grid({rows: 4, cols: 4, screen: screen})

    var line = grid.set(1, 0, 2, 2, contrib.line,
      { style:
        { line: "yellow"
        , text: "green"
        , baseline: "black"}
      , xLabelPadding: 3
      , xPadding: 5
      , label: 'Stocks'})

    var map = grid.set(1, 2, 2, 2, contrib.map, {label: 'Servers Location'})

    var box = blessed.box({content: 'click right-left arrows or wait 3 seconds for the next layout in the carousel', top: '80%', left: '10%'})
    screen.append(box);

    var lineData = {
       x: ['t1', 't2', 't3', 't4'],
       y: [5, 1, 7, 5]
    }

   line.setData([lineData])
}
