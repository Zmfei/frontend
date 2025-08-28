"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart } from "lucide-react"

interface DataVisualizationProps {
  records: any[]
}

export function DataVisualization({ records }: DataVisualizationProps) {
  // Calculate yearly data (2019-2025 + Others)
  const yearlyData = useMemo(() => {
    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025]
    const yearCounts: { [key: number]: number } = {}
    let otherYearsCount = 0
    
    // Initialize all years with 0
    years.forEach(year => {
      yearCounts[year] = 0
    })
    
    // Count records by year
    records.forEach(record => {
      const year = record.publication_year
      if (year && year >= 2019 && year <= 2025) {
        yearCounts[year] = (yearCounts[year] || 0) + 1
      } else if (year) {
        otherYearsCount += 1
      }
    })
    
    const result = years.map(year => ({
      year: year.toString(),
      count: yearCounts[year]
    }))
    
    // Add "Others" if there are records from other years
    if (otherYearsCount > 0) {
      result.push({
        year: 'Others',
        count: otherYearsCount
      })
    }
    
    return result
  }, [records])

  // Calculate tissue distribution (top 6 + others)
  const tissueData = useMemo(() => {
    const tissueCounts: { [key: string]: number } = {}
    
    records.forEach(record => {
      const tissue = record.tissue_type || 'Unknown'
      tissueCounts[tissue] = (tissueCounts[tissue] || 0) + 1
    })
    
    // Sort tissues by count and get top 6
    const sortedTissues = Object.entries(tissueCounts)
      .sort(([, a], [, b]) => b - a)
    
    const topTissues = sortedTissues.slice(0, 6)
    const otherTissues = sortedTissues.slice(6)
    
    const result = topTissues.map(([tissue, count]) => ({
      tissue,
      count,
      percentage: (count / records.length) * 100
    }))
    
    // Add "Others" if there are more tissues
    if (otherTissues.length > 0) {
      const otherCount = otherTissues.reduce((sum, [, count]) => sum + count, 0)
      result.push({
        tissue: 'Others',
        count: otherCount,
        percentage: (otherCount / records.length) * 100
      })
    }
    
    return result
  }, [records])

  // Colors for charts
  const tissueColors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
    '#06B6D4', // cyan
    '#9CA3AF'  // gray for others
  ]

  const maxYearCount = Math.max(...yearlyData.map(d => d.count))

  if (records.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-in slide-in-from-top-2 duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Data Visualization</h3>
        <p className="text-sm text-gray-500">
          Temporal trends and tissue distribution of current search results
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Yearly Trends Chart */}
        <Card className="border-0 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Temporal Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {yearlyData.map((item, index) => {
                const barWidth = maxYearCount > 0 ? (item.count / maxYearCount) * 100 : 0
                return (
                  <div key={item.year} className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {item.year}
                    </div>
                    <div className="flex-1 relative">
                      <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(barWidth, 2)}%` }}
                        >
                          {item.count > 0 && (
                            <span className="text-xs font-medium text-white">
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Temporal trends showing marker gene discoveries over time
            </p>
          </CardContent>
        </Card>

        {/* Tissue Distribution Pie Chart */}
        <Card className="border-0 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="h-4 w-4 text-green-600" />
              Tissue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tissueData.map((item, index) => (
                <div key={item.tissue} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tissueColors[index] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {item.tissue}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 ml-2">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: tissueColors[index]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Distribution of marker genes across different tissues and organs
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
