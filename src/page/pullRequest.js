import blessed from 'blessed';
import contrib from 'blessed-contrib';


export default function pullRequest(screen) {
  var line = contrib.line(
   { width: 80
   , height: 30
   , left: 15
   , top: 12
   , xPadding: 5
   , label: 'Title'
   })

  var data = [ { title: 'us-east',
             x: ['t1', 't2', 't3', 't4'],
             y: [0, 0.0695652173913043, 0.11304347826087, 2],
             style: {
              line: 'red'
             }
           }
        ]

  screen.append(line)
  line.setData(data)

};
