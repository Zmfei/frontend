import { SearchAndFilterArea } from "@/components/database/search-and-filter-area"
import { DataDisplayArea } from "@/components/database/data-display-area"
import { VisualizationArea } from "@/components/database/visualization-area"

export default function DatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marker Gene Database</h1>
          <p className="text-gray-600">Interactive search and visualization platform for marker gene knowledge</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchAndFilterArea />
          </div>
          <div className="lg:col-span-3">
            <DataDisplayArea />
          </div>
        </div>

        <div className="mt-8">
          <VisualizationArea />
        </div>
      </div>
    </div>
  )
}
