<script>
    import { libClassName } from './helpers/configuration';
    import Month from "./Month.svelte";
    import MonthPicker from "./MonthPicker.svelte";
    import YearPicker from "./YearPicker.svelte";

    export let month = new Date().getMonth();
    export let year = new Date().getFullYear();
    export let visibleMonths = 1;
    export let displayTitles = true;
    export let displayYearPicker = false;
    export let displayMonthPicker = true;
    export let displayMonthTitle = false;
    export let selectedDay = undefined;
    export let onSelect = () => {};
    export let dateClasses = [];

</script>
<style>
</style>

<div class={libClassName}>
    {#if displayMonthPicker}
        <MonthPicker bind:month bind:year />
    {/if}
    {#if displayYearPicker}
        <YearPicker bind:year />
    {/if}
    <ul class="{libClassName}-months">
    {#each Array(visibleMonths) as _, i}
        <li class="{libClassName}-month">
            <Month
                bind:selectedDay
                onSelect={onSelect}
                year={month + i > 11 ? year+1 : year}
                month={month+i > 11 ? month+i-11 : month+i}
                dateClasses={dateClasses}
                displayTitles={displayTitles}
                displayMonthTitle={displayMonthTitle} />
        </li>
    {/each}
    </ul>
</div>
