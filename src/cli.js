#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { HolidayTags } from 'kenat';

// Import all our command handlers and utilities
import { handleTodayCommand } from './commands/today.js';
import { handleConvertCommand } from './commands/convert.js';
import { handleHolidayCommand } from './commands/holiday.js';
import { handleCalendarCommand } from './commands/calendar.js';
import { handleBahireHasabCommand } from './commands/bahirehasab.js';
import { startInteractiveMode } from './interactive.js';

const main = () => {
    const args = hideBin(process.argv);

    if (args.length === 0) {
        startInteractiveMode();
    } else {
        yargs(args)
            .command({
                command: 'today',
                describe: "Get today's date in the Ethiopian calendar",
                handler: handleTodayCommand,
            })
            .command({
                command: 'convert [date]',
                describe: 'Convert a date between Ethiopian and Gregorian calendars',
                builder: (yargs) => yargs
                    .positional('date', {
                        describe: 'Date string to convert (e.g., "2016/9/15")',
                        type: 'string',
                    })
                    .option('to', {
                        alias: 't',
                        describe: 'The calendar to convert to',
                        choices: ['gregorian', 'ethiopian'],
                    }),
                handler: handleConvertCommand,
            })
            .command({
                command: 'holiday',
                describe: 'Get information about Ethiopian holidays',
                builder: (yargs) => yargs
                    .option('this-month', { alias: 'm', type: 'boolean', description: 'List holidays for the current Ethiopian month' })
                    .option('this-year', { alias: 'y', type: 'boolean', description: 'List all holidays for the current Ethiopian year' })
                    .option('info', { alias: 'i', type: 'string', description: 'Get details for a specific holiday by its key (e.g., "meskel")' })
                    .option('filter', { alias: 'f', type: 'array', description: 'Filter holidays by tag', choices: Object.values(HolidayTags), default: HolidayTags.PUBLIC }),
                handler: handleHolidayCommand,
            })
            .command({
                command: 'calendar',
                describe: 'Display a visual calendar for a month or year',
                builder: (yargs) => yargs
                    .option('year', { alias: 'y', type: 'number', description: 'The Ethiopian year for the calendar' })
                    .option('month', { alias: 'm', type: 'number', description: 'The Ethiopian month for the calendar (1-13)' }),
                handler: handleCalendarCommand,
            })
            .command({
                command: 'bahirehasab [year]',
                describe: 'Calculates and displays Bahire Hasab for a given Ethiopian year',
                builder: (yargs) => yargs
                    .positional('year', {
                        describe: 'The Ethiopian year to calculate for (defaults to current year)',
                        type: 'number',
                    }),
                handler: handleBahireHasabCommand,
            })
            .demandCommand(1, 'A command is required to run in non-interactive mode. Type "kenat" to enter interactive mode.')
            .help()
            .alias('h', 'help')
            .parse();
    }
};

main();