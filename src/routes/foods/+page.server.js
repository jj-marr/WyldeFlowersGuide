/** @typedef {Object} Ingredient
 * @property {string} item - The ingredient name
 * @property {number} quantity - The quantity needed
 */

/** @typedef {Object} Recipe
 * @property {string} id - Recipe ID
 * @property {string} name - Recipe name
 * @property {string} description - Recipe description
 * @property {number} sellPrice - Selling price
 * @property {Ingredient[]} recipe - List of ingredients
 * @property {string} recipeCategory - Category of the recipe
 * @property {string} source - Where to get the recipe
 * @property {string} [favouriteOf] - Character who likes this recipe
 */

/** @returns {Promise<{recipes: Recipe[]}>} */
export async function load() {
  try {
    // Use Vite's import.meta.glob to import all JSON files at build time
    const recipeModules = /** @type {Record<string, any>} */ (
      import.meta.glob('../../../static/recipes/*.json', { eager: true })
    );

    // Process the imported modules into recipe objects
    const recipes = Object.entries(recipeModules).map(([path, moduleContent]) => {
      // Handle both default exports and direct exports
      const recipeData = /** @type {any} */ (moduleContent.default || moduleContent);
      const recipe = { ...recipeData };

      // Extract the filename from the path
      const filename = path.split('/').pop() || '';

      // Add the id based on filename
      recipe.id = filename.replace('.json', '');
      return recipe;
    });

    return { recipes };
  } catch (error) {
    console.error('Error loading recipes:', error);
    return { recipes: [] };
  }
}
