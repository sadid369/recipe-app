import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import axios from "axios";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recipe");
        setRecipes(response.data);

        // console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/recipe/savedRecipes/ids/${userID} `
        );
        setSavedRecipes(response.data.savedRecipes);

        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipe();
    if (cookies.access_token) fetchSavedRecipe();
  }, []);
  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/recipe",
        {
          recipeID,
          userID,
        },
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.log(error);
    }
  };
  const isRecipeSaved = (id) => savedRecipes.includes(id);
  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              {!cookies.access_token ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    saveRecipe(recipe._id);
                  }}
                  disabled={isRecipeSaved(recipe._id)}
                >
                  {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                </button>
              )}
            </div>
            <div className="instructions">
              <p>{recipe.instruction}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} (minutes)</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
