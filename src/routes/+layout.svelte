<script lang="ts">
	import NavBar from "$lib/NavBar.svelte";
	import "./styles.css";
	import { Svrollbar } from "svrollbar";
	import ContactFooter from "$lib/ContactFooter.svelte";
	import { onMount } from "svelte";

	let navBarContainer: HTMLElement;
	let mainContainer: HTMLElement;

	onMount(() => {
		const elements = navBarContainer.getElementsByTagName("nav");
		if (elements.length > 0 && elements.item(0)) {
			mainContainer.style.marginTop = `${elements.item(0)!.offsetHeight}px`;
		}
	});

</script>


<div class="app">
	<div bind:this={navBarContainer}>
		<NavBar />
	</div>
	<main bind:this={mainContainer}>
		<slot />
		<Svrollbar />
	</main>
	<ContactFooter />
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;

        min-height: 100vh;

        background: rgb(143, 7, 7);
        background: linear-gradient(209deg, rgba(143, 7, 7, 1) 20%, rgba(78, 18, 18, 1) 75%);
        --svrollbar-thumb-background: black;
    }

    main {
        margin-top: 10vh;
        min-height: 100vh;
        height: fit-content;
    }
</style>
