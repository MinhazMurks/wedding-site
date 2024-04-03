<script lang="ts">
	import { ShoppingCartIcon } from "svelte-feather-icons";
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import Lenis from "@studio-freight/lenis";

	let registryTitle: HTMLElement;
	let registryBody: HTMLElement;
	let registrySignature: HTMLElement;
	let registryInfo: HTMLElement;

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

	function initAnims(): void {
		const pageTimeline = gsap.timeline();

		pageTimeline.from(registryTitle, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
		});

		for (let bodySection of registryBody.children) {
			pageTimeline.from(bodySection, {
				opacity: 0,
				scale: .9,
				x: -10,
				y: -10,
				ease: "power1.inOut",
			});
		}

		pageTimeline.from(registrySignature, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
		});

		pageTimeline.from(registryInfo, {
			opacity: 0,
			scale: .9,
			x: -10,
			y: -10,
			ease: "power1.inOut",
		});
	}
</script>

<div class="registry-container" bind:this={registryTitle}>
	<h1>
		Welcome to our wedding registry!
	</h1>
	<div class="registry-body" bind:this={registryBody}>
		<span>
			We are incredibly grateful for your presence in our lives and for your love and support as we embark on this
			exciting journey together. Your presence at our wedding is the greatest gift of all, but if you wish to honor us
			with a gift, we have created a registry with items that will help us start our new life together.
		</span>
		<span>
			To make things convenient for you, we've curated a selection of items on our Amazon registry. From household
			essentials to meaningful experiences, your contribution will help us build our home and create memories that will
			last a lifetime.
		</span>
		<span>
			Please feel free to browse our registry using the link below. Your generosity means the world to us, and we can't
			wait to celebrate this special day with you.
			Thank you from the bottom of our hearts for being a part of our love story.
			With love and gratitude,
		</span>
	</div>
	<h1 bind:this={registrySignature}>
		Jennie and Minhaz
	</h1>
	<div class="registry-info-item" bind:this={registryInfo}>
		<ShoppingCartIcon />
		<span><a href="https://www.amazon.com/wedding/share/Jen-And-Haz" target="_blank" rel="noopener noreferrer">Visit Amazon Registry</a></span>
	</div>
</div>

<style>
    .registry-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .registry-body {
        display: flex;
        flex-direction: column;
        font-family: Jost, sans-serif;
        text-align: center;
        max-width: max(600px, 50vw);
        font-size: min(1.5rem, 5vw);
        padding: 10px;
    }

    .registry-body span {
        padding: 20px;
    }

    .registry-container h1 {
        font-family: "Parisienne", cursive;
        font-size: min(4.5rem, 10vw);
    }

    .registry-info-item {
        display: flex;
        align-items: center;
        font-family: Jost, sans-serif;
        text-align: center;
        max-width: max(600px, 50vw);
        font-size: min(1.5rem, 5vw);
        column-gap: 10px;
        margin-bottom: 10px;
    }

    .registry-info-item:hover {
        cursor: pointer;
        color: white;
    }
</style>