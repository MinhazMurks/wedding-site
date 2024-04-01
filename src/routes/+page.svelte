<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Lenis from '@studio-freight/lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
		let titleAnimation = gsap.timeline({
			scrollTrigger: {
				trigger: titleContainer,
				start: "top center",
				end: "bottom +=20%",
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

<div>
	<div class="page-body-container" bind:this={pageBodyContainer}>
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
			<div class="info-body">
				<p>
					We are delighted to welcome you to our wedding celebration! On this website,
					you'll find all the information you need to join us in commemorating our love
					and union. Feel free to explore for details on the ceremony, reception, accommodations,
					and more. We can't wait to share this special day with you!
				</p>
			</div>
			<div class="info-body">
				<p>
					We are delighted to welcome you to our wedding celebration! On this website,
					you'll find all the information you need to join us in commemorating our love
					and union. Feel free to explore for details on the ceremony, reception, accommodations,
					and more. We can't wait to share this special day with you!
				</p>
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

    .page-body-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
				width: 100%;
    }

    .title-container {
				margin-top: 500px;
        display: flex;
        justify-content: center;
				text-align: center;
				column-gap: 30px;
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
				margin-left: 30px;
				margin-right: 30px;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				font-family: Jost, sans-serif;
				font-size: 2vw;
		}
</style>
