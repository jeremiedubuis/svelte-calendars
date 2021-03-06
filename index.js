(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Calendars = {}));
}(this, (function (exports) { 'use strict';

    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    // source: https://html.spec.whatwg.org/multipage/indices.html
    const boolean_attributes = new Set([
        'allowfullscreen',
        'allowpaymentrequest',
        'async',
        'autofocus',
        'autoplay',
        'checked',
        'controls',
        'default',
        'defer',
        'disabled',
        'formnovalidate',
        'hidden',
        'ismap',
        'loop',
        'multiple',
        'muted',
        'nomodule',
        'novalidate',
        'open',
        'playsinline',
        'readonly',
        'required',
        'reversed',
        'selected'
    ]);

    const invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
    // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    // https://infra.spec.whatwg.org/#noncharacter
    function spread(args, classes_to_add) {
        const attributes = Object.assign({}, ...args);
        if (classes_to_add) {
            if (attributes.class == null) {
                attributes.class = classes_to_add;
            }
            else {
                attributes.class += ' ' + classes_to_add;
            }
        }
        let str = '';
        Object.keys(attributes).forEach(name => {
            if (invalid_attribute_name_character.test(name))
                return;
            const value = attributes[name];
            if (value === true)
                str += " " + name;
            else if (boolean_attributes.has(name.toLowerCase())) {
                if (value)
                    str += " " + name;
            }
            else if (value != null) {
                str += " " + name + "=" + JSON.stringify(String(value)
                    .replace(/"/g, '&#34;')
                    .replace(/'/g, '&#39;'));
            }
        });
        return str;
    }
    const escaped = {
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    function escape(html) {
        return String(html).replace(/["'&<>]/g, match => escaped[match]);
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
    }
    function validate_component(component, name) {
        if (!component || !component.$$render) {
            if (name === 'svelte:component')
                name += ' this={...}';
            throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
        }
        return component;
    }
    let on_destroy;
    function create_ssr_component(fn) {
        function $$render(result, props, bindings, slots) {
            const parent_component = current_component;
            const $$ = {
                on_destroy,
                context: new Map(parent_component ? parent_component.$$.context : []),
                // these will be immediately discarded
                on_mount: [],
                before_update: [],
                after_update: [],
                callbacks: blank_object()
            };
            set_current_component({ $$ });
            const html = fn(result, props, bindings, slots);
            set_current_component(parent_component);
            return html;
        }
        return {
            render: (props = {}, options = {}) => {
                on_destroy = [];
                const result = { head: '', css: new Set() };
                const html = $$render(result, props, {}, options);
                run_all(on_destroy);
                return {
                    html,
                    css: {
                        code: Array.from(result.css).map(css => css.code).join('\n'),
                        map: null // TODO
                    },
                    head: result.head
                };
            },
            $$render
        };
    }
    function add_attribute(name, value, boolean) {
        if (value == null || (boolean && !value))
            return '';
        return ` ${name}${value === true ? '' : `=${typeof value === 'string' ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
    }

    let firstDay = 1;
    let daysTitles = ['MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT', 'SUN'];
    let monthsTitles = [
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
    ];

    let libClassName = 'svelte-calendar';

    const setConfiguration = (o= {}) => {
        if (o.firstDay) firstDay = o.firstDay;
        if (o.daysTitles) daysTitles = o.daysTitles;
        if (o.monthsTitles) monthsTitles = o.monthsTitles;
        if (o.libClassName) libClassName = o.libClassName;
    };

    /* src\MonthDay.svelte generated by Svelte v3.16.7 */

    const MonthDay = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { day } = $$props;
    	let { selectedDay = undefined } = $$props;
    	let { onSelect } = $$props;
    	let { year } = $$props;
    	let { month } = $$props;

    	if ($$props.day === void 0 && $$bindings.day && day !== void 0) $$bindings.day(day);
    	if ($$props.selectedDay === void 0 && $$bindings.selectedDay && selectedDay !== void 0) $$bindings.selectedDay(selectedDay);
    	if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0) $$bindings.onSelect(onSelect);
    	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);
    	if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);

    	return `<button type="${"button"}">
    ${escape(day)}
</button>`;
    });

    /* src\Month.svelte generated by Svelte v3.16.7 */

    const css = {
    	code: "ul.svelte-1f1rvgu{width:300px}li.svelte-1f1rvgu{display:inline-block;width:14.28%}",
    	map: "{\"version\":3,\"file\":\"Month.svelte\",\"sources\":[\"Month.svelte\"],\"sourcesContent\":[\"<script>\\n    import { daysTitles, firstDay , monthsTitles} from './helpers/configuration';\\n    import MonthDay from './MonthDay.svelte';\\n    export let year;\\n    export let month;\\n    export let displayTitles;\\n    export let displayMonthTitle;\\n    export let selectedDay = undefined;\\n    export let onSelect;\\n    export let dateClasses;\\n\\n    $: numberOfDays = new Date(month+1 > 11 ? year + 1 : year, month+1 > 11  ? month+1 : 0, 0).getDate()\\n    $: offset = new Date(year, month, 1).getDay()-firstDay;\\n\\n    const isDay = (date, day) =>\\n            date instanceof Date\\n            && year === date.getFullYear()\\n            && month === date.getMonth()\\n            && day === date.getDate();\\n\\n    $: getDayClass = (day) => {\\n        const c = [];\\n        if (selectedDay && isDay(selectedDay, day)) c.push('is-selected');\\n        const dateClass = dateClasses.find(([date]) => isDay(date, day));\\n        if (dateClass) c.push(dateClass[1]);\\n        return c.join(' ');\\n    };\\n\\n</script>\\n<style>\\n\\n    ul {\\n        width: 300px;\\n    }\\n\\n    li {\\n        display: inline-block;\\n        width: 14.28%;\\n    }\\n\\n</style>\\n{#if displayMonthTitle}\\n    {monthsTitles[month]}\\n{/if}\\n{#if displayTitles}\\n    <ul>\\n        {#each Array(7) as _, i}\\n            <li>{daysTitles[i]}</li>\\n        {/each}\\n    </ul>\\n{/if}\\n<ul>\\n    {#each Array(numberOfDays + offset) as _, i}\\n        <li class={getDayClass(i-offset+1)}>\\n            {#if i>=offset}\\n                <MonthDay day={i-offset+1} bind:selectedDay bind:month bind:year onSelect={onSelect}/>\\n            {/if}\\n        </li>\\n    {/each}\\n</ul>\\n\"],\"names\":[],\"mappings\":\"AA+BI,EAAE,eAAC,CAAC,AACA,KAAK,CAAE,KAAK,AAChB,CAAC,AAED,EAAE,eAAC,CAAC,AACA,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,MAAM,AACjB,CAAC\"}"
    };

    const Month = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { year } = $$props;
    	let { month } = $$props;
    	let { displayTitles } = $$props;
    	let { displayMonthTitle } = $$props;
    	let { selectedDay = undefined } = $$props;
    	let { onSelect } = $$props;
    	let { dateClasses } = $$props;
    	const isDay = (date, day) => date instanceof Date && year === date.getFullYear() && month === date.getMonth() && day === date.getDate();
    	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);
    	if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
    	if ($$props.displayTitles === void 0 && $$bindings.displayTitles && displayTitles !== void 0) $$bindings.displayTitles(displayTitles);
    	if ($$props.displayMonthTitle === void 0 && $$bindings.displayMonthTitle && displayMonthTitle !== void 0) $$bindings.displayMonthTitle(displayMonthTitle);
    	if ($$props.selectedDay === void 0 && $$bindings.selectedDay && selectedDay !== void 0) $$bindings.selectedDay(selectedDay);
    	if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0) $$bindings.onSelect(onSelect);
    	if ($$props.dateClasses === void 0 && $$bindings.dateClasses && dateClasses !== void 0) $$bindings.dateClasses(dateClasses);
    	$$result.css.add(css);
    	let $$settled;
    	let $$rendered;

    	do {
    		$$settled = true;
    		let numberOfDays = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? month + 1 : 0, 0).getDate();
    		let offset = new Date(year, month, 1).getDay() - firstDay;

    		let getDayClass = day => {
    			const c = [];
    			if (selectedDay && isDay(selectedDay, day)) c.push("is-selected");
    			const dateClass = dateClasses.find(([date]) => isDay(date, day));
    			if (dateClass) c.push(dateClass[1]);
    			return c.join(" ");
    		};

    		$$rendered = `${displayMonthTitle
		? `${escape(monthsTitles[month])}`
		: ``}
${displayTitles
		? `<ul class="${"svelte-1f1rvgu"}">
        ${each(Array(7), (_, i) => `<li class="${"svelte-1f1rvgu"}">${escape(daysTitles[i])}</li>`)}
    </ul>`
		: ``}
<ul class="${"svelte-1f1rvgu"}">
    ${each(Array(numberOfDays + offset), (_, i) => `<li class="${escape(null_to_empty(getDayClass(i - offset + 1))) + " svelte-1f1rvgu"}">
            ${i >= offset
		? `${validate_component(MonthDay, "MonthDay").$$render(
				$$result,
				{
					day: i - offset + 1,
					onSelect,
					selectedDay,
					month,
					year
				},
				{
					selectedDay: $$value => {
						selectedDay = $$value;
						$$settled = false;
					},
					month: $$value => {
						month = $$value;
						$$settled = false;
					},
					year: $$value => {
						year = $$value;
						$$settled = false;
					}
				},
				{}
			)}`
		: ``}
        </li>`)}
</ul>`;
    	} while (!$$settled);

    	return $$rendered;
    });

    /* src\MonthPicker.svelte generated by Svelte v3.16.7 */

    const MonthPicker = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { year } = $$props;
    	let { month } = $$props;

    	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);
    	if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);

    	return `<div class="${"month-picker"}">
    <button class="${"previous-button"}" type="${"button"}">
        Previous
    </button>
    ${escape(monthsTitles[month])}
    <button class="${"next-button"}" type="${"button"}">
        Next
    </button>
</div>`;
    });

    /* src\YearPicker.svelte generated by Svelte v3.16.7 */

    const YearPicker = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { year } = $$props;
    	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);

    	return `<div class="${"year-picker"}">
    <button class="${"previous-button"}" type="${"button"}">
        Previous
    </button>
    ${escape(year)}
    <button class="${"next-button"}" type="${"button"}">
        Next
    </button>
</div>`;
    });

    /* src\Calendar.svelte generated by Svelte v3.16.7 */

    const Calendar = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { month = new Date().getMonth() } = $$props;
    	let { year = new Date().getFullYear() } = $$props;
    	let { visibleMonths = 1 } = $$props;
    	let { displayTitles = true } = $$props;
    	let { displayYearPicker = false } = $$props;
    	let { displayMonthPicker = true } = $$props;
    	let { displayMonthTitle = false } = $$props;
    	let { selectedDay = undefined } = $$props;

    	let { onSelect = () => {
    		
    	} } = $$props;

    	let { dateClasses = [] } = $$props;
    	if ($$props.month === void 0 && $$bindings.month && month !== void 0) $$bindings.month(month);
    	if ($$props.year === void 0 && $$bindings.year && year !== void 0) $$bindings.year(year);
    	if ($$props.visibleMonths === void 0 && $$bindings.visibleMonths && visibleMonths !== void 0) $$bindings.visibleMonths(visibleMonths);
    	if ($$props.displayTitles === void 0 && $$bindings.displayTitles && displayTitles !== void 0) $$bindings.displayTitles(displayTitles);
    	if ($$props.displayYearPicker === void 0 && $$bindings.displayYearPicker && displayYearPicker !== void 0) $$bindings.displayYearPicker(displayYearPicker);
    	if ($$props.displayMonthPicker === void 0 && $$bindings.displayMonthPicker && displayMonthPicker !== void 0) $$bindings.displayMonthPicker(displayMonthPicker);
    	if ($$props.displayMonthTitle === void 0 && $$bindings.displayMonthTitle && displayMonthTitle !== void 0) $$bindings.displayMonthTitle(displayMonthTitle);
    	if ($$props.selectedDay === void 0 && $$bindings.selectedDay && selectedDay !== void 0) $$bindings.selectedDay(selectedDay);
    	if ($$props.onSelect === void 0 && $$bindings.onSelect && onSelect !== void 0) $$bindings.onSelect(onSelect);
    	if ($$props.dateClasses === void 0 && $$bindings.dateClasses && dateClasses !== void 0) $$bindings.dateClasses(dateClasses);
    	let $$settled;
    	let $$rendered;

    	do {
    		$$settled = true;

    		$$rendered = `<div${add_attribute("class", libClassName, 0)}>
    ${displayMonthPicker
		? `${validate_component(MonthPicker, "MonthPicker").$$render(
				$$result,
				{ month, year },
				{
					month: $$value => {
						month = $$value;
						$$settled = false;
					},
					year: $$value => {
						year = $$value;
						$$settled = false;
					}
				},
				{}
			)}`
		: ``}
    ${displayYearPicker
		? `${validate_component(YearPicker, "YearPicker").$$render(
				$$result,
				{ year },
				{
					year: $$value => {
						year = $$value;
						$$settled = false;
					}
				},
				{}
			)}`
		: ``}
    <ul class="${escape(libClassName) + "-months"}">
    ${each(Array(visibleMonths), (_, i) => `<li class="${escape(libClassName) + "-month"}">
            ${validate_component(Month, "Month").$$render(
			$$result,
			{
				onSelect,
				year: month + i > 11 ? year + 1 : year,
				month: month + i > 11 ? month + i - 11 : month + i,
				dateClasses,
				displayTitles,
				displayMonthTitle,
				selectedDay
			},
			{
				selectedDay: $$value => {
					selectedDay = $$value;
					$$settled = false;
				}
			},
			{}
		)}
        </li>`)}
    </ul>
</div>`;
    	} while (!$$settled);

    	return $$rendered;
    });

    /* src\DatePicker.svelte generated by Svelte v3.16.7 */

    const DatePicker = create_ssr_component(($$result, $$props, $$bindings, $$slots) => {
    	let { selectedDay } = $$props;
    	let displayCalendar = false;

    	const onDateSelection = (e, date, previousDate) => {
    		displayCalendar = false;
    		value = dateToValue(date);
    		selectedDay = date;
    		onSelect(e, date, previousDate);
    	};

    	onMount(() => {
    		value = selectedDay ? dateToValue(selectedDay) : "";
    	});

    	if ($$props.selectedDay === void 0 && $$bindings.selectedDay && selectedDay !== void 0) $$bindings.selectedDay(selectedDay);
    	let $$settled;
    	let $$rendered;

    	do {
    		$$settled = true;

    		let { dateToValue = date => date.toLocaleDateString(), selectedDay: _selectedDay, visibleMonths = 1, displayTitles = false, displayMonthPicker = true, displayMonthTitle = false, displayYearPicker = false, month = new Date().getMonth(), year = new Date().getFullYear(), onSelect = () => {
    			
    		}, dateClasses = [], ...htmlProps } = $$props;

    		let value = selectedDay ? dateToValue(selectedDay) : undefined;

    		$$rendered = `${displayCalendar
		? `<div${add_attribute("class", `${libClassName}-date-picker`, 0)}>
        <button>Close</button>
        ${validate_component(Calendar, "Calendar").$$render(
				$$result,
				{
					month,
					year,
					onSelect: onDateSelection,
					dateClasses,
					selectedDay,
					visibleMonths,
					displayTitles,
					displayMonthPicker,
					displayYearPicker
				},
				{
					selectedDay: $$value => {
						selectedDay = $$value;
						$$settled = false;
					},
					visibleMonths: $$value => {
						visibleMonths = $$value;
						$$settled = false;
					},
					displayTitles: $$value => {
						displayTitles = $$value;
						$$settled = false;
					},
					displayMonthPicker: $$value => {
						displayMonthPicker = $$value;
						$$settled = false;
					},
					displayYearPicker: $$value => {
						displayYearPicker = $$value;
						$$settled = false;
					}
				},
				{}
			)}
    </div>`
		: ``}

<input${spread([htmlProps])}${add_attribute("value", value, 1)}>`;
    	} while (!$$settled);

    	return $$rendered;
    });

    exports.Calendar = Calendar;
    exports.DatePicker = DatePicker;
    exports.setConfiguration = setConfiguration;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
