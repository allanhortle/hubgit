import {Listbar} from 'blessed';
import issue from './page/issue';
import pullRequest from './page/pullRequest';
import repositories from './page/repositories';
import activity from './page/activity';
import screen from './screen';


function render(page) {
    return () => {
        var i = screen.children.length;
        while (i--) screen.children[i].detach();

        page(screen);
        screen.append(tab);
        screen.render();
    }
}

const tab = Listbar({
    bottom: 0,
    width: '100%',
    height: 1,
    autoCommandKeys: true,
    style: {
        bg: 'black',
        item: {
            bg: 'black',
        },
        selected: {
            bg: 'black',
            fg: 'green',
        }
    },
    items: {
        issues: {
            callback: render(issue)
        },
        'pull-requests': {
            callback: render(pullRequest)
        },
        repositories: {
            callback: render(repositories)
        },
        activity: {
            callback: render(activity)
        }
    }
});


export default tab;
