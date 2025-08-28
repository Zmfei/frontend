"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

interface GeneFrequency {
  gene: string
  count: number
}

interface GeneVisualizationProps {
  records: any[]
  maxGenes?: number
}

export function GeneVisualization({ records, maxGenes = 30 }: GeneVisualizationProps) {
  const router = useRouter()
  const [hoveredGene, setHoveredGene] = useState<string | null>(null)

  // Calculate gene frequencies from search results
  const geneFrequencies = useMemo(() => {
    const frequencies: { [key: string]: number } = {}
    
    records.forEach(record => {
      const gene = record.marker_symbol
      if (gene) {
        frequencies[gene] = (frequencies[gene] || 0) + 1
      }
    })

    // Convert to array and sort by frequency
    const sortedGenes = Object.entries(frequencies)
      .map(([gene, count]) => ({ gene, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxGenes)

    return sortedGenes
  }, [records, maxGenes])

  // Calculate font sizes based on frequency
  const getFontSize = (count: number, maxCount: number, minCount: number) => {
    const minSize = 14
    const maxSize = 32
    const ratio = maxCount > minCount ? (count - minCount) / (maxCount - minCount) : 0
    return minSize + (maxSize - minSize) * ratio
  }

  // Generate colors for genes
  const getGeneColor = (index: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#06B6D4', // cyan
      '#84CC16', // lime
      '#F97316', // orange
      '#EC4899', // pink
      '#6366F1', // indigo
    ]
    return colors[index % colors.length]
  }

  const handleGeneClick = (gene: string) => {
    // Store current search state in sessionStorage before navigating
    const currentState = {
      hasSearched: true,
      records: records,
      timestamp: Date.now()
    }
    sessionStorage.setItem('searchState', JSON.stringify(currentState))
    router.push(`/search/marker/${encodeURIComponent(gene)}`)
  }

  if (geneFrequencies.length === 0) {
    return null
  }

  const maxCount = Math.max(...geneFrequencies.map(g => g.count))
  const minCount = Math.min(...geneFrequencies.map(g => g.count))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 animate-in slide-in-from-top-2 duration-500">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Top Marker Genes</h3>
        <p className="text-sm text-gray-500">
          Click on any gene to view detailed information • Showing top {geneFrequencies.length} genes
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3 py-4 min-h-[120px]">
        {geneFrequencies.map((item, index) => {
          const fontSize = getFontSize(item.count, maxCount, minCount)
          const color = getGeneColor(index)
          const isHovered = hoveredGene === item.gene
          
          return (
            <button
              key={item.gene}
              onClick={() => handleGeneClick(item.gene)}
              onMouseEnter={() => setHoveredGene(item.gene)}
              onMouseLeave={() => setHoveredGene(null)}
              className="relative transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md px-2 py-1"
              style={{
                fontSize: `${fontSize}px`,
                color: color,
                fontWeight: isHovered ? 'bold' : 'semibold',
                textShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              }}
              title={`${item.gene}: ${item.count} occurrence${item.count > 1 ? 's' : ''}`}
            >
              {item.gene}
              
              {/* Hover tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10 animate-in fade-in duration-200">
                  {item.count} occurrence{item.count > 1 ? 's' : ''}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </button>
          )
        })}
      </div>
      
      {records.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Analyzed {records.length} search results</span>
            <span>Size indicates frequency</span>
          </div>
        </div>
      )}
    </div>
  )
}
