<script lang="ts">
  import { Switch } from '@skeletonlabs/skeleton-svelte';
  import type { Recipe } from '$lib/types'; // Import the shared Recipe type

  // Props
  export let recipe: Recipe;
  export let updateRecipeStatus: (recipeId: string, property: 'cooked' | 'gifted', value: boolean) => void;

</script>

<article class="card preset-filled-surface-100-900 p-4 h-full flex flex-col">
  <header class="flex justify-between items-start mb-2">
    <h3 class="h3">{recipe.name}</h3>
    <div class="flex gap-2 flex-shrink-0">
      <Switch
        name={`cooked-${recipe.id}`}
        checked={recipe.cooked}
        onCheckedChange={(e) => updateRecipeStatus(recipe.id, 'cooked', e.checked)}
        compact
        controlActive="bg-success-500"
      >
        {#snippet inactiveChild()}🍳{/snippet}
        {#snippet activeChild()}✅{/snippet}
      </Switch>
      {#if recipe.favouriteOf}
        <Switch
          name={`gifted-${recipe.id}`}
          checked={recipe.gifted}
          onCheckedChange={(e) => updateRecipeStatus(recipe.id, 'gifted', e.checked)}
          compact
          controlActive="bg-tertiary-500"
        >
          {#snippet inactiveChild()}🎁{/snippet}
          {#snippet activeChild()}🎀{/snippet}
        </Switch>
      {/if}
    </div>
  </header>

  <p class="opacity-75 mb-4 flex-grow">{recipe.description}</p>

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
      <ul class="list-disc list-inside text-sm">
        {#each recipe.recipe as ingredient (ingredient.item)} <!-- Add key for better reactivity -->
          <li>{ingredient.quantity} {ingredient.item}</li>
        {/each}
      </ul>
    </div>
  {/if}
</article>
