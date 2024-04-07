<script lang="ts">
	import { onMount } from "svelte";
	import Lenis from "@studio-freight/lenis";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";

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

<svelte:head>
	<title>Itinerary</title>
	<meta name="description" content="Jennie and Minhaz's Itinerary" />
</svelte:head>

<div class="itinerary-page">
	<div class="itinerary-body">
		<h1 bind:this={title}>Itinerary</h1>
		<span bind:this={body}>Please check back here closer to the wedding date for more updated information!</span>
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
        font-size: max(3vw, 4.5rem);
    }

    .itinerary-body span {
        font-family: Jost, sans-serif;
        font-size: min(1.6rem, 4.5vw);
        padding: 20px;
    }
</style>