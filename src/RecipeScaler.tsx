import { useState } from "react";

export default function RecipeScaler() {
  const [servings, setServings] = useState(2);

  const ingredients = [
    { name: "Liszt", amount: 200, unit: "g" },
    { name: "Só", amount: 5, unit: "g" },
    { name: "Víz", amount: 100, unit: "ml" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-medium text-gray-700">Adagszám:</label>
        <input
          type="number"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="w-20 border rounded px-2 py-1 text-center"
        />
      </div>

      <ul className="space-y-2">
        {ingredients.map((ing) => (
          <li
            key={ing.name}
            className="flex justify-between border-b pb-1 text-gray-800"
          >
            <span>{ing.name}</span>
            <span>
              {((ing.amount / 2) * servings).toFixed(1)} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
