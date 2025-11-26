import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

type Ingredient = { name: string; amount: number; unit: string };
type Recipe = {
  id: string;
  name: string;
  servings: number | null;
  target_servings: number | null;
  ingredients: Ingredient[];
};

export default function RecipeScaler() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);

  // Betöltés Supabase-ből
  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase.from("recipes").select("*");
      if (!error && data && data.length > 0) {
        setRecipes(data as Recipe[]);
        setCurrentRecipe(data[0] as Recipe); // első recept automatikusan kiválasztva
      } else {
        setRecipes([]);
        setCurrentRecipe(null);
      }
    };
    fetchRecipes();
  }, []);

  // Új recept hozzáadása
  const addRecipe = async (name: string) => {
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          name,
          servings: null,
          target_servings: null,
          ingredients: [],
        },
      ])
      .select();

    if (error) {
      console.error("Insert error:", error.message);
      alert("Hiba történt: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      const newRecipe = data[0] as Recipe;
      setRecipes((prev) => [...prev, newRecipe]);
      setCurrentRecipe(newRecipe);
    }
  };

  // Recept frissítése
  const updateRecipe = async (updated: Recipe) => {
    const { error } = await supabase
      .from("recipes")
      .update({
        name: updated.name,
        servings: updated.servings,
        target_servings: updated.target_servings,
        ingredients: updated.ingredients,
      })
      .eq("id", updated.id);
    if (!error) {
      setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setCurrentRecipe(updated);
    }
  };

  // Recept törlése
  const deleteRecipe = async (id: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) {
      const remaining = recipes.filter((r) => r.id !== id);
      setRecipes(remaining);
      setCurrentRecipe(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Hozzávalók kezelése
  const addIngredient = () => {
    if (!currentRecipe) return;
    const updated: Recipe = {
      ...currentRecipe,
      ingredients: [
        ...currentRecipe.ingredients,
        { name: "", amount: 0, unit: "" },
      ],
    };
    updateRecipe(updated);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    if (!currentRecipe) return;
    const newIngredients = [...currentRecipe.ingredients];
    (newIngredients[index] as any)[field] = value;
    const updated: Recipe = { ...currentRecipe, ingredients: newIngredients };
    updateRecipe(updated);
  };

  const deleteIngredient = (index: number) => {
    if (!currentRecipe) return;
    const newIngredients = currentRecipe.ingredients.filter((_, i) => i !== index);
    const updated: Recipe = { ...currentRecipe, ingredients: newIngredients };
    updateRecipe(updated);
  };

  // Ha nincs recept
  if (!currentRecipe) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 mb-4">Nincs kiválasztott recept</p>
        <button
          onClick={() => {
            const name = prompt("Új recept neve:");
            if (name) addRecipe(name);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          + Új recept
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-[550px] mx-auto bg-white rounded-xl shadow-xl p-6 space-y-8">

      <h2 className="text-3xl font-bold text-center text-gray-700">Recipe Scaler</h2>

      {/* Recept választó */}
      <div className="flex items-center gap-4">
        <select
          value={currentRecipe.id}
          onChange={(e) =>
            setCurrentRecipe(recipes.find((r) => r.id === e.target.value) || null)
          }
          className="border rounded px-2 py-1"
        >
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            const name = prompt("Új recept neve:");
            if (name) addRecipe(name);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          + Új recept
        </button>
        <button
          onClick={() => deleteRecipe(currentRecipe.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
        >
          Recept törlése
        </button>
      </div>

      {/* Adagszám beállítás */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Eredeti adagszám
          </label>
          <input
            type="number"
            step="any"
            value={currentRecipe.servings ?? ""}
            onChange={(e) =>
              updateRecipe({
                ...currentRecipe,
                servings:
                  e.target.value === "" ? null : parseFloat(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Új adagszám
          </label>
          <input
            type="number"
            step="any"
            value={currentRecipe.target_servings ?? ""}
            onChange={(e) =>
              updateRecipe({
                ...currentRecipe,
                target_servings:
                  e.target.value === "" ? null : parseFloat(e.target.value),
              })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Hozzávalók szerkesztése */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hozzávalók megadása</h3>
        <ul className="space-y-3">
          {currentRecipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center gap-3 flex-nowrap">
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                placeholder="Név"
                className="w-36 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="number"
                step="any"
                value={ing.amount ?? ""}
                onChange={(e) =>
                  updateIngredient(
                    i,
                    "amount",
                    e.target.value === "" ? 0 : parseFloat(e.target.value)
                  )
                }
                placeholder="Mennyiség"
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                placeholder="Egység (pl. g, ml)"
                className="w-36 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                onClick={() => deleteIngredient(i)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
              >
                ✕

  </button>
</li>

          ))}
        </ul>
        <button
          onClick={addIngredient}
          className="mt-4 bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
        >
          + Hozzávaló
        </button>
      </div>

      {/* Skálázott mennyiségek */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Hozzávalók új adagszámhoz
        </h3>
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {currentRecipe.ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex justify-between items-center py-3 px-4 bg-white hover:bg-blue-50 transition"
            >
              <span className="font-medium text-gray-700">
                {ing.name || "—"}
              </span>
              <span className="text-gray-900 font-semibold">
                {currentRecipe.servings &&
                currentRecipe.target_servings &&
                ing.amount > 0
                  ? (
                      (ing.amount / currentRecipe.servings) *
                      currentRecipe.target_servings
                    ).toFixed(2)
                  : "—"}{" "}
                {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
