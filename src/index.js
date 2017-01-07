import pkg from '../package.json';
import program from 'commander';
import screen from './screen';
import tab from './tab';

program
    .version(pkg.version)
    // .option('-l, --lurkles <items>', 'A list of config files to merge', val => val.split(','))
    // .option('-d, --dry', 'show commands without running them')

program.parse(process.argv);

// issues
// pr
// repos
// activity

// switch (program.args[0]) {
//     case 'start':
//         Start(program, config);
//         break;

//     default:

//         break;
// }
//
tab(screen);
screen.render();
