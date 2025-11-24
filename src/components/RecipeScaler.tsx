import { useState } from "react";

export default function RecipeScaler() {
  const [servings, setServings] = useState(4);
  const [targetServings, setTargetServings] = useState(8);

  const ingredients = [
    { name: "Liszt", amount: 200, unit: "g" },
    { name: "Só", amount: 5, unit: "g" },
    { name: "Víz", amount: 100, unit: "ml" },
  ];

  return (
    <div className="space-y-6">
      {/* Adagszám beállítás */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eredeti adagszám
          </label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Új adagszám
          </label>
          <input
            type="number"
            value={targetServings}
            onChange={(e) => setTargetServings(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Összetevők listája */}
      <div className="bg-gray-50 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Hozzávalók
        </h2>
        <ul className="divide-y divide-gray-200">
          {ingredients.map((ing, i) => (
            <li
              key={ing.name}
              className={`flex justify-between py-2 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-100"
              } px-2 rounded`}
            >
              <span className="font-medium">{ing.name}</span>
              <span className="text-gray-700">
                {((ing.amount / servings) * targetServings).toFixed(1)}{" "}
                {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
