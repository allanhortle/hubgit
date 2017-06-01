import chalk from 'chalk';
import Loader from './Loader';

export default function(err) {
    Loader.stop();
    console.log(chalk.red('Error:\n'), err);
};
