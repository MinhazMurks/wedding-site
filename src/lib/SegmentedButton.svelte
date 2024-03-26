<script lang="ts">
	import { onMount, tick } from 'svelte';

	type Segment = {
		label: string;
		value: string;
		bound?: HTMLElement | null;
	}

	export let name: string;
	export let segments: Segment[] = [];
	export let defaultIndex: number = 1;
	export let callback: (value: string) => void;

	let activeIndex: number = defaultIndex;
	let boundContainer: HTMLElement;
	let animate = false;

	onMount(() => {
		animateActiveSelection();
	});

	async function onInputChange(index: number) {
		activeIndex = index;
		animate = true;
		await tick();

		animateActiveSelection();
		callback(segments[index].value);
	}

	function animateActiveSelection() {
		if (segments[activeIndex].bound) {
			const offsetWidth = segments[activeIndex].bound?.offsetWidth;
			const offsetLeft = segments[activeIndex].bound?.offsetLeft;
			boundContainer.style.setProperty('--highlight-width', `${offsetWidth}px`);
			boundContainer.style.setProperty('--highlight-x-pos', `${offsetLeft}px`);
		}
	}
</script>

<div bind:this={boundContainer} id="controls-container" class="controls-container">
	<div class:animate class={`controls`}>
		{#each segments as segment, index (segment.value)}
			<div
				id="{String(index)}"
				class="{`segment ${activeIndex === index ? 'active' : 'inactive'}`}"
				bind:this={segments[index].bound}
			>
				<input
					type="radio"
					value={segment.value}
					id={segment.label}
					name={name}
					on:change={() => onInputChange(index)}
					checked={index === activeIndex}
				/>
				<label for="{segment.label}">
					{segment.label}
				</label>
			</div>
		{/each}
	</div>
</div>

<style>
    .controls-container {
        box-sizing: border-box;
        color: black;
        --highlight-width: auto;
        --highlight-x-pos: 0;
        height: 100%;
        width: 100%;
        display: flex;
    }

    .controls {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #dfdfdf;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        padding: 10px;
        overflow: hidden;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .controls input {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 0;
        opacity: 0;
        margin: 0;
        cursor: pointer;
    }

    .segment {
        width: 100%;
        text-align: center;
    }

    .segment label {
        cursor: pointer;
        display: block;
        font-weight: 700;
        padding: 10px;
        position: relative;
        transition: color 0.5s ease;
    }

    .segment.active label {
        color: #fff;
    }

    .controls::before {
        content: '';
        background: rgb(143, 7, 7);
        background: linear-gradient(209deg, rgba(143, 7, 7, 1) 50%, rgb(108, 4, 4) 90%);
        border-radius: 5px;
        width: var(--highlight-width);
        transform: translateX(var(--highlight-x-pos));
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        z-index: 0;
    }

    .controls.animate::before {
        transition: transform 0.3s ease, width 0.3s ease;
    }
</style>