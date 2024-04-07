<script lang="ts">
	import { page } from "$app/stores";

	$: error = $page.error as Error;
</script>

<div class="error-page-container">
	<h1>{$page.status}</h1>
	<p>{error.message}</p>
	{#if $page.status === 404}
		<p>How did you even get here?</p>
	{/if}
</div>

<style>
    .error-page-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .error-page-container h1 {
        font-size: 8rem;
    }

    .error-page-container p {
        padding: 0;
        margin: 0;
    }
</style>