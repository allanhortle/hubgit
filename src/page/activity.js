import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default function(screen) {

    var box = blessed.box({
        content: 'Activity',
        top: '80%',
        left: '10%'
    })
    screen.append(box);

}
