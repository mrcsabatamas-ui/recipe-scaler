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
    <div className="bg-white rounded-xl shadow-xl p-6 space-y-8">
      {/* Cím */}
      <h2 className="text-3xl font-bold text-center text-blue-700">
        Recipe Scaler
      </h2>

      {/* Adagszám beállítás */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Eredeti adag szám
          </label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Új adag szám
          </label>
          <input
            type="number"
            value={targetServings}
            onChange={(e) => setTargetServings(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Hozzávalók lista */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Hozzávalók
        </h3>
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {ingredients.map((ing) => (
            <li
              key={ing.name}
              className="flex justify-between items-center py-3 px-4 bg-white hover:bg-blue-50 transition"
            >
              <span className="font-medium text-gray-700">{ing.name}</span>
              <span className="text-gray-900 font-semibold">
                {((ing.amount / servings) * targetServings).toFixed(1)} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Gomb */}
      <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-700 transition">
        Új mennyiségek kiszámítása
      </button>
    </div>
  );
}
