import blessed from 'blessed';
import contrib from 'blessed-contrib';


export default function pullRequest(screen) {
    var content = blessed.box({
        height: '100%-1',
        width: '100%',
        label: 'Pull Rqquests',
        border: {
            type: "line",
            fg: "cyan"
        }
    });

    screen.append(content);
};
