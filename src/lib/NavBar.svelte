<script lang="ts">
	import { page } from "$app/stores";
	import { base } from "$app/paths";

</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="{base}/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/destination' ? 'page' : undefined}>
				<a href="{base}/destination">Destination</a>
			</li>
			<li aria-current={$page.url.pathname === '/registry' ? 'page' : undefined}>
				<a href="{base}/registry">Registry</a>
			</li>
			<li aria-current={$page.url.pathname === '/itinerary' ? 'page' : undefined}>
				<a href="{base}/itinerary">Itinerary</a>
			</li>
			<li aria-current={$page.url.pathname === '/rsvp' ? 'page' : undefined}>
				<a href="{base}/rsvp">RSVP</a>
			</li>
		</ul>
	</nav>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        font-family: "Jost", sans-serif;
        font-optical-sizing: auto;
    }

    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgb(0, 0, 0);
        font-size: calc(10px + 2vmin);
        z-index: 200;
        position: fixed;
        width: 100vw;

        min-height: 50px;
        height: 10vh;
        max-height: 70px;
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background-size: contain;
    }

    li {
        position: relative;
        height: 100%;
        padding: 5px;
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        color: var(--color-text);
        font-weight: 500;
        font-size: min(0.8rem, 3vw);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear, font-weight .4s ease-in-out;
    }

    li[aria-current='page'] a {
        font-weight: 1000;
        color: white;
    }

    a:hover {
        color: var(--color-theme-1);
    }
</style>
