<script>
    import { monthsTitles } from './helpers/configuration';
    export let year;
    export let month;
    const clickPrevious = () => {
        if (month > 0) month-=1;
        else {
            year-=1;
            month=11;
        }
    };

    const clickNext = () => {
        if (month < 11) month+=1;
        else {
            year += 1;
            month = 0;
        }
    };
</script>
<div class="month-picker">
    <button class="previous-button" type="button" on:click={clickPrevious}>
        Previous
    </button>
    { monthsTitles[month] }
    <button class="next-button" type="button" on:click={clickNext}>
        Next
    </button>
</div>
