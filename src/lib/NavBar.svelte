<script lang="ts">
	import { page } from "$app/stores";
	import { base } from "$app/paths";

	const getSelected = (page: string): string => {
		return $page.url.pathname === `/${page}` ? "selected" : "";
	};
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="{base}/">Home</a>
			</li>
			<li aria-current={$page.url.pathname === '/places' ? 'page' : undefined}>
				<a href="{base}/places">Destination</a>
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
        width: 100vw;
        height: 10vh;
        background: rgb(0, 0, 0);
        position: fixed;
        font-size: calc(10px + 2vmin);
        z-index: 100;
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
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 0.5rem;
        color: var(--color-text);
        font-weight: 500;
        font-size: 0.8rem;
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
