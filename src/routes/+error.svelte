<script lang="ts">
	import { page } from "$app/stores";

	$: error = $page.error as Error;
</script>

<div class="error-page-container">
	<h1 class="text-8xl">{$page.status}</h1>
	<p class="text-2xl">{error.message}</p>
	{#if $page.status === 404}
		<p class=" text-red-400 mt-12">How did you even get here?</p>
		<p class="mt-3">
		</p>
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