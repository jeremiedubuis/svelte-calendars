export let firstDay = 1;
export let daysTitles = ['MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT', 'SUN'];
export let monthsTitles = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export let libClassName = 'svelte-calendar';

export const setConfiguration = (o= {}) => {
    if (o.firstDay) firstDay = o.firstDay;
    if (o.daysTitles) daysTitles = o.daysTitles;
    if (o.monthsTitles) monthsTitles = o.monthsTitles;
    if (o.libClassName) libClassName = o.libClassName;
};
