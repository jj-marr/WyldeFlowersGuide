<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import RecipeCard from '$lib/RecipeCard.svelte'; // Import the new component
  // Import shared types
  import type { Recipe, AllRecipeStatuses, RecipeStatus } from '$lib/types';

  /** @type {import('./$types').PageData} */
  export let data;

  const RECIPE_STATUS_KEY = 'wyldeFlowersRecipeStatus'; // More unique key

  // Ensure data.recipes exists and add cooked/gifted properties
  let recipes: Recipe[] = Array.isArray(data?.recipes) ? data.recipes.map((recipe: any) => ({ // Use 'any' temporarily for mapping if Recipe type isn't fully defined here anymore
    ...recipe,
    cooked: recipe.cooked ?? false, // Keep default values
    gifted: recipe.gifted ?? false, // Keep default values
  })) : [];


  let searchTerm = '';
  let sortBy: keyof Recipe = 'recipeCategory'; // Explicitly type sortBy
  let sortOrder = 'asc';
  let hideCooked = false; // Track whether to hide cooked recipes
  let hideGifted = false; // Track whether to hide gifted recipes and non-favourites

  // Load status from localStorage on mount
  onMount(() => {
    if (browser) {
      const savedStatusesRaw = localStorage.getItem(RECIPE_STATUS_KEY);
      if (savedStatusesRaw) {
        try {
          const savedStatuses: AllRecipeStatuses = JSON.parse(savedStatusesRaw);
          // Create a new array to trigger reactivity
          recipes = recipes.map(recipe => {
            const saved = savedStatuses[recipe.id];
            return saved ? { ...recipe, cooked: saved.cooked, gifted: saved.gifted } : recipe;
          });
          console.log('Loaded recipe statuses from localStorage:', savedStatuses);
        } catch (e) {
          console.error("Failed to parse recipe statuses from localStorage", e);
          localStorage.removeItem(RECIPE_STATUS_KEY); // Clear corrupted data
        }
      }
    }
  });

  // Function to update a recipe's status and trigger reactivity
  function updateRecipeStatus(recipeId: string, property: 'cooked' | 'gifted', value: boolean): void {
    // Create a new array to trigger reactivity
    recipes = recipes.map(recipe =>
      recipe.id === recipeId
        ? { ...recipe, [property]: value }
        : recipe
    );

    // Save to localStorage immediately
    if (browser) {
      const statusesToSave: AllRecipeStatuses = recipes.reduce((acc, recipe) => {
        acc[recipe.id] = { cooked: recipe.cooked, gifted: recipe.gifted };
        return acc;
      }, {} as AllRecipeStatuses);

      try {
        localStorage.setItem(RECIPE_STATUS_KEY, JSON.stringify(statusesToSave));
        console.log('Recipe statuses saved to localStorage:', statusesToSave);
      } catch (e) {
        console.error('Failed to save recipe statuses to localStorage:', e);
      }
    }
  }

  function toggleSort(field: keyof Recipe): void {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'asc';
    }
  }

  // Filtered recipes based on search and filter settings
  $: filteredRecipes = recipes.filter((recipe) => {
    // Check if we should hide cooked recipes
    if (hideCooked && recipe.cooked) return false;

    // Check if we should hide gifted recipes or non-favourites
    if (hideGifted && (recipe.gifted || !recipe.favouriteOf)) return false;

    // Then apply search filter
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term) ||
      recipe.recipeCategory?.toLowerCase().includes(term) ||
      recipe.source?.toLowerCase().includes(term) ||
      recipe.favouriteOf?.toLowerCase().includes(term) ||
      recipe.recipe?.some((ingredient) => ingredient.item.toLowerCase().includes(term))
    );
  });

  // Sort the filtered recipes
  $: sortedRecipes = [...filteredRecipes].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    // Handle numeric values
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    }


    valueA = String(valueA || '').toLowerCase();
    valueB = String(valueB || '').toLowerCase();

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Group recipes by category
  $: recipesByCategory = sortedRecipes.reduce((groups, recipe) => {
    const category = recipe.recipeCategory || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(recipe);
    return groups;
  }, {} as Record<string, Recipe[]>);

  // Get sorted category names
  $: categories = Object.keys(recipesByCategory).sort();
</script>

<div class="max-w-4xl mx-auto p-4 space-y-6 h-full w-full">
  <header class="card preset-filled-primary-500 p-4 text-center">
    <h1 class="h1">Wylde Flowers Guide - Recipes</h1>
    <p class="opacity-75">Discover delicious recipes from Fairhaven</p>
  </header>

  <div class="card preset-filled-surface-100-900 p-4">
    <input
      type="text"
      bind:value={searchTerm}
      placeholder="Search recipes by name, ingredients, category, or character favourites..."
      class="input w-full"
    >

    <div class="flex flex-wrap gap-2 mt-4">
      <span class="font-bold">Sort by:</span>
      <button
        class="chip {sortBy === 'name' ? 'preset-filled-primary-500' : 'preset-tonal'}"
        on:click={() => toggleSort('name')}
      >
        Name {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
      </button>
      <button
        class="chip {sortBy === 'recipeCategory' ? 'preset-filled-primary-500' : 'preset-tonal'}"
        on:click={() => toggleSort('recipeCategory')}
      >
        Category {sortBy === 'recipeCategory' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
      </button>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
      <span class="font-bold">Filter:</span>
      <button
        class="chip {hideCooked ? 'preset-filled-success-500' : 'preset-tonal'}"
        on:click={() => hideCooked = !hideCooked}
      >
        {hideCooked ? 'Showing uncrafted only' : 'Showing cooked recipes'}
      </button>
      <button
        class="chip {hideGifted ? 'preset-filled-tertiary-500' : 'preset-tonal'}"
        on:click={() => hideGifted = !hideGifted}
      >
        {hideGifted ? 'Showing ungifted favourites only' : 'Showing gifted recipes'}
      </button>
    </div>
  </div>

  <div class="card preset-filled-surface-100-900 p-4 mb-4">
    <p>
      {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
      {searchTerm ? `for "${searchTerm}"` : ''}
      {hideCooked ? ' (hiding crafted recipes)' : ''}
      {hideGifted ? ' (hiding gifted recipes and non-favourites)' : ''}
    </p>
  </div>

  {#if filteredRecipes.length === 0}
    <div class="card preset-filled-surface-100-900 p-4 text-center">
      <p>No matching recipes found</p>
    </div>
  {:else if searchTerm.trim()}
    <!-- When searching, show a flat list without category headers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each sortedRecipes as recipe (recipe.id)}
        <RecipeCard {recipe} {updateRecipeStatus} />
      {/each}
    </div>
  {:else}
    <!-- When not searching, show recipes grouped by category with headers -->
    <div class="space-y-8">
      {#each categories as category}
        <section>
          <!-- Category Header -->
          <header class="card preset-filled-primary-500 p-2 mb-4">
            <h2 class="h2 text-center">{category}</h2>
          </header>

          <!-- Recipes Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each recipesByCategory[category] as recipe (recipe.id)}
               <RecipeCard {recipe} {updateRecipeStatus} />
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}
</div>
