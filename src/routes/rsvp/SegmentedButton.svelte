<script lang="ts">
	import { onMount, tick } from 'svelte';

	type Segment = {
		label: string;
		value: string;
		bound?: HTMLElement | null;
	}

	export let name: string;
	export let segments: Segment[] = [];
	export const defaultIndex: number = 1;

	let activeIndex: number = defaultIndex;
	let boundContainer: HTMLElement;
	let animate = false;

	onMount(() => {
		console.log(segments[activeIndex]);
		animate = true;

		if (segments[activeIndex].bound) {
			const offsetWidth = segments[activeIndex].bound?.offsetWidth;
			const offsetLeft = segments[activeIndex].bound?.offsetLeft;
			console.log(`offsetNew - ${offsetLeft} - ${offsetWidth}`);
			boundContainer.style.setProperty("--highlight-width", `${offsetWidth}px`);
			boundContainer.style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
		}
	})

	async function onInputChange(index: number) {
		activeIndex = index;
		await tick();

		if (segments[activeIndex].bound) {
			const offsetWidth = segments[activeIndex].bound?.offsetWidth;
			const offsetLeft = segments[activeIndex].bound?.offsetLeft;
			console.log(`offsetNew - ${offsetLeft} - ${offsetWidth}`);
			boundContainer.style.setProperty("--highlight-width", `${offsetWidth}px`);
			boundContainer.style.setProperty("--highlight-x-pos", `${offsetLeft}px`);
		}

		//callback(value, index);
	}

</script>

<section>
	<div bind:this={boundContainer} id="controls-container" class="controls-container">
		<div class:animate class="controls">
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
</section>

<style>
		section {
				color: black
		}

    .controls-container {
        --highlight-width: auto;
        --highlight-x-pos: 0;

        display: flex;
    }

    .controls {
        display: inline-flex;
        justify-content: space-between;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        max-width: 500px;
        padding: 12px;
        margin: auto;
        overflow: hidden;
        position: relative;
    }


    .controls input {
        opacity: 0;
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        position: absolute;
        width: 100%;
        cursor: pointer;
        height: 100%;
    }

    .segment {
        min-width: 120px;
        position: relative;
        text-align: center;
        z-index: 1;
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
        background: #5465FF;
        border-radius: 8px;
        width: var(--highlight-width);
        transform: translateX(var(--highlight-x-pos));
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        z-index: 0;
    }

		.animate::before {
        transition: transform 0.3s ease, width 0.3s ease;
		}
</style>