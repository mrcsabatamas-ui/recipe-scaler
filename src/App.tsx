import RecipeScaler from "./RecipeScaler";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Recipe Scaler
        </h1>

        {/* Teszt sor a Tailwind ellenőrzéshez */}
        <h1 className="text-6xl text-red-600">Tailwind működik!</h1>

        <RecipeScaler />
      </div>
    </div>
  );
}
