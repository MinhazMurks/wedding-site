<script>
	export const prerender = true;

	let minuteNow = new Date().getMinutes();
	console.log(minuteNow);
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Minnie Wedding" />
</svelte:head>

<section>
	<div class="title-container" style="--minute-now: {minuteNow}">
		<div class="shadow">
			Jennie + Minhaz
		</div>
		<div class="front">
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
        font-family: 'Gnomon-Simple', serif;
        font-size: 10em;
        color: #ffffff;
        position: absolute;
        font-variation-settings: "TOTD" 0, "DIST" 0;
    }

    .shadow {
        font-family: 'Gnomon-Web', serif;
        font-size: 10em;
        position: absolute;
        color: #000000;
				font-variation-settings: "TOTD" var(--minute-now), "DIST" 200;
    }
</style>
