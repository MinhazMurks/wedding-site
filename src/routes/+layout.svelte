<script>
	import NavBar from './NavBar.svelte';
	import './styles.css';
</script>

<div class="app">
	<NavBar />

	<main>
		<slot />
	</main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        background: rgb(143,7,7);
        background: linear-gradient(209deg, rgba(143,7,7,1) 20%, rgba(78,18,18,1) 75%);
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
