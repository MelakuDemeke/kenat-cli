import prompts from 'prompts';
import { handleTodayCommand } from './commands/today.js';
import { handleConvertCommand } from './commands/convert.js';
import { handleHolidayCommand } from './commands/holiday.js';
import { handleCalendarCommand } from './commands/calendar.js';
import { handleBahireHasabCommand } from './commands/bahirehasab.js';
import { showBanner } from './utils/banner.js';
import gradient from 'gradient-string';

const parseCommand = (input) => {
    const parts = input.trim().split(' ');
    const command = parts[0];
    const argv = { _: [command] };

    for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('--')) {
            const key = parts[i].substring(2);
            argv[key] = parts[i + 1] || true;
        } else if (parts[i].startsWith('-')) {
            const key = parts[i].substring(1);
            argv[key] = parts[i + 1] || true;
        } else {
            if (!parts[i - 1]?.startsWith('-')) {
                if (!argv.date && command === 'convert') argv.date = parts[i];
                if (!argv.year && (command === 'calendar' || command === 'bahirehasab')) argv.year = parts[i];
            }
        }
    }

    return { command, argv };
};

let ctrlc_count = 0;

export const startInteractiveMode = async () => {
    await showBanner();
    console.log(gradient.pastel('Welcome to Kenat Interactive Mode! Type "help" for commands or "exit" to leave.'));

    while (true) {
        ctrlc_count = 0;
        const response = await prompts({
            type: 'text',
            name: 'input',
            message: 'kenat >',
            onState: (state) => {
                if (state.aborted) {
                    ctrlc_count++;
                    if (ctrlc_count >= 2) {
                        process.exit(0);
                    }
                    console.log(gradient.passion('(Ctrl+C again to exit)'));
                }
            }
        });

        if (!response.input) continue;

        const { command, argv } = parseCommand(response.input);

        switch (command) {
            case 'today':
                handleTodayCommand();
                break;
            case 'convert':
                await handleConvertCommand(argv);
                break;
            case 'holiday':
                await handleHolidayCommand(argv);
                break;
            case 'calendar':
                handleCalendarCommand(argv);
                break;
            case 'bahirehasab':
                handleBahireHasabCommand(argv)
                break;
            case 'help':
                console.log('Available commands: today, convert, holiday, calendar, bahirehasab, exit');
                break;
            case 'exit':
                return;
            default:
                console.log(gradient('orange', 'red')(`Unknown command: "${command}"`));
        }
    }
};
