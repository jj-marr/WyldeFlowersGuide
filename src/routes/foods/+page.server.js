import fs from 'fs';
import path from 'path';

export function load() {
  try {
    // Path to the recipes directory
    const recipesDir = path.join(process.cwd(), 'static', 'recipes');

    // Read all JSON files in the directory
    const recipeFiles = fs.readdirSync(recipesDir)
      .filter(file => file.endsWith('.json'));

    // Load and parse each JSON file
    const recipes = recipeFiles.map(file => {
      const filePath = path.join(recipesDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const recipe = JSON.parse(fileContent);

      // Add the id based on filename
      recipe.id = file.replace('.json', '');
      return recipe;
    });

    return { recipes };
  } catch (error) {
    console.error('Error loading recipes:', error);
    return { recipes: [] };
  }
}
