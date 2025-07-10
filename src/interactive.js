import prompts from 'prompts';
import { handleTodayCommand } from './commands/today.js';
import { handleConvertCommand } from './commands/convert.js';
import { handleHolidayCommand } from './commands/holiday.js';
import { handleCalendarCommand } from './commands/calendar.js';
import { handleBahireHasabCommand } from './commands/bahirehasab.js';
import { handleHelpCommand } from './commands/help.js';
import { showBanner } from './utils/banner.js';
import gradient from 'gradient-string';

const parseCommand = (input) => {
    const parts = input.trim().split(/\s+/);
    const command = parts[0] || '';
    const argv = { _: [...parts] };

    if (command === 'help' && parts.length > 1) {
        argv.command = parts[1];
    }

    if (command === 'convert' && parts.length > 1) {
        argv.date = parts[1];
    }
    if (command === 'bahirehasab' && parts.length > 1) {
        argv.year = parts[1];
    }

    for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith('--')) {
            const key = parts[i].substring(2);
            argv[key] = (parts[i + 1] && !parts[i + 1].startsWith('-')) ? parts[i + 1] : true;
        } else if (parts[i].startsWith('-') && !/^\d+$/.test(parts[i].substring(1))) {
            const key = parts[i].substring(1);
            argv[key] = (parts[i + 1] && !parts[i + 1].startsWith('-')) ? parts[i + 1] : true;
        }
    }

    return { command, argv };
};


export const startInteractiveMode = async () => {
    await showBanner();
    console.log(gradient.pastel('Welcome to Kenat Interactive Mode! Type "help" for commands or "exit" to leave.'));

    const onCancel = () => {
        console.log(gradient.passion('\nExiting Kenat. Goodbye!'));
        process.exit(0);
    };

    while (true) {
        const response = await prompts({
            type: 'text',
            name: 'input',
            message: 'kenat >',
        }, { onCancel });

        if (!response.input) {
            continue;
        }

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
                handleBahireHasabCommand(argv);
                break;
            case 'help':
                handleHelpCommand(argv);
                break;
            case 'exit':
                onCancel(); // Use the same exit function for a clean departure
                return;
            default:
                console.log(gradient('orange', 'red')(`Unknown command: "${command}"`));
        }
    }
};
