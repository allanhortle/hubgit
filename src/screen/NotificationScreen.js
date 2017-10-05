#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import blessed from 'blessed';
import {Some} from 'fronads'

import {ListTable, Text, Box} from 'blessed';

import {RequestNotifications, GithubError} from '../service/Github';
import Loader from '../Loader';
import {yellow, blue, green, grey} from '../Tag';

export default function NotificationScreen({program, screen}) {
    screen.clear();

    var box = Box({
        left: 'center',
        width: '100%',
        height: '100%',
        tags: true
    });

    // Append our box to the screen.
    screen.append(box);

    Loader.start();
    RequestNotifications({all: true})
        .map((payload) => {
            Loader.stop();

            // console.log(payload);
            const notfications = ListTable({
                top: '0',
                height: '100%',
                width: '100%',
                parent: screen,
                data: [['Date', 'Type', 'Repo', 'Title']].concat(payload.data
                    .map(({unread, subject, updated_at, repository}) => {
                        if(unread) {
                            return [yellow(updated_at), green(subject.type), blue(repository.name), subject.title]
                        }
                        return [grey(updated_at), grey(subject.type), grey(repository.name), subject.title]
                    })),
                // pad: 1,
                invertSelected: true,
                keys: true,
                vi: true,
                tags: true,
                mouse: true,
                focused: true,
                align: 'left',
                style: {
                    header: {
                        fg: 'grey'
                    },
                    cell: {
                        selected: {
                            bg: 'green'
                        }
                    }
                }

            });

            screen.append(notfications);
            screen.render();
            screen.focusPush(notfications);
        })
        .leftMap(GithubError(screen))
        .run();


    screen.render();
}
