import gradient from 'gradient-string';
import figlet from 'figlet';

const bannerGradient = gradient('cyan', 'pink');

export const showBanner = () => {
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
