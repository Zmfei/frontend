"use client"

import { useState } from "react"
import { SearchAndFilterArea } from "@/components/database/search-and-filter-area"
import { DataDisplayArea } from "@/components/database/data-display-area"

export default function SearchPage() {
  const [records, setRecords] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marker Search</h1>
          <p className="text-gray-600">Interactive search and visualization platform for marker gene knowledge</p>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8">
          <SearchAndFilterArea onSearch={setRecords} />
        </div>

        {/* Search Results Section */}
        <div>
          <DataDisplayArea records={records} />
        </div>
      </div>
    </div>
  )
}
