<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Lenis from '@studio-freight/lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { base } from "$app/paths";
	import { ChevronsDownIcon } from "svelte-feather-icons";

	let header1: HTMLElement;
	let header2: HTMLElement;

	let titleContainer: HTMLElement;
	let jennieNameContainer: HTMLElement;
	let minhazNameContainer: HTMLElement;
	let andNameContainer: HTMLElement;
	let infoBodyContainer: HTMLElement;
	let pageBodyContainer: HTMLElement;
	let scrollDialogueContainer: HTMLElement;
	let scrollDialogueTimeline: gsap.core.Timeline;
	let timelines: gsap.core.Timeline[] = [];

	let showScrollDialogue = true;

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

	function initAnims() {
		gsap.from(header1, {
			opacity: .1,
			margin: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
			duration: 1
		});

		gsap.from(header2, {
			opacity: 0,
			margin: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
			duration: 1,
			delay: 1
		});

		gsap.from(scrollDialogueContainer, {
			opacity: .1,
			y: 100,
			ease: "power1.inOut",
			delay: 2,
		})
		scrollDialogueTimeline = gsap.timeline({repeat:-1});
		scrollDialogueTimeline.from(scrollDialogueContainer, { opacity: .3, ease: "power1.inOut", position: "fixed", duration: .8 });
		scrollDialogueTimeline.to(scrollDialogueContainer, { opacity: .3, ease: "power1.inOut", position: "fixed", duration: .8});

		let titleAnimation = gsap.timeline({
			scrollTrigger: {
				trigger: titleContainer,
				start: "top 200",
				end: "+=100% 200",
				pin: pageBodyContainer,
				onEnter: () => activateScrollDialogue(false)
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
					scale: 1,
					duration: .1
				},
			)
		}

		titleAnimation.from(andNameContainer, {
				opacity: 0,
				x: 20,
				y: 20,
				ease: "power1.inOut",
				duration: 1,
			}
		);

		for (let i = jennieNameContainer.children.length - 1; i >= 0; i--) {
			titleAnimation.to(jennieNameContainer.children.item(i),
				{
					x: window.outerWidth,
					duration: .1
				},
			);

			titleAnimation.to(jennieNameContainer.children.item(i),
				{
					y: 40,
					ease: "bounce.out",
					duration: .1
				},
			)
		}

		for (let i = 0; i < infoBodyContainer.children.length; i++) {
			titleAnimation.from(infoBodyContainer.children.item(i), {
				opacity: 0,
				scale: .9,
				x: -10,
				y: -10,
				ease: "power1.inOut",
			})
		}
	}

	function activateScrollDialogue(show: boolean) {
		showScrollDialogue = show;
		if (show) {
			gsap.to(scrollDialogueContainer, {
				opacity: 1,
				ease: "power1.inOut",
			})
		} else {
			gsap.to(scrollDialogueContainer, {
				opacity: 0,
				ease: "power1.inOut",
			})
			scrollDialogueTimeline.kill();
		}
	}

	function scrollToBottom() {
		console.log("clicked")
		window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
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
				Announcing...
			</h1>
			<h1 class="title-2" bind:this={header2}>
				The wedding of...
			</h1>
		</div>

		<div class="first-info-section">
			<div class="title-container" style="--minute-now: {minuteNow}" bind:this={titleContainer}>
				<div>
					<div class="header" style="color: white" bind:this={jennieNameContainer}>
						<span>J</span>
						<span>e</span>
						<span>n</span>
						<span>n</span>
						<span>i</span>
						<span>e</span>
					</div>
				</div>
				<div class="header-plus" bind:this={andNameContainer}>
					<span>and</span>
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
			<div class="info-body" bind:this={infoBodyContainer}>
				<h2>
					9.12.24
				</h2>
				<span>
					We are delighted to welcome you to our wedding celebration! On this website,
					you'll find all the information you need to join us in commemorating our love
					and union. Feel free to explore for details on the ceremony, reception, accommodations,
					and more. We can't wait to share this special day with you!
				</span>
				<span>
					You will find all information pertaining to the wedding here. To find out more about the venue and what's nearby, head to the <span style="padding: 0px" ><a style="padding: 0" href="{base}/places">Destination</a></span> tab.
					If you want to check out the registry, head to the <span style="padding: 0px"><a href="{base}/registry">Registry</a></span> tab.
					Want to RSVP? Head to the <span style="padding: 0px"><a href="{base}/rsvp">RSVP</a></span> tab.
					If you have any questions, scroll down to the  <span class="link-span" style="padding: 0px" role="button" tabindex={4} on:click={scrollToBottom}>Contact Form</span> below to email us!
				</span>
			</div>
		</div>
	</div>
</div>

{#if showScrollDialogue}
	<div class="scroll-dialogue" bind:this={scrollDialogueContainer}>
		<ChevronsDownIcon/>
		<h1>Scroll down</h1>
		<ChevronsDownIcon/>
	</div>
{/if}

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
				min-height: 200vh;
		}

		.title {
        font-family: "Parisienne", cursive;
        font-size: max(5vw, 4.5rem);
		}

    .title-2 {
        font-family: "Parisienne", cursive;
        font-size: max(4vw, 3.5rem);
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
				column-gap: min(3vw, 50px);
				max-height: 300px;
    }

    .header {
        font-family: 'Gnomon', serif;
        font-size: max(3rem, 10vw);

				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
    }

		.header-plus {
				font-family: "Parisienne", cursive;
        font-size: min(5rem, 6vw);
				align-self: center;
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
				flex-direction: column;
				justify-content: center;
				align-items: center;
				text-align: center;
        max-width: max(600px, 40vw);
		}

		.info-body h2{
        font-family: 'Gnomon', serif;
        font-size: min(4em, 10vw);
		}

		.info-body span{
        font-family: Jost, sans-serif;
        font-size: min(1.6rem, 4.5vw);
				padding: 20px;
		}

		.scroll-dialogue {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				column-gap: 10px;
				font-family: Jost, sans-serif;
				position: absolute;
        width: 100%;
        opacity: .5;
				bottom: 0;
				margin-bottom: 10px;
				z-index: 99;
				text-align: center;
		}

		.scroll-dialogue h1 {
				font-size: min(2.5em, 6vw);
		}

		.link-span {
				padding: 0px;
				color: white;
		}

		.link-span:hover {
				text-decoration: underline;
				cursor: pointer;
		}
</style>
