<script>
    export let day;
    export let selectedDay;
    export let onSelect;
    export let year;
    export let month;
    const select = (e,day) => {
        selectedDay = new Date(year, month, day);
        onSelect(selectedDay, e);
    };

    const isSelected = (selectedDay) =>
            selectedDay instanceof Date
            && year === selectedDay.getFullYear()
            && month === selectedDay.getMonth()
            && day === selectedDay.getDate();


</script>

<button type="button" class:is-selected={isSelected(selectedDay)}
        on:click={(e) => select(e,day)}>
    {day}
</button>
