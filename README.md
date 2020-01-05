svelte-calender is svelte component that allows the rendering of dynamic calendars

## Installation

```
$ npm install svelte-calendars
```

## Usage

```svelte
<script>
import { Calendar } from 'svelte-calendars';
</script>

<Calendar />
```

## Props

### month (number) && year (number)
Active month and year at which the calendar will first display

### visibleMonths (number)
Amount of months to display in calendar

### displayTitles (bool)
If true will display day titles as defined by config option daysTitles

### displayMonthPicker (bool)
If true will display current month with previous and next buttons

### displayMonthTitle (bool)
Will display the month name over each visible month in calendar

### selectedDay (Date)
Preselected date (will change when user clicks on date)

### onSelect
Callback that will be called on selected date change

## Configuration

Global configuration can be changed by calling the setConfiguration method:
```
import { setConfiguration } from 'sveltejs-form';
setConfiguration({
    daysTitles: ['MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT', 'SUN'],
    firstDay: 1, // set to 0 to start week sunday
    libClassName: 'svelte-calendar',    
    monthTitles: [
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
    ]
});
```
