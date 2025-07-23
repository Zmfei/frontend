import { SearchAndFilterArea } from "@/components/database/search-and-filter-area"
import { DataDisplayArea } from "@/components/database/data-display-area"
import { VisualizationArea } from "@/components/database/visualization-area"

export default function DatabasePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">GeneExplore</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="/paper-analysis" className="text-gray-600 hover:text-blue-600 transition-colors">
                Analysis
              </a>
              <a href="/advanced-analysis" className="text-gray-600 hover:text-blue-600 transition-colors">
                Advanced
              </a>
            </nav>
          </div>
        </div>
      </header>

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
