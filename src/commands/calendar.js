// src/commands/calendar.js

import Kenat, { MonthGrid } from 'kenat';
import gradient from 'gradient-string';
import chalk from 'chalk';

const titleGradient = gradient('cyan', 'purple');

const displayMonth = (year, month) => {
    const grid = MonthGrid.create({ year, month, holidayFilter: ['public'] });
    console.log(titleGradient(`\n       ${grid.monthName} ${grid.year}`));

    console.log(chalk.yellow(grid.headers.join('  ')));

    let weekStr = '';
    grid.days.forEach((day, index) => {
        let dayStr;
        if (day) {
            dayStr = String(day.ethiopian.day).padStart(2, ' ');
            if (day.isToday) {
                dayStr = chalk.bold.inverse.yellow(dayStr);
            } else if (day.holidays.length > 0) {
                dayStr = chalk.bold.cyan(dayStr);
            }
        } else {
            dayStr = '  ';
        }

        weekStr += dayStr + '  ';

        if ((index + 1) % 7 === 0) {
            console.log(weekStr);
            weekStr = '';
        }
    });
    if (weekStr) {
        console.log(weekStr);
    }
};

const displayYear = (year) => {
    console.log(titleGradient(`\n                             ${year} E.C.`));

    const monthsData = [];
    for (let i = 1; i <= 13; i++) {
        monthsData.push(MonthGrid.create({ year, month: i, weekStart: 0, holidayFilter: ['public'] }));
    }

    const monthsPerRow = 3;
    for (let i = 0; i < monthsData.length; i += monthsPerRow) {
        const rowMonths = monthsData.slice(i, i + monthsPerRow);

        // Print month headers
        let monthHeaders = '';
        rowMonths.forEach(m => {
            const monthName = m.monthName;
            const padding = Math.floor((20 - monthName.length) / 2);
            monthHeaders += ' '.repeat(padding) + monthName + ' '.repeat(20 - monthName.length - padding) + '  ';
        });
        console.log(chalk.bold.blue(`\n${monthHeaders}`));

        const weekdayHeader = 'Su Mo Tu We Th Fr Sa';
        let weekDayHeaders = '';
        rowMonths.forEach(() => {
            weekDayHeaders += weekdayHeader + '  ';
        });
        console.log(chalk.yellow(weekDayHeaders));

        const maxWeeks = Math.max(...rowMonths.map(m => Math.ceil(m.days.length / 7)));
        for (let weekIndex = 0; weekIndex < maxWeeks; weekIndex++) {
            let weekLine = '';
            rowMonths.forEach(month => {
                let weekStr = '';
                for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                    const day = month.days[weekIndex * 7 + dayIndex];
                    if (day) {
                        let dayNum = String(day.ethiopian.day).padStart(2, ' ');
                        if (day.isToday) {
                            dayNum = chalk.bold.inverse.yellow(dayNum);
                        } else if (day.holidays.length > 0) {
                            dayNum = chalk.bold.cyan(dayNum);
                        }
                        weekStr += dayNum + ' ';
                    } else {
                        weekStr += '   ';
                    }
                }
                weekLine += weekStr.padEnd(23, ' ');
            });
            console.log(weekLine);
        }
    }
};

export const handleCalendarCommand = (argv) => {
    if (argv.year && !argv.month) {
        displayYear(argv.year);
    } else {
        const today = new Kenat();
        const year = argv.year || today.ethiopian.year;
        const month = argv.month || today.ethiopian.month;
        displayMonth(year, month);
    }
};