import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Alert } from 'react-native';
import { child, push, ref, remove, update, onValue } from 'firebase/database';
import { db, RECIPES_REF } from './firebase/config';
import { useState, useEffect } from 'react';

export default function App() {
  const [newRecipe, setNewRecipe] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [newInstuctions, setNewInstructions] = useState('');

  const addNewRecipe = () => {
    if (newRecipe.trim() !== "") {
      const newRecipeItem = {
        recipeName: newRecipe,
        ingredients: newIngredient,
        instructions: newInstuctions
      };
      const newRecipeItemRef = push(ref(db, RECIPES_REF), newRecipeItem);
      const newRecipeItemKey = newRecipeItemRef.key;
      setNewRecipe('');
      setNewIngredient('');
      setNewInstructions('');
      return newRecipeItemKey;
    }
  }

  const removeRecipe = (recipeKey) => {
    const updates = {};
    updates[`${RECIPES_REF}/${recipeKey}`] = null; // set the value to null to delete the node
    update(ref(db), updates);
  };

  useEffect(() => {
    const recipesRef = ref(db, RECIPES_REF);
    onValue(recipesRef, (snapshot) => {
      const recipesObject = snapshot.val();
      if (recipesObject) {
        const recipesList = Object.entries(recipesObject).map(([key, value]) => ({
          key,
          ...value,
        }));
        setRecipes(recipesList);
      } else {
        setRecipes([]);
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Recipe Adding App</Text>
      <TextInput
        placeholder='Add a recipe'
        value={newRecipe}
        onChangeText={setNewRecipe}
      />
      <TextInput
        placeholder='Add Ingredients'
        value={newIngredient}
        onChangeText={setNewIngredient}
      />
      <TextInput
        placeholder='Add instructions'
        value={newInstuctions}
        onChangeText={setNewInstructions}
      />
      <Button
        title="Add Recipe"
        onPress={() => addNewRecipe()}
      />
      {recipes.map((recipe) => (
        <View key={recipe.key} style={styles.recipeContainer}>
          <Text>{recipe.recipeName}</Text>
          <Button
            title="Remove"
            onPress={() => removeRecipe(recipe.key)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  }
});
