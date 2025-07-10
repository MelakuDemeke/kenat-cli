import chalk from 'chalk';
import gradient from 'gradient-string';

const titleGradient = gradient('cyan', 'purple');
const commandGradient = gradient('yellow', 'orange');

const helpTopics = {
    today: {
        description: "Displays today's date in both Ethiopian and Gregorian calendars.",
        usage: 'kenat today',
        options: 'This command has no options.',
    },
    convert: {
        description: 'Converts a date between Ethiopian and Gregorian calendars.',
        usage: 'kenat convert [date] --to <calendar>',
        options: [
            '[date]      The date string to convert (e.g., "2016/9/15"). Optional in interactive mode.',
            '--to, -t    [required] The calendar to convert to. Choices: "gregorian", "ethiopian".',
        ].join('\n    '),
    },
    calendar: {
        description: 'Displays a visual calendar for a given month or year.',
        usage: 'kenat calendar [--year YYYY] [--month MM]',
        options: [
            '--year, -y   The Ethiopian year for the calendar. Defaults to the current year.',
            '--month, -m  The Ethiopian month (1-13). If omitted, the whole year is shown.',
        ].join('\n    '),
    },
    holiday: {
        description: 'Lists holidays or provides information about a specific holiday.',
        usage: 'kenat holiday [options]',
        options: [
            '--this-month, -m  List holidays for the current Ethiopian month.',
            '--this-year, -y   List holidays for the current Ethiopian year.',
            '--info, -i        Get details for a specific holiday key (e.g., "meskel").',
            '--filter, -f      Filter by tags. Choices: public, religious, christian, muslim, etc.',
        ].join('\n    '),
    },
    bahirehasab: {
        description: 'Calculates and displays Bahire Hasab for a given Ethiopian year.',
        usage: 'kenat bahirehasab [year]',
        options: '[year]      The Ethiopian year to calculate for. Defaults to the current year.',
    },
    help: {
        description: 'Displays this help message or help for a specific command.',
        usage: 'kenat help [command]',
        options: '[command]   The command you want to learn more about.'
    }
};

const displayGeneralHelp = () => {
    console.log(titleGradient('\nKenat CLI Help'));
    console.log('A tool for working with the Ethiopian calendar.\n');
    console.log(chalk.yellow('Usage:'));
    console.log('  kenat <command> [options]\n');
    console.log(chalk.yellow('Available Commands:'));

    for (const command in helpTopics) {
        console.log(`  ${commandGradient(command.padEnd(15, ' '))} ${helpTopics[command].description}`);
    }

    console.log('\nType "kenat help <command>" for more information on a specific command.');
    console.log('Or just type "kenat" to enter interactive mode.');
};

const displayCommandHelp = (command) => {
    const topic = helpTopics[command];
    if (!topic) {
        console.log(gradient('orange', 'red')(`\nError: Unknown command "${command}".`));
        displayGeneralHelp();
        return;
    }

    console.log(titleGradient(`\nHelp: kenat ${command}`));
    console.log(`- ${topic.description}\n`);
    console.log(chalk.yellow('Usage:'));
    console.log(`  ${topic.usage}\n`);
    console.log(chalk.yellow('Options:'));
    console.log(`    ${topic.options}`);
};

export const handleHelpCommand = (argv) => {
    if (argv.command) {
        displayCommandHelp(argv.command);
    } else {
        displayGeneralHelp();
    }
};
