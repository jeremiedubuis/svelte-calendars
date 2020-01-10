<script>
    export let year;
    const clickPrevious = () => year-=1;

    const clickNext = () => year+=1;
</script>
<div class="year-picker">
    <button class="previous-button" type="button" on:click={clickPrevious}>
        Previous
    </button>
    { year }
    <button class="next-button" type="button" on:click={clickNext}>
        Next
    </button>
</div>
