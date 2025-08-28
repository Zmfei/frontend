"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Download, ArrowLeft, Share, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"

interface MarkerDetailProps {
  markerSymbol: string
}

export function MarkerDetail({ markerSymbol }: MarkerDetailProps) {
  const [markerInfo, setMarkerInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMarkerDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch marker records
        const response = await fetch(`http://localhost:8002/query/cell-markers?marker=${encodeURIComponent(markerSymbol)}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch marker data')
        }
        
        const records = Array.isArray(data.data) ? data.data : []
        
        if (records.length === 0) {
          setMarkerInfo({
            symbol: markerSymbol,
            total_records: 0,
            species_distribution: [],
            tissue_distribution: [],
            cell_associations: [],
            recent_publications: []
          })
          return
        }
        
        // Process the data to create statistics
        const processedInfo = processMarkerData(records, markerSymbol)
        setMarkerInfo(processedInfo)
        
      } catch (err) {
        console.error('Error fetching marker details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load marker data')
      } finally {
        setLoading(false)
      }
    }

    fetchMarkerDetails()
  }, [markerSymbol])

  const processMarkerData = (records: any[], symbol: string) => {
    // Calculate species distribution
    const speciesCount: { [key: string]: number } = {}
    records.forEach(record => {
      const species = record.species_name || 'Unknown'
      speciesCount[species] = (speciesCount[species] || 0) + 1
    })
    
    const speciesDistribution = Object.entries(speciesCount)
      .map(([species, count]) => ({
        species,
        count,
        percentage: (count / records.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
    
    // Calculate tissue distribution
    const tissueCount: { [key: string]: number } = {}
    records.forEach(record => {
      const tissue = record.tissue_type || 'Unknown'
      tissueCount[tissue] = (tissueCount[tissue] || 0) + 1
    })
    
    const tissueDistribution = Object.entries(tissueCount)
      .map(([tissue, count]) => ({
        tissue,
        count,
        percentage: (count / records.length) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 tissues
    
    // Calculate cell type associations
    const cellTypeCount: { [key: string]: number } = {}
    records.forEach(record => {
      const cellType = record.cell_type || 'Unknown'
      cellTypeCount[cellType] = (cellTypeCount[cellType] || 0) + 1
    })
    
    const cellAssociations = Object.entries(cellTypeCount)
      .map(([cell_type, count]) => {
        let confidence = 'Low'
        const percentage = (count / records.length) * 100
        if (percentage > 20) confidence = 'High'
        else if (percentage > 5) confidence = 'Medium'
        
        return { cell_type, count, confidence }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 cell types
    
    // Get recent publications (unique PMIDs)
    const uniquePMIDs = new Set()
    const recentPublications = records
      .filter(record => {
        if (!record.pmid || uniquePMIDs.has(record.pmid)) return false
        uniquePMIDs.add(record.pmid)
        return true
      })
      .sort((a, b) => (b.publication_year || 0) - (a.publication_year || 0))
      .slice(0, 5)
      .map(record => ({
        pmid: record.pmid,
        year: record.publication_year || 'Unknown',
        title: `Research on ${symbol} in ${record.cell_type || 'cells'}`,
        journal: 'Scientific Publication'
      }))
    
    return {
      symbol,
      full_name: `${symbol} marker gene`,
      gene_id: null,
      aliases: [],
      description: `Cell marker gene with ${records.length} documented expression patterns across various cell types and tissues.`,
      total_records: records.length,
      species_distribution: speciesDistribution,
      tissue_distribution: tissueDistribution,
      cell_associations: cellAssociations,
      recent_publications: recentPublications
    }
  }

  const handlePMIDClick = (pmid: number) => {
    window.open(`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`, '_blank')
  }

  const handleExport = () => {
    console.log("Exporting marker data...")
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    // 显示分享成功提示
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading marker details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/search">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!markerInfo) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-6">
        {/* 导航和操作 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{markerInfo.symbol}</h1>
              <p className="text-gray-600">
                {markerInfo.full_name || "Cell marker gene"} • {markerInfo.total_records.toLocaleString()} records
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左侧主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Marker Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Symbol</label>
                    <div className="mt-1 font-mono text-lg font-bold text-green-600">{markerInfo.symbol}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gene ID</label>
                    <div className="mt-1 text-gray-900">{markerInfo.gene_id || "Not available"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 text-gray-900">{markerInfo.full_name || "Name not available in current dataset"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1 text-gray-600">{markerInfo.description}</div>
                  </div>
                  {markerInfo.aliases && markerInfo.aliases.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Aliases</label>
                      <div className="mt-1 flex gap-2 flex-wrap">
                        {markerInfo.aliases.map(alias => (
                          <Badge key={alias} variant="outline">{alias}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 细胞关联 */}
            <Card>
              <CardHeader>
                <CardTitle>Cell Type Associations</CardTitle>
                <p className="text-sm text-gray-600">
                  Cell types where this marker is commonly expressed
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cell Type</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {markerInfo.cell_associations.map((assoc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{assoc.cell_type}</TableCell>
                        <TableCell>{assoc.count.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={assoc.confidence === "High" ? "default" : 
                                   assoc.confidence === "Medium" ? "secondary" : "outline"}
                          >
                            {assoc.confidence}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 最近发表 */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Publications</CardTitle>
                <p className="text-sm text-gray-600">
                  Latest research mentioning this marker
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {markerInfo.recent_publications.map((pub, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 p-3 rounded-r-lg transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{pub.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{pub.journal} • {pub.year}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePMIDClick(pub.pmid)}
                        >
                          PMID: {pub.pmid}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧统计面板 */}
          <div className="space-y-6">
            {/* 总览统计 */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{markerInfo.total_records.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{markerInfo.species_distribution.length}</div>
                    <div className="text-xs text-gray-600">Species</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{markerInfo.tissue_distribution.length}</div>
                    <div className="text-xs text-gray-600">Tissues</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 物种分布 */}
            <Card>
              <CardHeader>
                <CardTitle>Species Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {markerInfo.species_distribution.map((species, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{species.species}</span>
                        <span className="text-gray-600">{species.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${species.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 组织分布 */}
            <Card>
              <CardHeader>
                <CardTitle>Tissue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {markerInfo.tissue_distribution.map((tissue, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{tissue.tissue}</span>
                        <span className="text-gray-600">{tissue.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${tissue.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
