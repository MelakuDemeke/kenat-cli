#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Kenat from 'kenat';
import gradient from 'gradient-string';

// A cool bubblegum-like gradient
const bubblegum = gradient('pink', 'blue');

yargs(hideBin(process.argv))
    .command(
        'today',
        "Get today's date in the Ethiopian calendar",
        () => { },
        (argv) => {
            const today = new Kenat();

            const enDate = `  ${today.format({ lang: 'english', showWeekday: true })}`;
            const amDate = `  ${today.format({ lang: 'amharic', showWeekday: true, useGeez: true })}`;

            console.log(bubblegum("Today's Ethiopian Date:"));
            console.log(enDate);
            console.log(amDate);
        }
    )
    .demandCommand(1, 'You need to enter a command.')
    .help()
    .alias('h', 'help')
    .argv;