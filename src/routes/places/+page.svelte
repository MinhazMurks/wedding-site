<script lang="ts">
	import { PUBLIC_WEDDING_SERVICE_HOST } from "$env/static/public";
	import { onDestroy, onMount, tick } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import { type GetAllPlacesResponse, PlaceCategory, type PlaceData } from "$lib/types/Responses.js";
	import { Accordion, AccordionItem } from "svelte-collapsible";
	import { PhoneIcon, MapPinIcon, WatchIcon, GlobeIcon, ChevronUpIcon, ChevronDownIcon } from "svelte-feather-icons";
	import Lenis from "@studio-freight/lenis";

	const accordionDuration = 1;
	const accordionEasing = "ease-in-out";

	let loading = false;
	let openedAccordion: PlaceCategory | null;
	let places: Map<PlaceCategory, PlaceData[]> = new Map();

	let animations: gsap.core.Tween[] = [];

	let placesTitleContainer: HTMLElement;
	let mainBodyContainer: HTMLElement;
	let nearbyTitleContainer: HTMLElement;
	let accordionHeaders: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		getPlaces();

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

	onDestroy(() => {
		animations.map(animation => animation.kill());
	});

	function initAnims(): void {
		const startingTimeline = gsap.timeline({
			scrollTrigger: {
				start: "top center",
				end: "bottom center",
			},
		});

		for (let placeTitle of placesTitleContainer.children) {
			startingTimeline.from(placeTitle, {
				opacity: 0,
				x: 20,
				y: 20,
				ease: "power1.inOut",
			});
		}

		startingTimeline.from(mainBodyContainer, {
			opacity: 0,
			scale: .9,
			x: -10,
			y: -10,
			ease: "power1.inOut",
		});

		startingTimeline.from(nearbyTitleContainer, {
			opacity: 0,
			x: 20,
			y: 20,
			ease: "power1.inOut",
		});

		startingTimeline.from(accordionHeaders, {
			opacity: 0,
			y: -20,

			ease: "power1.inOut",
		});
	}

	function getPlaces(): void {
		loading = true;
		fetch(`${PUBLIC_WEDDING_SERVICE_HOST}/api/v1/place/all`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then(async response => {
				if (response.status >= 500) {
					throw new Error("Something went wrong");
				}
				return response.json();
			})
			.then(async data => {
				const placesResponse = data as GetAllPlacesResponse;
				for (let place of placesResponse.places) {
					let placeList = places.get(place.category);
					if (!placeList) {
						placeList = [];
						places.set(place.category, placeList);
					}
					placeList.push(place);
				}
				places = places;
			})
			.catch(async error => {
				console.log(error.message);
			});
	};

	function getNonNullList(placeData: PlaceData[] | undefined): PlaceData[] {
		return placeData!;
	}

	function snakeCaseToSentenceCase(str: string): string {
		const words = str.toLowerCase().split("_");
		return words.map((word) => {
			if (word.length > 2) {
				return word[0].toUpperCase() + word.slice(1);
			}
		}).join(" ");
	}

	function getMapLink(address: string): string {
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
	}

	function formatPhoneNumber(phoneNumber: string) {
		if (phoneNumber.length == 10) {
			return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
		}
		return phoneNumber;
	}
</script>

<div class="places-page-container">
	<div class="places-title-container" bind:this={placesTitleContainer}>
		<h1>The Venue</h1>
		<div class="places-content-item-info" style="align-self: center; font-size: min(1.6rem, 4.5vw);">
			<MapPinIcon />
			<span><a href="{getMapLink('2017 Gregory Rd, Orlando, FL 32825')}" target="_blank"
							 rel="noopener noreferrer">2017 Gregory Rd, Orlando, FL 32825</a></span>
		</div>
	</div>
	<div class="main-body-container" bind:this={mainBodyContainer}>
		<span>We have chosen The Black Barn for our wedding venue. The Black Barn is a beautiful rustic but modern venue.
			Located away from the main Orlando area, it boasts 5 acres of agricultural land. The Black Barn has both beautiful
			greenery and modern architecture allowing us to enjoy the best of both worlds.</span>
	</div>
	<div class="places-title-container" bind:this={nearbyTitleContainer}>
		<h1>Nearby</h1>
	</div>
	<div class="places-accordion-container" bind:this={accordionHeaders}>
		<Accordion bind:key={openedAccordion} duration="{accordionDuration}" easing="{accordionEasing}">
			{#each places.keys() as placeKey}
				{#if places.get(placeKey)}
					<AccordionItem key="{placeKey}">
						<h2 slot="header" class="places-content-item-info">
							{snakeCaseToSentenceCase(placeKey)}
							{#if openedAccordion === placeKey}
								<ChevronUpIcon size="40em" strokeWidth="{2}" />
							{:else}
								<ChevronDownIcon size="40em" strokeWidth="{2}" />
							{/if}
						</h2>
						<div slot="body" class="places-content-container">
							{#each getNonNullList(places.get(placeKey)) as place}
								<div class="places-content-item">
									<div class="places-content-item-title">
										<h3>
											{place.name}
										</h3>
										{#if place.cost}
											<span>{place.cost}</span>
										{/if}
									</div>
									{#if place.address}
										<div class="places-content-item-info">
											<MapPinIcon />
											<span><a href="{getMapLink(place.address)}" target="_blank"
															 rel="noopener noreferrer">{place.address}</a></span>
										</div>
									{/if}
									{#if place.distanceFromAirport}
										<div class="places-content-item-info">
											<WatchIcon />
											<span>{place.distanceFromAirport} minutes from the airport</span>
										</div>
									{/if}
									{#if place.distanceFromVenue}
										<div class="places-content-item-info">
											<WatchIcon />
											<span>{place.distanceFromVenue} minutes from the venue</span>
										</div>
									{/if}
									{#if place.phoneNumber}
										<div class="places-content-item-info">
											<PhoneIcon />
											<span><a href="tel:{place.phoneNumber}">{formatPhoneNumber(place.phoneNumber)}</a></span>
										</div>
									{/if}
									{#if place.website}
										<div class="places-content-item-info">
											<GlobeIcon />
											<span><a href="{place.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></span>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</AccordionItem>
				{/if}
			{/each}
		</Accordion>
	</div>
</div>

<style>
    @font-face {
        font-family: 'Gnomon';
        font-style: normal;
        font-weight: 800;
        src: url('/fonts/gnomon-foreground.ttf'); /* IE9 Compat Modes */
        src: local(''),
            /* Modern Browsers */ url('/fonts/gnomon-foreground.ttf') format('truetype')
    }

    .places-page-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        font-family: Jost, sans-serif;
    }

    .places-title-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
    }

    .places-title-container h1 {
        font-family: "Parisienne", cursive;
        font-size: max(3vw, 4.5rem);
    }

    .main-body-container {
        align-self: center;
        display: flex;
        font-family: Jost, sans-serif;
        text-align: center;
        max-width: max(600px, 50vw);
        font-size: min(1.6rem, 4.5vw);
        padding: 10px;
    }

    .main-body-container span {
        padding: 20px;
    }

    .places-accordion-container {
        display: flex;
        justify-content: center;
        max-width: max(600px, 50vw);
        padding: 10px;
    }

    .places-accordion-container h2 {
        font-family: Gnomon, sans-serif;
        font-size: 4rem;
        font-weight: 500;
        color: var(--color-text);

        margin-top: .5rem;
        margin-bottom: .5rem;

        display: flex;
        justify-content: center;

        transition: color 0.2s;
    }

    .places-accordion-container h2 span {
        display: flex;
    }

    .places-accordion-container h2:hover {
        color: white;
    }

    .places-content-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        row-gap: 40px;
    }

    .places-content-item {
        padding-left: 20px;
        font-family: Jost, serif;
        display: flex;
        flex-direction: column;
    }

    .places-content-item-title {
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .places-content-item-title h3 {
        margin: 0;
        font-size: 2em;
        font-weight: 500;
    }

    .places-content-item-title span {
        font-weight: 800;
        color: green;
    }

    .places-content-item-info {
        display: flex;
        align-items: center;
        column-gap: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .places-content-item-info:hover {
        cursor: pointer;
        color: white;
    }
</style>