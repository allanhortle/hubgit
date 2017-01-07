import {Listbar} from 'blessed';
import issue from './page/issue';
import pullRequest from './page/pullRequest';
import repositories from './page/repositories';
import activity from './page/activity';
import screen from './screen';

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
            callback: renderIssue
        },
        'pull-requests': {
            callback: renderPullRequest
        },
        repositories: {
            callback: renderRepositories
        },
        activity: {
            callback: renderActivity
        }
    }
});

function clearScreen() {
    var i = screen.children.length;
    while (i--) screen.children[i].detach();
}

function renderIssue() {
    clearScreen();
    issue(screen);
    screen.append(tab);
    screen.render();
};

function renderPullRequest() {
    clearScreen();
    pullRequest(screen);
    screen.append(tab);
    screen.render();
}

function renderRepositories() {
    clearScreen();
    repositories(screen);
    screen.append(tab);
    screen.render();
}

function renderActivity() {
    clearScreen();
    activity(screen);
    screen.append(tab);
    screen.render();
}

export default function(screen) {
    screen.append(tab);
}
