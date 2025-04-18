<script lang="ts">
	import '../app.css';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconHome from '@lucide/svelte/icons/home';
	import IconFood from '@lucide/svelte/icons/utensils';

	// State
	let value = $state('files');
	let { children } = $props();
  </script>

<div class="card border-surface-100-900 grid h-screen w-full grid-cols-[auto_1fr] border-[1px] overflow-hidden">
  <!-- Navigation Rail -->
  <Navigation.Rail {value} onValueChange={(newValue) => (value = newValue)}>
    {#snippet tiles()}
      <Navigation.Tile href="/" label="Home"><IconHome /></Navigation.Tile>
      <Navigation.Tile href="/foods" label="Foods"><IconFood /></Navigation.Tile>
    {/snippet}
  </Navigation.Rail>

  <!-- Main Content -->
  <div class="overflow-auto">
    {@render children()}
  </div>
</div>
