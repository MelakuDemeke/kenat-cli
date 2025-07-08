#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Kenat from 'kenat';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { promisify } from 'util';

// Promisify figlet to use it with async/await
const figletPromise = promisify(figlet.text);

// A new gradient for our banner
const bannerGradient = gradient('cyan', 'pink');

/**
 * Creates and displays the CLI banner.
 */
const showBanner = async () => {
    try {
        const banner = await figletPromise('Kenat - CLI', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true,
        });
        console.log(bannerGradient(banner));
    } catch (err) {
        console.error('Failed to generate banner:', err);
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
                const titleGradient = gradient('yellow', 'green');

                const enDate = `  ${today.format({ lang: 'english', showWeekday: true })}`;
                const amDate = `  ${today.format({ lang: 'amharic', showWeekday: true, useGeez: true })}`;

                console.log(titleGradient("\nToday's Ethiopian Date:"));
                console.log(enDate);
                console.log(amDate);
            }
        )
        .demandCommand(1, 'You need to enter a command.')
        .help()
        .alias('h', 'help')
        .argv;
};

// Run the main function
run();