<script>
	export const prerender = true;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Minnie Wedding" />
</svelte:head>

<section>
	<div class="title-container">
		<div class="front">
			Jennie + Minhaz
		</div>
		<div class="shadow">
			Jennie + Minhaz
		</div>
	</div>
</section>

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

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    .title-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .front {
        font-family: 'Gnomon-Web', serif;
        font-size: 10em;
        color: black;
        position: absolute;
    }

    .shadow {
        z-index: -1;
        font-family: 'Gnomon-Simple', serif;
        font-size: 10em;
        position: absolute;
        color: red;
    }
</style>
