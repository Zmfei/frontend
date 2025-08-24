import { CellClassificationModule } from "@/components/advanced-analysis/cell-classification-module"

export default function CellClassificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cell Classification</h1>
          <p className="text-gray-600">Classify cell types from single-cell RNA sequencing data using marker genes</p>
        </div>

        <CellClassificationModule />
      </div>
    </div>
  )
}
