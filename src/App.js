import React, {Component} from 'react';
import issue from './page/issue';
import pullRequest from './page/pullRequest';
import repositories from './page/repositories';
import activity from './page/activity';
import screen from './screen';

//
function render(page) {
    return () => {
        var i = screen.children.length;
        while (i--) screen.children[i].detach();

        page(screen);
        screen.append(tab);
        screen.render();
    }
}


export default class App extends Component {
  render() {
    const items =  {
        issues: {
            callback: () => console.log(Object.keys(this.refs.tab))
        },
        'pull-requests': {
            // callback: render(pullRequest)
        },
        repositories: {
            // callback: render(repositories)
        },
        activity: {
            // callback: render(activity)
        }
    };
    return <listbar ref="tab" items={items} autoCommandKeys={true}>

    </listbar>;
  }
}
