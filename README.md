svelte-calender is svelte component that allows the rendering of dynamic calendars

# Installation

```
$ npm install svelte-calendars
```

# Usage

* [Calendar](#Calendar)
* [DatePicker](#DatePicker)
* [Configuration](#Configuration)

## Calendar

```svelte
<script>
import { Calendar } from 'svelte-calendars';
</script>

<Calendar />
```

### Props

#### month (number) && year (number)
Active month and year at which the calendar will first display

#### visibleMonths (number)
Amount of months to display in calendar

#### displayTitles (bool)
If true will display day titles as defined by config option daysTitles

#### displayMonthPicker (bool)
If true will display current month with previous and next buttons

#### displayMonthTitle (bool)
Will display the month name over each visible month in calendar

#### selectedDay (Date)
Preselected date (will change when user clicks on date)

#### onSelect (function)
Callback that will be called on selected date change with two parameters: 
- the selected date object
- the original event

#### dateClasses (array<array<Date,String>>)
The dateClasses prop is an array of arrays that contain a Date and string, if the date in the calendar matches the provided date, the class will be applied

## DatePicker
```svelte
<script>
import { DatePicker } from 'svelte-calendars';
</script>

<DatePicker />
```

### props

The datepicker uses all the props from the calendar component with an extra optional prop

### dateToValue (function)
The function used to translate the selected date to the string in the input field, by default:
```
date => date.toLocaleDateString(),
```

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
