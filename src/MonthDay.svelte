<script>
    export let day;
    export let selectedDay = undefined;
    export let onSelect;
    export let year;
    export let month;

    const select = (e,day) => {
        const _previousDay = selectedDay ? new Date(selectedDay.getTime()) : null;
        selectedDay = new Date(year, month, day);
        onSelect(e, selectedDay, _previousDay);
    };


</script>

<button type="button" on:click={(e) => select(e,day)}>
    {day}
</button>
