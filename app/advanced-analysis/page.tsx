import { CellClassificationModule } from "@/components/advanced-analysis/cell-classification-module"

export default function AdvancedAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analysis</h1>
          <p className="text-gray-600">Comprehensive analysis tools for downstream bioinformatics tasks</p>
        </div>

        <div className="space-y-8">
          <CellClassificationModule />

          {/* Placeholder for future modules */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Gene Set Enrichment</h3>
              <p className="text-gray-500">Coming Soon</p>
            </div>
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Pathway Analysis</h3>
              <p className="text-gray-500">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
