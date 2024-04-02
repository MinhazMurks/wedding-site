<script lang="ts">
	import { PUBLIC_WEDDING_SERVICE_HOST } from "$env/static/public";
	import { onDestroy, onMount } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import { type GetAllPlacesResponse, PlaceCategory, type PlaceData } from "$lib/types/Responses.js";
	import { Accordion, AccordionItem } from "svelte-collapsible";
	import { PhoneIcon, MapPinIcon, WatchIcon, GlobeIcon, ChevronUpIcon, ChevronDownIcon } from "svelte-feather-icons";
	import Lenis from "@studio-freight/lenis";

	const accordionDuration = 1;
	const accordionEasing = "ease-in-out";

	let loading = false;
	let pinnedTitle: HTMLElement;
	let openedAccordion: PlaceCategory | null;
	let places: Map<PlaceCategory, PlaceData[]> = new Map();

	let animations: gsap.core.Tween[] = [];

	let scrollbarContainer: HTMLElement;

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

		if (scrollbarContainer) {
			initScrollTriggers();
		}
		return () => lenis.destroy();
	});

	onDestroy(() => {
		animations.map(animation => animation.kill());
	});

	const initScrollTriggers = () => {
		gsap.to(pinnedTitle, {
				scrollTrigger: {
					pin: true,
					trigger: pinnedTitle,
					start: "top +=20%",
					end: `${window.outerHeight * 3} +=45%`,
					invalidateOnRefresh: true, // to make it responsive
				},
			},
		);

		gsap.utils.toArray("section").forEach((section: unknown, i) => {
			let sectionElement = section as HTMLElement;
			let background: HTMLElement = sectionElement.querySelector(".bg")!;

			// Give the backgrounds some random images
			//background!.style.backgroundImage = `url(https://picsum.photos/1600/800?random=${i})`;

			// the first image (i === 0) should be handled differently because it should start at the very top.
			// use function-based values in order to keep things responsive
			animations.push(gsap.fromTo(background, {
				backgroundPosition: () => i ? `50% ${-window.innerHeight * getRatio(sectionElement)}px` : "50% 0px",
			}, {
				backgroundPosition: () => `50% ${window.innerHeight * (1 - getRatio(sectionElement))}px`,
				ease: "none",
				scrollTrigger: {
					trigger: sectionElement,
					start: () => i ? "top bottom" : "top top",
					end: "bottom top",
					scrub: true,
					invalidateOnRefresh: true, // to make it responsive
				},
			}));
		});
	};

	const getPlaces = () => {
		loading = true;
		console.log("Loading...");
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

	const getNonNullList = (placeData: PlaceData[] | undefined): PlaceData[] => {
		return placeData!;
	};

	const snakeCaseToSentenceCase = (str: string): string => {
		const words = str.toLowerCase().split("_");
		return words.map((word) => {
			if (word.length > 2) {
				return word[0].toUpperCase() + word.slice(1);
			}
		}).join(" ");
	};

	const getMapLink = (address: string): string => {
		console.log(`encoded: ${encodeURIComponent(address)}`);
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
	};

	const formatPhoneNumber = (phoneNumber: string) => {
		if (phoneNumber.length == 10) {
			return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
		}
		return phoneNumber;
	};

	const getRatio = (element: Element) => {
		return window.innerHeight / (window.innerHeight + element.clientHeight);
	};
</script>

<div class="places-page-container">
	<div class="main-title-container" bind:this={pinnedTitle}>
		<h1>The Venue</h1>
	</div>
	<div class="scrollbar-container" bind:this={scrollbarContainer}>
		<section>
			<div class="bg bg-image-1"></div>
		</section>
		<section>
			<div class="bg bg-image-2"></div>
		</section>
		<section>
			<div class="bg bg-image-3"></div>
		</section>
	</div>
	<div class="main-body-container">
		<p>We have chosen The Black Barn for our wedding venue. The Black Barn is a beautiful rustic but modern venue.
			Located away from the main Orlando area, it boasts 5 acres of agricultural land. The Black Barn has both beautiful
			greenery and modern architecture allowing us to enjoy the best of both worlds</p>
	</div>
	<div class="places-title-container">
		<h1>Nearby</h1>
	</div>
	<div class="places-accordion-container">
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
    }

    .main-title-container {
        width: 100%;
        z-index: 1;
        position: absolute;
        text-align: center;
    }

    .main-title-container h1 {
        isolation: isolate;
        font-family: "Parisienne", cursive;
        font-size: 4.5rem;
        color: white;
    }

    .scrollbar-container {
        height: 100vh;
        margin-bottom: 200vh;
    }

    .bg-image-1 {
        background: url("/black-barn-ceremony-hall.jpg");
    }

    .bg-image-2 {
        background: url("/black-barn-reception-hall.jpg");
    }

    .bg-image-3 {
        background: url("/window-hall.jpg");
    }

    .scrollbar-container section {
        position: relative;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .scrollbar-container .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .main-body-container {
        align-self: center;
        display: flex;
        width: 100%;
        font-family: Jost, sans-serif;
        text-align: center;
        max-width: max(600px, 50vw);
        font-size: 1.5rem;
    }

    .places-title-container {
        display: flex;
        justify-content: center;
        text-align: center;
    }

    .places-title-container h1 {
        font-family: "Parisienne", cursive;
        font-size: 4.5rem;
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