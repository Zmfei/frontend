import { CellClassificationModule } from "@/components/advanced-analysis/cell-classification-module"

export default function AdvancedAnalysisPage() {
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
              <a href="/database" className="text-gray-600 hover:text-blue-600 transition-colors">
                Database
              </a>
              <a href="/paper-analysis" className="text-gray-600 hover:text-blue-600 transition-colors">
                Analysis
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analysis</h1>
          <p className="text-gray-600">Comprehensive analysis tools for genomic data and cell classification</p>
        </div>

        <div className="space-y-8">
          <CellClassificationModule />
        </div>
      </div>
    </div>
  )
}
