import Kenat, { getHolidaysInMonth, getHolidaysForYear, getHoliday, HolidayTags } from 'kenat';
import prompts from 'prompts';
import gradient from 'gradient-string';
import Table from 'cli-table3';

const titleGradient = gradient(['cyan', 'purple']);
const errorGradient = gradient(['orange', 'red']);

// A helper function to format and display holidays in a table
const displayHolidays = (holidays, title) => {
    if (holidays.length === 0) {
        console.log(gradient('yellow', 'green')(`\nNo holidays found for the specified criteria.`));
        return;
    }

    console.log(titleGradient(`\n${title}`));
    const table = new Table({
        head: ['Date (E.C.)', 'Holiday Name', 'Date (G.C.)'],
        colWidths: [18, 35, 18],
    });

    holidays.forEach(h => {
        const ecDate = `${h.ethiopian.year}/${h.ethiopian.month}/${h.ethiopian.day}`;
        const gc = h.gregorian || new Kenat(ecDate).getGregorian();
        const gcDate = `${gc.year}-${String(gc.month).padStart(2, '0')}-${String(gc.day).padStart(2, '0')}`;
        table.push([ecDate, h.name, gcDate]);
    });

    console.log(table.toString());
};

const interactiveHoliday = async () => {
    const response = await prompts([
        {
            type: 'select',
            name: 'period',
            message: 'What holidays would you like to list?',
            choices: [
                { title: 'Holidays this Month', value: 'month' },
                { title: 'Holidays this Year', value: 'year' },
            ]
        },
        {
            type: 'multiselect',
            name: 'filter',
            message: 'Select holiday types (optional, defaults to Public)',
            choices: [
                { title: 'Public', value: HolidayTags.PUBLIC, selected: true },
                { title: 'Religious (Christian)', value: HolidayTags.CHRISTIAN },
                { title: 'Religious (Muslim)', value: HolidayTags.MUSLIM },
                { title: 'State / Cultural', value: HolidayTags.STATE },
            ],
            hint: '- Space to select. Return to submit'
        }
    ]);

    if (!response.period) {
        console.log(errorGradient('Operation cancelled.'));
        return;
    }

    const today = new Kenat();
    const filter = response.filter.length > 0 ? response.filter : null;

    if (response.period === 'month') {
        const holidays = getHolidaysInMonth(today.ethiopian.year, today.ethiopian.month, { filter });
        displayHolidays(holidays, `Holidays for ${today.format({ lang: 'english' }).split(' ')[0]} ${today.ethiopian.year}`);
    } else {
        const holidays = getHolidaysForYear(today.ethiopian.year, { filter });
        displayHolidays(holidays, `Holidays for ${today.ethiopian.year} E.C.`);
    }
}


export const handleHolidayCommand = async (argv) => {
    const today = new Kenat();
    const filter = argv.filter ? (Array.isArray(argv.filter) ? argv.filter : [argv.filter]) : null;

    if (argv.thisMonth) {
        const holidays = getHolidaysInMonth(today.ethiopian.year, today.ethiopian.month, { filter });
        displayHolidays(holidays, `Holidays for ${today.format({ lang: 'english' }).split(' ')[0]} ${today.ethiopian.year}`);
    } else if (argv.thisYear) {
        const holidays = getHolidaysForYear(today.ethiopian.year, { filter });
        displayHolidays(holidays, `Holidays for ${today.ethiopian.year} E.C.`);
    } else if (argv.info) {
        const holiday = getHoliday(argv.info, today.ethiopian.year);
        if (holiday) {
            displayHolidays([holiday], `Info for "${holiday.name}"`);
            console.log(gradient('yellow', 'orange')(`\nDescription: ${holiday.description}`));
        } else {
            console.log(errorGradient(`Could not find information for holiday key: "${argv.info}"`));
        }
    } else {
        // No flags provided, enter interactive mode
        await interactiveHoliday();
    }
};
