"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Database, Calendar, Users } from "lucide-react"

export default function DownloadPage() {
  const handleDownload = (filename: string) => {
    // This would be replaced with actual download logic
    const link = document.createElement('a')
    link.href = `http://localhost:8002/download/${filename}`
    link.download = filename
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Download Datasets</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Download comprehensive DeepMarker datasets including marker genes, cell types, and publication information
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* DeepMarker Dataset */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">DeepMarker Complete Dataset</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Excel Format</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Updated 2024</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Complete collection of cell marker genes with detailed annotations including species, tissues, 
                cell types, marker symbols, and experimental validation information. This dataset contains 
                curated data from multiple research studies and databases.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">125,847</div>
                  <div className="text-sm text-gray-600">Marker Genes</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">2,456</div>
                  <div className="text-sm text-gray-600">Cell Types</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">89</div>
                  <div className="text-sm text-gray-600">Tissue Types</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Dataset Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Five-tuple data structure: (Species, Tissue, Cell Type, Marker Gene, PMID)</li>
                  <li>• Expression level annotations (High, Medium, Low)</li>
                  <li>• Confidence scores and validation methods</li>
                  <li>• Cross-species comparative data (Human, Mouse, Rat)</li>
                  <li>• Publication references with PMID links</li>
                </ul>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleDownload('deepmarker.xlsx')}
              >
                <Download className="mr-2 h-5 w-5" />
                Download DeepMarker Dataset
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">deepmarker.xlsx</span>
              </Button>
            </CardContent>
          </Card>

          {/* Publication Dataset */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">Publication Metadata</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <FileText className="h-3 w-3" />
                        <span>Excel Format</span>
                      </Badge>
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>Research Data</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Comprehensive metadata for scientific publications referenced in the DeepMarker database. 
                Includes publication years, months, and temporal analysis data to track research trends 
                and developments in cell marker research over time.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">29,000+</div>
                  <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">1979-2025</div>
                  <div className="text-sm text-gray-600">Year Range</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">100%</div>
                  <div className="text-sm text-gray-600">PMID Verified</div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Dataset Contents:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PMID (PubMed Identifier) for each publication</li>
                  <li>• Publication year and month information</li>
                  <li>• Research trend analysis data</li>
                  <li>• Temporal distribution statistics</li>
                  <li>• Citation frequency metrics</li>
                </ul>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleDownload('pmid_with_dates.xlsx')}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Publication Metadata
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">pmid_with_dates.xlsx</span>
              </Button>
            </CardContent>
          </Card>

          {/* Usage Guidelines */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardHeader>
              <CardTitle className="text-center text-gray-900">Usage Guidelines & Attribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <p className="text-gray-700">
                  These datasets are provided for research and educational purposes. Please cite DeepMarker 
                  in your publications when using this data.
                </p>
                <div className="bg-white rounded-lg p-4 text-left text-sm font-mono text-gray-600">
                  <div className="font-bold text-gray-900 mb-2">Suggested Citation:</div>
                  <div>
                    DeepMarker: A Comprehensive Cell Marker Database for Biological Research. 
                    <br />Available at: https://deepmarker.org
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>License:</strong> Creative Commons Attribution 4.0 International (CC BY 4.0)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
