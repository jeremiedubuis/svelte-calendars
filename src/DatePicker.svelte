<script>
    import { onMount } from 'svelte';
    import Calendar from './Calendar.svelte';
    import { libClassName } from './helpers/configuration';
    export let selectedDay;
    $: ({
        dateToValue = date => date.toLocaleDateString(),
        // calendar props
        selectedDay: _selectedDay,
        visibleMonths = 1,
        displayTitles = false,
        displayMonthPicker = true,
        displayMonthTitle = false,
        displayYearPicker = false,
        month = new Date().getMonth(),
        year= new Date().getFullYear(),
        onSelect = () => {},
        dateClasses = [],
        // html props to spread on input
        ...htmlProps
    } = $$props);


    $: value = selectedDay ? dateToValue(selectedDay) : undefined;
    let displayCalendar = false;

    const onFocus = () => displayCalendar = true;
    const close = () => displayCalendar = false;
    const onDateSelection = (e, date, previousDate) => {
        displayCalendar = false;
        value = dateToValue(date);
        selectedDay = date;
        onSelect(e, date, previousDate);
    };

    onMount(() => {
        value = selectedDay ? dateToValue(selectedDay) : '';
    })

</script>

{#if displayCalendar}
    <div class={`${libClassName}-date-picker`}>
        <button on:click={close}>Close</button>
        <Calendar
                bind:selectedDay
                bind:visibleMonths
                bind:displayTitles
                bind:displayMonthPicker
                bind:displayYearPicker
                month={month}
                year={year}
                onSelect={onDateSelection}
                dateClasses={dateClasses}
        />
    </div>
{/if}

<input bind:value {...htmlProps} on:focus={onFocus} />
