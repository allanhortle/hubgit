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

switch (program.args[0]) {

    case 'repository':
    case 'repo':
    case 'repositories':
        tab.selectTab(2)
        break;

    case 'activity':
        tab.selectTab(3);
        break;

    case 'pr':
    case 'pulls':
    case 'pull':
    case 'pullRequest':
    case 'pullRequests':
        tab.selectTab(1)
        break;

    default:
        tab.selectTab(0);
        break;
}
