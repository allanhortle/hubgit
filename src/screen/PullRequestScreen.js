#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import blessed from 'blessed';

// import Request from './Request';
// import Loader from './Loader';


export default function PullRequestScreen({program, screen}) {
    screen.clear();

    var box = blessed.box({
      top: 'center',
      left: 'center',
      width: '50%',
      height: '50%',
      content: 'PullRequestScreen',
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'magenta',
        border: {
          fg: '#f0f0f0'
        },
        hover: {
          bg: 'green'
        }
      }
    });

    // Append our box to the screen.
    screen.append(box);


    screen.render();
}
