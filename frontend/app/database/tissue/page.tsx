"use client"

import { useState } from "react"
import { SearchAndFilterArea } from "@/components/database/search-and-filter-area"
import { DataDisplayArea } from "@/components/database/data-display-area"
import { VisualizationArea } from "@/components/database/visualization-area"

export default function DatabaseTissuePage() {
  const [records, setRecords] = useState<any[]>([])
  const [currentFilters, setCurrentFilters] = useState<{ species?: string; year?: string }>({})

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tissue-Specific Marker Genes</h1>
          <p className="text-gray-600">Interactive search and visualization platform for marker gene knowledge</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchAndFilterArea onSearch={(res) => { setRecords(res); if (res.length > 0) { const first = res[0]; setCurrentFilters({ species: first.species_name, year: String(first.publication_year ?? "") }) } }} />
          </div>
          <div className="lg:col-span-3">
            <DataDisplayArea records={records} />
          </div>
        </div>

        <div className="mt-8">
          <VisualizationArea species={currentFilters.species} year={currentFilters.year} />
        </div>
      </div>
    </div>
  )
}
