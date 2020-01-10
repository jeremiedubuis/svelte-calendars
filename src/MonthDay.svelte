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


</script>

<button type="button" on:click={(e) => select(e,day)}>
    {day}
</button>
