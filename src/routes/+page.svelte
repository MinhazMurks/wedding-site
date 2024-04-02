<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Lenis from '@studio-freight/lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let header1: HTMLElement;
	let header2: HTMLElement;

	let titleContainer: HTMLElement;
	let jennieNameContainer: HTMLElement;
	let minhazNameContainer: HTMLElement;
	let firstInfoSelection: HTMLElement;
	let pageBodyContainer: HTMLElement;

	let timelines: gsap.core.Timeline[] = [];

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

		if (jennieNameContainer) {
			initAnims();
		}
		return () => lenis.destroy();
	});

	onDestroy(() => {
		timelines.forEach(timeline => timeline.killAll());
	});

	let minuteNow = new Date().getMinutes();

	const initAnims = () => {

		gsap.from(header1, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
			duration: 1
		});

		gsap.from(header2, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
			duration: 1,
			delay: 1
		});


		let titleAnimation = gsap.timeline({
			scrollTrigger: {
				trigger: titleContainer,
				start: "top 200",
				end: "bottom 200",
				pinSpacing: false,
				scrub: .5,
				pin: pageBodyContainer,
				markers: true,
				toggleActions: "restart pause resume none"
			}
		});

		titleAnimation.set(jennieNameContainer,
			{
				x: -1 * window.outerWidth,
				y: -40
			}
		)

		for (let i = 0; i < minhazNameContainer.children.length; i++) {
			titleAnimation.fromTo(minhazNameContainer.children.item(i),
				{
					opacity: 0,
					scale: .6
				},
				{
					opacity: 1,
					stagger: .3,
					ease: "elastic.out",
					scale: 1
				},
			)
		}

		for (let i = jennieNameContainer.children.length - 1; i >= 0; i--) {
			titleAnimation.to(jennieNameContainer.children.item(i),
				{
					x: window.outerWidth,
				},
			);

			titleAnimation.to(jennieNameContainer.children.item(i),
				{
					y: 40,
					ease: "bounce.out",
				},
			)
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Minnie Wedding" />
</svelte:head>

<div class="home-page-container">
	<div class="page-body-container" bind:this={pageBodyContainer}>
		<div>
			<h1 class="title" bind:this={header1}>
				We would like to announce...
			</h1>
			<h1 class="title" bind:this={header2}>
				The wedding of...
			</h1>
		</div>

		<div class="first-info-section" bind:this={firstInfoSelection}>
			<div class="title-container" style="--minute-now: {minuteNow}" bind:this={titleContainer}>
				<div class="">
					<div class="header" style="color: white" bind:this={jennieNameContainer}>
						<span>J</span>
						<span>e</span>
						<span>n</span>
						<span>n</span>
						<span>i</span>
						<span>e</span>
					</div>
				</div>
				<div>
					<div class="header" style="color: black" bind:this={minhazNameContainer}>
						<span>M</span>
						<span>i</span>
						<span>n</span>
						<span>h</span>
						<span>a</span>
						<span>z</span>
					</div>
				</div>
			</div>
			<div class="info-body">
				<p>
					We are delighted to welcome you to our wedding celebration! On this website,
					you'll find all the information you need to join us in commemorating our love
					and union. Feel free to explore for details on the ceremony, reception, accommodations,
					and more. We can't wait to share this special day with you!
				</p>
			</div>
		</div>
	</div>
</div>

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

    @font-face {
        font-family: 'Gnomon';
        font-style: normal;
        font-weight: 800;
        src: url('/fonts/gnomon-foreground.ttf'); /* IE9 Compat Modes */
        src: local(''),
            /* Modern Browsers */ url('/fonts/gnomon-foreground.ttf') format('truetype')
    }

		.home-page-container {
        height: 200vh;
		}

		.title {
        font-family: "Parisienne", cursive;
				font-size: max(4vw, 3.5em);
		}

    .page-body-container {
        margin-top: 10vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
				width: 100%;
    }

    .title-container {
        display: flex;
        justify-content: center;
				text-align: center;
				column-gap: 30px;
				max-height: 300px;
    }

    .header {
        font-family: 'Gnomon', serif;
        font-size: 10vw;

				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
    }

		::selection {
				background: #000000;
				color: white;
				z-index: -1;
		}

		.first-info-section {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
		}

		.info-body {
				padding: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				font-family: Jost, sans-serif;
				font-size: min(2em, 5vw);
				max-width: max(600px, 40vw);
		}
</style>
