import Kenat from 'kenat';
import prompts from 'prompts';
import gradient from 'gradient-string';

const titleGradient = gradient('yellow', 'green');
const errorGradient = gradient('orange', 'red');

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
            kenatDate = new Kenat(new Date(response.date));
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

export const handleConvertCommand = async (argv) => {
    if (argv.date) {
        if (!argv.to) {
            console.error(errorGradient('Error: Missing required argument: --to'));
            return;
        }
        try {
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
};
