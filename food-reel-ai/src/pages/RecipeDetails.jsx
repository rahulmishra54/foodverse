import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Clock, Flame, BarChart3, Star, Bookmark } from 'lucide-react'
import { getItemImage } from '@/utils/format'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { getFoodById } from '@/services/foodService'

export default function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getFoodById(id)
        setRecipe(response?.data?.foodItem || null)
      } catch (error) {
        console.error('Recipe details failed', error)
        setRecipe(null)
      }
    }

    fetchRecipe()
  }, [id])

  if (!recipe) {
    return <div className="px-4 py-6 text-sm text-white/50">Loading recipe...</div>
  }

  return (
    <div>
      <div className="relative">
        <img src={getItemImage(recipe) || 'https://via.placeholder.com/600x400?text=Recipe'} className="h-56 w-full object-cover" alt={recipe.name} />
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
          <ChevronLeft size={20} />
        </button>
        <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur">
          <Bookmark size={18} />
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-xl font-semibold">{recipe.name}</h1>
        <p className="mt-1 text-sm text-white/50">{recipe.description}</p>

        <Link to={recipe?.foodPartner?._id ? `/profile/${recipe.foodPartner._id}` : '/profile'} className="mt-3 flex items-center gap-2">
          <Avatar src={recipe?.foodPartner?.profilePicture || 'https://i.pravatar.cc/150?img=12'} size={30} verified />
          <span className="text-sm text-white/70">{recipe?.foodPartner?.restaurantName || recipe?.foodPartner?.ownerName || recipe?.foodPartner?.name || 'Food Partner'}</span>
        </Link>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            [Clock, recipe.cookingTime || recipe.prepTime || 'N/A', 'Time'],
            [Flame, recipe.calories || 0, 'Cal'],
            [BarChart3, recipe.difficulty || 'N/A', 'Level'],
            [Star, 4.8, 'Rating'],
          ].map(([Icon, v, l]) => (
            <Card key={l} className="flex flex-col items-center gap-1 p-3">
              <Icon size={16} className="text-primary" />
              <span className="text-xs font-semibold">{v}</span>
              <span className="text-[10px] text-white/40">{l}</span>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-white/80">Ingredients</h3>
          <div className="space-y-2">
            {(recipe.ingredients || []).map((ing) => (
              <label key={ing} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-white/70">
                <input type="checkbox" className="accent-primary" /> {ing}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-white/80">Steps</h3>
          <ol className="space-y-3">
            {(recipe.recipeSteps || []).map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3 text-sm text-white/70">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
