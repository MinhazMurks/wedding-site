<script lang="ts">

	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import Lenis from "@studio-freight/lenis";


	let title: HTMLElement;
	let body: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const lenis = new Lenis({
			lerp: 0.1,
			smoothWheel: true,
		});

		function raf(time: number) {
			if (lenis) {
				lenis.raf(time);
				requestAnimationFrame(raf);
			}
		}

		requestAnimationFrame(raf);
		lenis.on("scroll", () => ScrollTrigger.update());

		initAnims();

		return () => lenis.destroy();
	});

	function initAnims() {
		let timeline = gsap.timeline();
		timeline.from(title, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
			duration: 1,
		});

		timeline.from(body, {
			opacity: 0,
			scale: .9,
			x: -10,
			y: -10,
			ease: "power1.inOut",
		});
	}
</script>

<div class="itinerary-page">
	<div class="itinerary-body">
		<h1 bind:this={title}>Itinerary</h1>
		<p bind:this={body}>Please check back here closer to the wedding date for more updated information!</p>
	</div>
</div>

<style>
    .itinerary-page {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .itinerary-body {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        max-width: max(600px, 40vw);
    }

    .itinerary-body h1 {
        font-family: "Parisienne", cursive;
        font-size: 4.5rem;
    }

    .itinerary-body p {
        font-family: Jost, sans-serif;
        font-size: min(2em, 5vw);
    }
</style>