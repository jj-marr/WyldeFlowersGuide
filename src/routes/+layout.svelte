<script lang="ts">
	import '../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/stores';
	// Icons
	import IconHome from '@lucide/svelte/icons/home';
	import IconFood from '@lucide/svelte/icons/utensils';

	// State
	let value = $state('home');
	let { children } = $props();

	// Update active navigation item based on current path
	$effect(() => {
		const path = $page.url.pathname;
		if (path === '/') {
			value = 'home';
		} else if (path.startsWith('/foods')) {
			value = 'foods';
		}
	});
</script>

<div class="card border-surface-100-900 grid h-screen w-full grid-cols-[auto_1fr] border-[1px] overflow-hidden">
  <!-- Navigation Rail -->
  <Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
    {#snippet tiles()}
      <Navigation.Tile id="home" href="/" label="Home"><IconHome /></Navigation.Tile>
      <Navigation.Tile id="foods" href="/foods" label="Foods"><IconFood /></Navigation.Tile>
    {/snippet}
  </Navigation.Rail>

  <!-- Main Content -->
  <div class="overflow-auto">
    {@render children()}
  </div>
</div>
