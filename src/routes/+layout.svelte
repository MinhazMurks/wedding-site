<script lang="ts">
	import NavBar from '$lib/NavBar.svelte';
	import './styles.css';
	import { Svrollbar } from "svrollbar";
</script>


<div class="app">
	<NavBar />
		<main>
				<slot />
			<Svrollbar />
		</main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
				width: 100vw;
				min-height: 100vh;

        background: rgb(143,7,7);
        background: linear-gradient(209deg, rgba(143,7,7,1) 20%, rgba(78,18,18,1) 75%);
        --svrollbar-thumb-background: black;
    }


    main {
        margin-top: 10vh;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        box-sizing: border-box;
				width: 100%;
				height: 100%;
    }
</style>
