"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, X, Filter } from "lucide-react"

interface FilterOption {
  type: 'marker' | 'species' | 'tissue' | 'cellType' | 'year'
  label: string
  values: string[] // Changed from single value to array of values
  displayValues: string[] // Changed from single displayValue to array
}

interface SearchAndFilterAreaProps {
  onSearch?: (results: any[]) => void
}

export function SearchAndFilterArea({ onSearch }: SearchAndFilterAreaProps) {
  const [markerQuery, setMarkerQuery] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [currentFilterType, setCurrentFilterType] = useState<string>("")
  const [filterSearchQuery, setFilterSearchQuery] = useState("")
  const [filterOptions, setFilterOptions] = useState<string[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Filter type definitions
  const filterTypes = [
    { type: 'species', label: 'Species', icon: '🐾' },
    { type: 'tissue', label: 'Tissue Type', icon: '🔬' },
    { type: 'cellType', label: 'Cell Type', icon: '🧬' },
    { type: 'year', label: 'Publication Year', icon: '📅' }
  ]

  // Load filter options when dialog opens
  useEffect(() => {
    if (showFilterDialog && currentFilterType) {
      loadFilterOptions(currentFilterType)
    }
  }, [showFilterDialog, currentFilterType, activeFilters]) // Added activeFilters to dependencies for cellType dynamic loading

  const loadFilterOptions = async (filterType: string) => {
    try {
      let endpoint = ""
      switch (filterType) {
        case 'species':
          endpoint = "http://localhost:8002/query/options/species"
          break
        case 'tissue':
          endpoint = "http://localhost:8002/query/options/tissues"
          break
        case 'cellType':
          // For cell type, we need to consider all current filters
          const tissueFilters = activeFilters.filter(f => f.type === 'tissue')
          const speciesFilters = activeFilters.filter(f => f.type === 'species')
          const yearFilters = activeFilters.filter(f => f.type === 'year')
          
          if (tissueFilters.length > 0) {
            const params = new URLSearchParams()
            
            // Add tissue types
            const tissueValues = tissueFilters.map(f => f.values).flat()
            tissueValues.forEach(v => params.append('tissue_type', v))
            
            // Add species filter if exists
            if (speciesFilters.length > 0) {
              const speciesValues = speciesFilters.map(f => f.values).flat()
              speciesValues.forEach(v => params.append('species', v))
            }
            
            // Add year filter if exists
            if (yearFilters.length > 0) {
              const yearValues = yearFilters.map(f => f.values).flat()
              yearValues.forEach(v => params.append('publication_year', v))
            }
            
            endpoint = `http://localhost:8002/query/options/cell-types-by-tissue?${params.toString()}`
          } else {
            endpoint = "http://localhost:8002/query/options/cell-types"
          }
          break
        case 'year':
          endpoint = "http://localhost:8002/query/options/publication-years"
          break
      }
      
      if (endpoint) {
        const response = await fetch(endpoint)
        const data = await response.json()
        // Convert all options to strings to ensure consistency
        const options = Array.isArray(data.data) ? data.data.map(String) : []
        setFilterOptions(options)
      }
    } catch (e) {
      console.error("Failed to load filter options", e)
      setFilterOptions([])
    }
  }

  const handleRemoveFilter = (filterType: string) => {
    setActiveFilters(activeFilters.filter(f => f.type !== filterType))
  }

  const handleAddFilter = (filterType: string) => {
    setCurrentFilterType(filterType)
    setFilterSearchQuery("")
    // Pre-select all current values for this filter type
    const currentFilter = activeFilters.find(f => f.type === filterType)
    if (currentFilter) {
      setSelectedOptions(currentFilter.values)
    } else {
      setSelectedOptions([])
    }
    setShowFilterDialog(true)
  }

  const handleFilterConfirm = () => {
    if (selectedOptions.length > 0) {
      const filterType = currentFilterType as FilterOption['type']
      const filterLabel = filterTypes.find(f => f.type === filterType)?.label || filterType
      
      // Create a single filter with all selected values
      const newFilter: FilterOption = {
        type: filterType,
        label: filterLabel,
        values: selectedOptions,
        displayValues: selectedOptions
      }
      
      // Remove existing filter of same type and add the new/updated one
      const updatedFilters = activeFilters.filter(f => f.type !== filterType)
      setActiveFilters([...updatedFilters, newFilter])
    }
    setShowFilterDialog(false)
    // Reset current filter type when closing dialog
    setCurrentFilterType("")
  }

  const handleOpenFilterDialog = () => {
    setCurrentFilterType("") // Reset to show filter type selection
    setFilterSearchQuery("")
    setSelectedOptions([])
    setShowFilterDialog(true)
  }

  const handleEditFilter = (filterType: string) => {
    setCurrentFilterType(filterType)
    setFilterSearchQuery("")
    // Pre-select all current values for this filter type
    const currentFilter = activeFilters.find(f => f.type === filterType)
    if (currentFilter) {
      setSelectedOptions(currentFilter.values)
    } else {
      setSelectedOptions([])
    }
    setShowFilterDialog(true)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (markerQuery.trim()) params.append("marker", markerQuery.trim())
      
      // Add all filter values
      activeFilters.forEach(filter => {
        filter.values.forEach(value => {
          switch (filter.type) {
            case 'species':
              params.append("species", value)
              break
            case 'tissue':
              params.append("tissue_type", value)
              break
            case 'cellType':
              params.append("cell_type", value)
              break
            case 'year':
              params.append("publication_year", value)
              break
          }
        })
      })
      
      const response = await fetch(`http://localhost:8002/query/cell-markers?${params.toString()}`)
      const data = await response.json()
      const results = Array.isArray(data.data) ? data.data : []
      onSearch?.(results)
    } catch (e) {
      console.error("Query failed", e)
      onSearch?.([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const filteredOptions = filterOptions.filter(option =>
    String(option).toLowerCase().includes(filterSearchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={activeFilters.length > 0 ? "Search with active filters..." : "Search marker genes (e.g., CD68, BNC1)..."}
                value={markerQuery}
                onChange={(e) => setMarkerQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 pr-16 h-14 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-300"
              />
              {/* Circular Add Filter Button */}
              <button
                onClick={handleOpenFilterDialog}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                aria-label="Add filter"
              >
                <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={loading} 
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Searching...
                </div>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <Card className="border-0 shadow-sm bg-gray-50 animate-in slide-in-from-top-2 duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700 mr-2">Active Filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={filter.type}
                  variant="secondary"
                  className="bg-white border-2 border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-blue-300 cursor-pointer px-4 py-2 text-sm font-medium shadow-sm transition-all duration-300 animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleEditFilter(filter.type)}
                >
                  <span className="mr-2 text-lg">
                    {filterTypes.find(f => f.type === filter.type)?.icon}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {filter.label}:
                  </span>
                  <span className="ml-1 text-blue-600 font-medium">
                    {filter.displayValues.join(', ')}
                  </span>
                  <X 
                    className="h-4 w-4 ml-3 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-all duration-200 hover:scale-110" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFilter(filter.type)
                    }}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Selection Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-md animate-in zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {currentFilterType ? `Select ${filterTypes.find(f => f.type === currentFilterType)?.label}` : "Add Filter"}
            </DialogTitle>
          </DialogHeader>
          
          {!currentFilterType ? (
            <div className="space-y-2">
              {filterTypes.map((filter, index) => (
                <Button
                  key={filter.type}
                  variant="ghost"
                  className="w-full justify-start h-12 text-left hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 animate-in slide-in-from-left-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleAddFilter(filter.type)}
                >
                  <span className="mr-3 text-lg">{filter.icon}</span>
                  <span className="font-medium">{filter.label}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Input
                placeholder={`Search ${filterTypes.find(f => f.type === currentFilterType)?.label.toLowerCase()}...`}
                value={filterSearchQuery}
                onChange={(e) => setFilterSearchQuery(e.target.value)}
                className="mb-4 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
              />
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredOptions.map((option, index) => (
                  <div 
                    key={option} 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 animate-in slide-in-from-left-2 duration-300"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <Checkbox
                      id={option}
                      checked={selectedOptions.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOptions([...selectedOptions, option])
                        } else {
                          setSelectedOptions(selectedOptions.filter(o => o !== option))
                        }
                      }}
                      className="transition-all duration-200"
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer flex-1">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilterDialog(false)}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleFilterConfirm} 
                  disabled={selectedOptions.length === 0}
                  className="transition-all duration-200 hover:shadow-md"
                >
                  {activeFilters.find(f => f.type === currentFilterType) ? "Update Filters" : "Add Filters"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
