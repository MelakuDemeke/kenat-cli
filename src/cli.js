#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Kenat from 'kenat';
import gradient from 'gradient-string';
import figlet from 'figlet';

const bannerGradient = gradient('cyan', 'pink');

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

run();