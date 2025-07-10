import Kenat from 'kenat';
import gradient from 'gradient-string';
import chalk from 'chalk';
import Table from 'cli-table3';

const titleGradient = gradient(['cyan', 'purple']);

const displayBahireHasab = (data) => {
    console.log(titleGradient(`\nBahire Hasab for Ethiopian Year ${data.ameteAlem - 5500}`));

    console.log(`\n${chalk.yellow('Core Numbers:')}`);
    console.log(`  - Amete Alem (ዓመተ ዓለም): ${chalk.bold(data.ameteAlem)}`);
    console.log(`  - Wenber (ወንበር): ${chalk.bold(data.wenber)}`);
    console.log(`  - Abektie (አበቅቴ): ${chalk.bold(data.abektie)}`);
    console.log(`  - Metqi (መጥቅዕ): ${chalk.bold(data.metqi)}`);
    console.log(`  - New Year's Day: ${chalk.bold(data.newYear.dayName)}`);

    console.log(`\n${chalk.yellow('Key Dates:')}`);
    console.log(`  - Beale Metqi (በዓለ መጥቅዕ): ${chalk.bold(data.bealeMetqi.date.month)}/${data.bealeMetqi.date.day}`);
    console.log(`  - Nineveh (ጾመ ነነዌ): ${chalk.bold(data.nineveh.month)}/${data.nineveh.day}`);

    console.log(`\n${chalk.yellow('Movable Feasts:')}`);
    const table = new Table({
        head: ['Feast', 'Date (E.C.)'],
        colWidths: [25, 25]
    });

    for (const key in data.movableFeasts) {
        const feast = data.movableFeasts[key];
        table.push([feast.name, `${feast.ethiopian.year}/${feast.ethiopian.month}/${feast.ethiopian.day}`]);
    }
    console.log(table.toString());
};

export const handleBahireHasabCommand = (argv) => {
    const year = argv.year || new Kenat().getEthiopian().year;
    const bh = new Kenat(`${year}/1/1`).getBahireHasab();

    displayBahireHasab(bh);
};
