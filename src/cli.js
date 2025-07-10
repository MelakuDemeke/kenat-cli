#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { HolidayTags } from 'kenat';

// Import our separated logic
import { showBanner } from './utils/banner.js';
import { handleTodayCommand } from './commands/today.js';
import { handleConvertCommand } from './commands/convert.js';
import { handleHolidayCommand } from './commands/holiday.js';

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
                // ... (this command is unchanged)
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
        .command(
            'holiday',
            'Get information about Ethiopian holidays',
            (yargs) => {
                return yargs
                    .option('this-month', {
                        alias: 'm',
                        type: 'boolean',
                        description: 'List holidays for the current Ethiopian month'
                    })
                    .option('this-year', {
                        alias: 'y',
                        type: 'boolean',
                        description: 'List all holidays for the current Ethiopian year'
                    })
                    .option('info', {
                        alias: 'i',
                        type: 'string',
                        description: 'Get details for a specific holiday by its key (e.g., "meskel")'
                    })
                    .option('filter', {
                        alias: 'f',
                        type: 'array',
                        description: 'Filter holidays by tag',
                        choices: Object.values(HolidayTags),
                        default: HolidayTags.PUBLIC
                    })
            },
            handleHolidayCommand
        )
        .demandCommand(1, 'You need to enter a command.')
        .help()
        .alias('h', 'help')
        .argv;
};

run();
