#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { showBanner } from './utils/banner.js';
import { handleTodayCommand } from './commands/today.js';
import { handleConvertCommand } from './commands/convert.js';

const run = async () => {
    await showBanner();

    yargs(hideBin(process.argv))
        .command(
            'today',
            "Get today's date in the Ethiopian calendar",
            () => { },
            handleTodayCommand
        )
        .command(
            'convert [date]',
            'Convert a date between Ethiopian and Gregorian calendars',
            (yargs) => {
                return yargs
                    .positional('date', {
                        describe: 'Date string to convert (e.g., "2016/9/15" or "2024-05-23")',
                        type: 'string',
                    })
                    .option('to', {
                        alias: 't',
                        describe: 'The calendar to convert to',
                        choices: ['gregorian', 'ethiopian'],
                    });
            },
            handleConvertCommand
        )
        .demandCommand(1, 'You need to enter a command.')
        .help()
        .alias('h', 'help')
        .argv;
};

run();
