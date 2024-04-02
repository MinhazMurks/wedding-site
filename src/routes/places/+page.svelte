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
	let openedAccordion: PlaceCategory | null;
	let places: Map<PlaceCategory, PlaceData[]> = new Map();


	let scrollbarContainer: HTMLElement;
	let section1: HTMLElement;
	let image1: HTMLElement;
	let section2: HTMLElement;
	let image2: HTMLElement;
	let section3: HTMLElement;
	let image3: HTMLElement;
	let section4: HTMLElement;
	let image4: HTMLElement;

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
			initScrollTrigges();
		}
		return () => lenis.destroy();
	});

	const initScrollTrigges = () => {
		let getRatio = el: HtmlElement => window.innerHeight / (window.innerHeight + el.offsetHeight);

		gsap.utils.toArray("section").forEach((section, i) => {
			section.bg = section.querySelector(".bg");

			// Give the backgrounds some random images
			section.bg.style.backgroundImage = `url(https://picsum.photos/1600/800?random=${i})`;

			// the first image (i === 0) should be handled differently because it should start at the very top.
			// use function-based values in order to keep things responsive
			gsap.fromTo(section.bg, {
				backgroundPosition: () => i ? `50% ${-window.innerHeight * getRatio(section)}px` : "50% 0px",
			}, {
				backgroundPosition: () => `50% ${window.innerHeight * (1 - getRatio(section))}px`,
				ease: "none",
				scrollTrigger: {
					trigger: section,
					start: () => i ? "top bottom" : "top top",
					end: "bottom top",
					scrub: true,
					invalidateOnRefresh: true, // to make it responsive
				},
			});

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
</script>

<div class="places-page-container">
	<div class="scrollbar-container" bind:this={scrollbarContainer}>
		<section>
			<div class="bg"></div>
			<h1>Simple parallax sections</h1>
		</section>
		<section>
			<div class="bg"></div>
			<h1>Hey look, a title</h1>
		</section>
		<section>
			<div class="bg"></div>
			<h1>They just keep coming</h1>
		</section>
		<section>
			<div class="bg"></div>
			<h1>So smooth though</h1>
		</section>
		<section>
			<div class="bg"></div>
			<h1>Nice, right?</h1>
		</section>
	</div>
	<div class="places-title-container">
		<h1>The Venue</h1>
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

    .scrollbar-container {
        height: 100vh;
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
        z-index: -1;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .scrollbar-container h1 {
        color: white;
        text-shadow: 1px 1px 3px black;
        z-index: 1;
        font-size: 3em;
        font-weight: 400;
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