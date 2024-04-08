<script lang="ts">
	import NavBar from "$lib/NavBar.svelte";
	import "./styles.css";
	import { Svrollbar } from "svrollbar";
	import ContactFooter from "$lib/ContactFooter.svelte";
	import { onMount } from "svelte";

	import { page } from "$app/stores";

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
		{#if $page?.error}
			<div class="error-container">
				<h1>{$page.status}</h1>
				<p class="status">{$page.error.message}</p>
				{#if $page.status === 404}
					<p>How did you even get here?</p>
				{/if}
			</div>
		{:else}
			<slot />
		{/if}
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
        min-height: 100vh;
        height: fit-content;
    }

    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .error-container h1 {
        font-size: 8rem;
        margin-bottom: 20px;
    }

    .error-container p {
        font-size: 1.5rem;
        margin: 0;
    }

    .status {
        font-weight: bold;
        font-style: italic;
    }
</style>
