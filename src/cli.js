#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Kenat from 'kenat';
import gradient from 'gradient-string';
import figlet from 'figlet';
import prompts from 'prompts';

const bannerGradient = gradient('cyan', 'pink');
const titleGradient = gradient('yellow', 'green');
const errorGradient = gradient('orange', 'red');

const showBanner = () => {
    return new Promise((resolve, reject) => {
        figlet.text('Kenat - CLI', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true,
        }, (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                reject(err);
                return;
            }
            console.log(bannerGradient(data));
            resolve();
        });
    });
};

const interactiveConvert = async () => {
    const response = await prompts([
        {
            type: 'select',
            name: 'direction',
            message: 'Which conversion would you like to perform?',
            choices: [
                { title: 'Ethiopian to Gregorian', value: 'toGregorian' },
                { title: 'Gregorian to Ethiopian', value: 'toEthiopian' },
            ],
        },
        {
            type: 'text',
            name: 'date',
            message: (prev) => `Enter the date string (e.g., ${prev === 'toGregorian' ? '2016/09/15' : '2024-05-23'})`,
            validate: (value) => /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(value) ? true : 'Please use format YYYY/MM/DD or YYYY-MM-DD'
        }
    ]);

    if (!response.date || !response.direction) {
        console.log(errorGradient('Conversion cancelled.'));
        return;
    }

    try {
        let kenatDate;
        if (response.direction === 'toEthiopian') {
            const gregDate = new Date(response.date);
            kenatDate = new Kenat(gregDate);
        } else {
            kenatDate = new Kenat(response.date);
        }

        if (response.direction === 'toGregorian') {
            const gc = kenatDate.getGregorian();
            console.log(titleGradient('\nConverted Date:'));
            console.log(`  Gregorian: ${gc.year}-${String(gc.month).padStart(2, '0')}-${String(gc.day).padStart(2, '0')}`);
        } else {
            const ec = kenatDate.getEthiopian();
            console.log(titleGradient('\nConverted Date:'));
            console.log(`  Ethiopian: ${ec.year}/${ec.month}/${ec.day}`);
        }
    } catch (error) {
        console.error(errorGradient(`\nError: ${error.message}`));
    }
};


const run = async () => {
    await showBanner();

    yargs(hideBin(process.argv))
        .command(
            'today',
            "Get today's date in the Ethiopian calendar",
            () => { },
            (argv) => {
                const today = new Kenat();
                const enDate = `  ${today.format({ lang: 'english', showWeekday: true })}`;
                const amDate = `  ${today.format({ lang: 'amharic', showWeekday: true, useGeez: true })}`;
                console.log(titleGradient("\nToday's Ethiopian Date:"));
                console.log(enDate);
                console.log(amDate);
            }
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
            async (argv) => {
                if (argv.date) {
                    if (!argv.to) {
                        console.error(errorGradient('Error: Missing required argument: --to'));
                        return;
                    }
                    try {
                        // This part needs the same fix for direct commands
                        let kenatDate;
                        if (argv.to === 'ethiopian') {
                            kenatDate = new Kenat(new Date(argv.date));
                        } else {
                            kenatDate = new Kenat(argv.date);
                        }

                        console.log(titleGradient(`\nConverting "${argv.date}" to ${argv.to}:`));

                        if (argv.to === 'gregorian') {
                            const gc = kenatDate.getGregorian();
                            console.log(`  Gregorian: ${gc.year}-${String(gc.month).padStart(2, '0')}-${String(gc.day).padStart(2, '0')}`);
                        } else {
                            const ec = kenatDate.getEthiopian();
                            console.log(`  Ethiopian: ${ec.year}/${ec.month}/${ec.day}`);
                        }
                    } catch (error) {
                        console.error(errorGradient(`\nError: ${error.message}`));
                    }
                } else {
                    await interactiveConvert();
                }
            }
        )
        .demandCommand(1, 'You need to enter a command.')
        .help()
        .alias('h', 'help')
        .argv;
};

run();