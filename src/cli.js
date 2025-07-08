#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Kenat from 'kenat';

yargs(hideBin(process.argv))
    .command(
        'today',
        "Get today's date in the Ethiopian calendar",
        () => { },
        (argv) => {
            const today = new Kenat();
            console.log("Today's Ethiopian Date:");
            console.log(`  ${today.format({ lang: 'english', showWeekday: true })}`);
            console.log(`  ${today.format({ lang: 'amharic', showWeekday: true, useGeez: true })}`);
        }
    )
    .demandCommand(1, 'You need to enter a command.')
    .help()
    .alias('h', 'help')
    .argv;