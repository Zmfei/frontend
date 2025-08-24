"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Download, ArrowLeft, Share, BookOpen } from "lucide-react"
import Link from "next/link"

interface MarkerDetailProps {
  markerSymbol: string
}

export function MarkerDetail({ markerSymbol }: MarkerDetailProps) {
  // 基于真实数据的标记详情（这里使用模拟数据，实际应从API获取）
  const markerInfo = {
    symbol: markerSymbol,
    full_name: "Cluster of Differentiation 68", // 大多数情况下为空，使用默认描述
    gene_id: 968,
    aliases: ["LAMP4", "SCARD1"],
    description: "Cell marker associated with macrophage identification and immune response.",
    total_records: 12194,
    species_distribution: [
      { species: "Human", count: 12193, percentage: 99.99 },
      { species: "Mouse", count: 1, percentage: 0.01 }
    ],
    tissue_distribution: [
      { tissue: "Blood", count: 5234, percentage: 42.9 },
      { tissue: "Brain", count: 2456, percentage: 20.1 },
      { tissue: "Lung", count: 1678, percentage: 13.8 },
      { tissue: "Liver", count: 1234, percentage: 10.1 },
      { tissue: "Others", count: 1592, percentage: 13.1 }
    ],
    cell_associations: [
      { cell_type: "macrophage", count: 8456, confidence: "High" },
      { cell_type: "monocyte", count: 2134, confidence: "Medium" },
      { cell_type: "dendritic cell", count: 892, confidence: "Medium" },
      { cell_type: "microglial cell", count: 712, confidence: "Low" }
    ],
    recent_publications: [
      {
        pmid: 35123456,
        year: 2024,
        title: "Single-cell analysis reveals CD68 expression patterns in tissue macrophages",
        journal: "Nature Immunology"
      },
      {
        pmid: 34567890,
        year: 2023,
        title: "Macrophage heterogeneity characterized by CD68 expression",
        journal: "Cell Reports"
      },
      {
        pmid: 33456789,
        year: 2023,
        title: "CD68+ cells in inflammatory environments",
        journal: "Journal of Immunology"
      }
    ]
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
