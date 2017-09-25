#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import blessed from 'blessed';

// import Request from './Request';
// import Loader from './Loader';

export default function NotificationScreen({program, screen}) {
    screen.realloc();

    var box = blessed.box({
      top: 'center',
      left: 'center',
      width: '100%',
      height: '100%',
      label: 'Notifications',
      tags: true,
      border: {
        type: 'line'
      }
    });

    // Append our box to the screen.
    screen.append(box);


    screen.render();
}
