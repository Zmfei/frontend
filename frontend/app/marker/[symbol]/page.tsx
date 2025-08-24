"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ExternalLink, Download, TrendingUp, Users, FileText } from "lucide-react"
import Link from "next/link"

interface MarkerDetail {
  symbol: string
  full_name: string
  gene_id?: number
  aliases?: string[]
  marker_type?: string
  description?: string
  total_records: number
  species_count: number
  cell_types_count: number
  tissue_types_count: number
  records: Array<{
    id: number
    species_name: string
    tissue_type: string
    cell_type: string
    pmid: number
    expression_level?: string
    confidence_score?: number
    validation_method?: string
    publication_year?: number
    created_at: string
  }>
}

export default function MarkerDetailPage() {
  const params = useParams()
  const symbol = params?.symbol as string
  const [markerData, setMarkerData] = useState<MarkerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  const mockMarkerData: MarkerDetail = {
    symbol: "CD19",
    full_name: "CD19 molecule",
    gene_id: 930,
    aliases: ["B4", "CD19 antigen", "Leu-12"],
    marker_type: "Cell surface protein",
    description: "CD19 is a transmembrane glycoprotein that is expressed on B-lymphocytes from the earliest recognizable B-lineage cells during development to B-cell blasts but is lost on maturation to plasma cells.",
    total_records: 15,
    species_count: 3,
    cell_types_count: 5,
    tissue_types_count: 8,
    records: [
      {
        id: 1,
        species_name: "Human",
        tissue_type: "Blood",
        cell_type: "B cell",
        pmid: 12345678,
        expression_level: "High",
        confidence_score: 0.95,
        validation_method: "Flow cytometry",
        publication_year: 2023,
        created_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        species_name: "Human",
        tissue_type: "Bone Marrow",
        cell_type: "Pre-B cell",
        pmid: 23456789,
        expression_level: "High",
        confidence_score: 0.92,
        validation_method: "Immunofluorescence",
        publication_year: 2023,
        created_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 3,
        species_name: "Mouse",
        tissue_type: "Spleen",
        cell_type: "B cell",
        pmid: 34567890,
        expression_level: "High",
        confidence_score: 0.90,
        validation_method: "RT-PCR",
        publication_year: 2022,
        created_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 4,
        species_name: "Human",
        tissue_type: "Lymph Node",
        cell_type: "Memory B cell",
        pmid: 45678901,
        expression_level: "Medium",
        confidence_score: 0.88,
        validation_method: "Western blot",
        publication_year: 2024,
        created_at: "2024-01-15T10:00:00Z"
      }
    ]
  }

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await fetch(`/api/markers/${symbol}`)
        // const data = await response.json()
        
        // For now, use mock data with the correct symbol
        const data = {
          ...mockMarkerData,
          symbol: decodeURIComponent(symbol)
        }
        setMarkerData(data)
      } catch (error) {
        console.error("Failed to fetch marker data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchMarkerData()
    }
  }, [symbol])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading marker information...</p>
        </div>
      </div>
    )
  }

  if (!markerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Marker Not Found</h1>
          <p className="text-gray-600 mb-6">The requested marker "{symbol}" was not found in our database.</p>
          <Button asChild>
            <Link href="/search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getExpressionBadge = (level?: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      "High": "default",
      "Medium": "secondary", 
      "Low": "secondary"
    }
    return variants[level || ""] || "secondary"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{markerData.symbol}</h1>
              <p className="text-xl text-gray-600 mb-4">{markerData.full_name}</p>
              <div className="flex items-center space-x-4">
                {markerData.gene_id && (
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span>Gene ID: {markerData.gene_id}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Badge>
                )}
                {markerData.marker_type && (
                  <Badge variant="secondary">{markerData.marker_type}</Badge>
                )}
              </div>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Marker Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Marker Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {markerData.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{markerData.description}</p>
                  </div>
                )}
                
                {markerData.aliases && markerData.aliases.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Aliases</h4>
                    <div className="flex flex-wrap gap-1">
                      {markerData.aliases.map((alias) => (
                        <Badge key={alias} variant="outline" className="text-xs">
                          {alias}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Database Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{markerData.total_records}</div>
                    <div className="text-xs text-gray-600">Total Records</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{markerData.species_count}</div>
                    <div className="text-xs text-gray-600">Species</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{markerData.cell_types_count}</div>
                    <div className="text-xs text-gray-600">Cell Types</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{markerData.tissue_types_count}</div>
                    <div className="text-xs text-gray-600">Tissues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Expression Data */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Expression Records</span>
                  <Badge variant="outline">{markerData.total_records} records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Species</TableHead>
                        <TableHead>Tissue</TableHead>
                        <TableHead>Cell Type</TableHead>
                        <TableHead>Expression</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>PMID</TableHead>
                        <TableHead>Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {markerData.records.map((record) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Badge variant="outline">{record.species_name}</Badge>
                          </TableCell>
                          <TableCell>{record.tissue_type}</TableCell>
                          <TableCell className="font-medium">{record.cell_type}</TableCell>
                          <TableCell>
                            {record.expression_level && (
                              <Badge variant={getExpressionBadge(record.expression_level)}>
                                {record.expression_level}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.confidence_score && (
                              <span className="font-medium">
                                {(record.confidence_score * 100).toFixed(0)}%
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {record.validation_method || "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {record.pmid === 0 ? (
                              <span className="text-gray-400 text-sm">N/A</span>
                            ) : (
                              <Link
                                href={`https://pubmed.ncbi.nlm.nih.gov/${record.pmid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm"
                              >
                                {record.pmid}
                              </Link>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.publication_year || "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
