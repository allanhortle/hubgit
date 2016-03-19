import React from 'react';
import {Router, createMemoryHistory} from 'react-router';
import { Provider } from 'react-redux';

import store from 'hubgit/client/store';
import routes from 'hubgit/client/routes';

var memoryHistory = createMemoryHistory('/');

//
// Render Town
//

import blessed from 'blessed';
import {render} from 'react-blessed';
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  title: 'react-blessed hello world'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

render(<Provider store={store}>
    <Router history={memoryHistory} routes={routes}/>
</Provider>, screen);
