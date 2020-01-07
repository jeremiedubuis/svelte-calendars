<script>
    export let day;
    export let selectedDay;
    export let onSelect;
    export let year;
    export let month;
    const select = (day) => {
        selectedDay = new Date(year, month, day);
        onSelect(selectedDay);
    };

    const isSelected = (selectedDay) =>
            selectedDay instanceof Date
            && year === selectedDay.getFullYear()
            && month === selectedDay.getMonth()
            && day === selectedDay.getDate();


</script>

<button class:is-selected={isSelected(selectedDay)}
        on:click={() => select(day)}>
    {day}
</button>
