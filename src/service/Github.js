// @flow
import Github from 'github';
import {TaskPromise, Task} from 'fronads';
import {Text} from 'blessed';

const github = new Github({});

// user token
github.authenticate({
    type: "token",
    token: process.env.GITHUB_TOKEN,
    Promise: Promise
});

export default github;

export function GithubError(screen: Object) {
    return (error: Object) => {
        screen.clear();
        screen.append(Text({
            style: {fg: 'red'},
            content: error.stack
        }));
        screen.render();
    }
}

export function RequestNotifications(props: Object): Task {
    return TaskPromise(() => github.activity.getNotifications(props));
}
