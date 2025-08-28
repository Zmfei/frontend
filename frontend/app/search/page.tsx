"use client"

import { useState, useEffect } from "react"
import { SearchAndFilterArea } from "@/components/database/search-and-filter-area"
import { DataDisplayArea } from "@/components/database/data-display-area"
import { GeneVisualization } from "@/components/database/gene-visualization"
import { DataVisualization } from "@/components/database/data-visualization"

export default function SearchPage() {
  const [records, setRecords] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Restore search state from sessionStorage on component mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('searchState')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        // Only restore if the state is recent (within 1 hour)
        if (state.timestamp && Date.now() - state.timestamp < 3600000) {
          setRecords(state.records || [])
          setHasSearched(state.hasSearched || false)
        }
      } catch (error) {
        console.error('Error restoring search state:', error)
      }
    }
  }, [])

  const handleSearch = (results: any[]) => {
    setRecords(results)
    setHasSearched(true)
    // Clear any stored state since we have new search results
    sessionStorage.removeItem('searchState')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Google-like centered search interface */}
      <div className={`transition-all duration-700 ease-in-out ${
        hasSearched ? 'pt-8' : 'flex items-center justify-center min-h-screen'
      }`}>
        <div className={`w-full max-w-4xl mx-auto px-4 transition-all duration-700 ease-in-out ${
          hasSearched ? '' : 'transform -translate-y-16'
        }`}>
          {/* Logo and Title - Only show when not searched or make smaller when searched */}
          <div className={`text-center transition-all duration-700 ease-in-out ${
            hasSearched ? 'mb-6' : 'mb-12'
          }`}>
            <h1 className={`font-light text-gray-700 transition-all duration-700 ease-in-out ${
              hasSearched ? 'text-2xl mb-2' : 'text-6xl mb-4'
            }`}>
              <span className="text-blue-600 font-medium">Deep</span>Marker
            </h1>
            {!hasSearched && (
              <p className="text-lg text-gray-500 animate-fade-in">
                Interactive search platform for marker gene knowledge
              </p>
            )}
          </div>

          {/* Search Area */}
          <div className="mb-8">
            <SearchAndFilterArea onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Search Results - Only show after search */}
      {hasSearched && (
        <div className="container mx-auto px-4 pb-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Gene Visualization */}
          <GeneVisualization records={records} />
          
          {/* Data Visualization - Year trends and tissue distribution */}
          <DataVisualization records={records} />
          
          {/* Search Results Table */}
          <DataDisplayArea records={records} />
        </div>
      )}
    </div>
  )
}
