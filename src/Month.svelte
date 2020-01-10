<script>
    import { daysTitles, firstDay , monthsTitles} from './helpers/configuration';
    import MonthDay from './MonthDay.svelte';
    export let year;
    export let month;
    export let displayTitles;
    export let displayMonthTitle;
    export let selectedDay = undefined;
    export let onSelect;
    export let dateClasses;

    $: numberOfDays = new Date(month+1 > 11 ? year + 1 : year, month+1 > 11  ? month+1 : 0, 0).getDate()
    $: offset = new Date(year, month, 1).getDay()-firstDay;

    const isDay = (date, day) =>
            date instanceof Date
            && year === date.getFullYear()
            && month === date.getMonth()
            && day === date.getDate();

    $: getDayClass = (day) => {
        const c = [];
        if (selectedDay && isDay(selectedDay, day)) c.push('is-selected');
        const dateClass = dateClasses.find(([date]) => isDay(date, day));
        if (dateClass) c.push(dateClass[1]);
        return c.join(' ');
    };

</script>
<style>

    ul {
        width: 300px;
    }

    li {
        display: inline-block;
        width: 14.28%;
    }

</style>
{#if displayMonthTitle}
    {monthsTitles[month]}
{/if}
{#if displayTitles}
    <ul>
        {#each Array(7) as _, i}
            <li>{daysTitles[i]}</li>
        {/each}
    </ul>
{/if}
<ul>
    {#each Array(numberOfDays + offset) as _, i}
        <li class={getDayClass(i-offset+1)}>
            {#if i>=offset}
                <MonthDay day={i-offset+1} bind:selectedDay bind:month bind:year onSelect={onSelect}/>
            {/if}
        </li>
    {/each}
</ul>
