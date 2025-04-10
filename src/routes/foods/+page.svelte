<script lang="ts">
  /** @type {import('./$types').PageData} */
  export let data;

  let recipes = data.recipes || [];
  let searchTerm = '';
  let sortBy = 'recipeCategory';
  let sortOrder = 'asc';

  // Define TypeScript interfaces
  interface Ingredient {
    item: string;
    quantity: number;
  }

  interface Recipe {
    id: string;
    name: string;
    description: string;
    sellPrice: number;
    recipe: Ingredient[];
    recipeCategory: string;
    source: string;
    favouriteOf?: string;
  }

  function toggleSort(field: string): void {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'asc';
    }
  }

  // Filtered recipes based on search
  $: filteredRecipes = recipes.filter((recipe: Recipe) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term) ||
      recipe.recipeCategory?.toLowerCase().includes(term) ||
      recipe.source?.toLowerCase().includes(term) ||
      recipe.favouriteOf?.toLowerCase().includes(term) ||
      recipe.recipe?.some((ingredient: Ingredient) => ingredient.item.toLowerCase().includes(term))
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

    // Handle string values
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

<div class="max-w-4xl mx-auto p-4 space-y-6">
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
        class="chip {sortBy === 'sellPrice' ? 'preset-filled-primary-500' : 'preset-tonal'}"
        on:click={() => toggleSort('sellPrice')}
      >
        Price {sortBy === 'sellPrice' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
      </button>
      <button
        class="chip {sortBy === 'recipeCategory' ? 'preset-filled-primary-500' : 'preset-tonal'}"
        on:click={() => toggleSort('recipeCategory')}
      >
        Category {sortBy === 'recipeCategory' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
      </button>
    </div>
  </div>

  <div class="card preset-filled-surface-100-900 p-4 mb-4">
    <p>
      {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
      {searchTerm ? `for "${searchTerm}"` : ''}
    </p>
  </div>

  {#if filteredRecipes.length === 0}
    <div class="card preset-filled-surface-100-900 p-4 text-center">
      <p>No matching recipes found</p>
    </div>
  {:else if searchTerm.trim()}
    <!-- When searching, show a flat list without category headers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each sortedRecipes as recipe}
        <article class="card preset-filled-surface-100-900 p-4">
          <header class="flex justify-between items-start mb-2">
            <h3 class="h3">{recipe.name}</h3>
            <span class="chip preset-filled-primary-500">${recipe.sellPrice}</span>
          </header>

          <p class="opacity-75 mb-4">{recipe.description}</p>

          <div class="grid grid-cols-2 gap-2 text-sm mb-4">
            <div class="flex items-center gap-1">
              <span>🍳</span>
              <span>{recipe.recipeCategory}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>📚</span>
              <span>{recipe.source}</span>
            </div>
            {#if recipe.favouriteOf}
              <div class="flex items-center gap-1 col-span-2">
                <span>❤️</span>
                <span>{recipe.favouriteOf}'s favourite</span>
              </div>
            {/if}
          </div>

          {#if recipe.recipe && recipe.recipe.length > 0}
            <div class="mb-2">
              <h4 class="font-bold">Recipe:</h4>
              <ul class="list-disc list-inside">
                {#each recipe.recipe as ingredient}
                  <li>{ingredient.quantity} {ingredient.item}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </article>
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
            {#each recipesByCategory[category] as recipe}
              <article class="card preset-filled-surface-100-900 p-4">
                <header class="flex justify-between items-start mb-2">
                  <h3 class="h3">{recipe.name}</h3>
                  <span class="chip preset-filled-primary-500">${recipe.sellPrice}</span>
                </header>

                <p class="opacity-75 mb-4">{recipe.description}</p>

                <div class="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div class="flex items-center gap-1">
                    <span>🍳</span>
                    <span>{recipe.recipeCategory}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>📚</span>
                    <span>{recipe.source}</span>
                  </div>
                  {#if recipe.favouriteOf}
                    <div class="flex items-center gap-1 col-span-2">
                      <span>❤️</span>
                      <span>{recipe.favouriteOf}'s favourite</span>
                    </div>
                  {/if}
                </div>

                {#if recipe.recipe && recipe.recipe.length > 0}
                  <div class="mb-2">
                    <h4 class="font-bold">Recipe:</h4>
                    <ul class="list-disc list-inside">
                      {#each recipe.recipe as ingredient}
                        <li>{ingredient.quantity} {ingredient.item}</li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              </article>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}
</div>
