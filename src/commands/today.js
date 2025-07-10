import Kenat from 'kenat';
import gradient from 'gradient-string';

const titleGradient = gradient(['yellow', 'green']);

export const handleTodayCommand = () => {
    const today = new Kenat();
    const enDate = `  ${today.format({ lang: 'english', showWeekday: true })}`;
    const amDate = `  ${today.format({ lang: 'amharic', showWeekday: true, useGeez: true })}`;

    console.log(titleGradient("\nToday's Ethiopian Date:"));
    console.log(enDate);
    console.log(amDate);
};
