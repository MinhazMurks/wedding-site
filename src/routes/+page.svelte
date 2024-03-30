<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from '@studio-freight/lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let minhazNameContainer: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		const lenis = new Lenis({
			lerp: 0.1,
			smoothWheel: true
		});

		function raf(time: number) {
			if (lenis) {
				lenis.raf(time);
				requestAnimationFrame(raf);
			}
		}
		requestAnimationFrame(raf);
		lenis.on('scroll', () => ScrollTrigger.update());

		if (minhazNameContainer) {

			initAnims();
		}
		return () => lenis.destroy();
	})

	let minuteNow = new Date().getMinutes();


	const initAnims = () => {

		for (let i = 0; i < minhazNameContainer.children.length; i++) {
			let tl = gsap.timeline();
			tl.from(
				minhazNameContainer.children.item(i),
				{
					'will-change': 'opacity, transform',
					opacity: 0,
					scale: 0.67,
					delay: (i + 1) * .4,
				}).to(
				minhazNameContainer.children.item(i),
				{
					ease: 'power4',
					opacity: 1,
					scale: 1,
					delay: (i + 1) * .4,
					rotation: 0,
					stagger: 0.4,
					scrollTrigger: {
						trigger: minhazNameContainer,
						start: 'center+=90% bottom',
						end: '+=20%',
						scrub: true
					},
				});
		}

	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Minnie Wedding" />
</svelte:head>

<section>
	<div class="title-container" style="--minute-now: {minuteNow}">
		<div class="">
			<div class="front" bind:this={minhazNameContainer}>
				<span>J</span>
				<span>e</span>
				<span>n</span>
				<span>n</span>
				<span>i</span>
				<span>e</span>
			</div>
		</div>
		<div class="">
			<div class="front">
				<span>M</span>
				<span>i</span>
				<span>n</span>
				<span>h</span>
				<span>a</span>
				<span>z</span>
			</div>
		</div>
	</div>
</section>

<style>
    @font-face {
        font-family: 'Gnomon-Web';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/gnomon-web.ttf'); /* IE9 Compat Modes */
        src: local(''),
            /* Modern Browsers */ url('/fonts/gnomon-web.ttf') format('truetype')
    }

    @font-face {
        font-family: 'Gnomon-Simple';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/gnomon-simple.ttf'); /* IE9 Compat Modes */
        src: local(''),
            /* Modern Browsers */ url('/fonts/gnomon-simple.ttf') format('truetype')
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    .title-container {
        display: flex;
        justify-content: center;
        align-items: center;
				text-align: center;
        height: 1800px;
    }

    .front {
        font-family: 'Gnomon-Simple', serif;
        font-size: 10em;
        color: #ffffff;
        font-variation-settings: "TOTD" 0, "DIST" 0;

				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
    }

    .shadow {
        font-family: 'Gnomon-Web', serif;
        font-size: 10em;
        position: absolute;
        color: #000000;
				font-variation-settings: "TOTD" var(--minute-now), "DIST" 200;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>
