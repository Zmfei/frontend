"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CheckCircle, AlertCircle } from "lucide-react"

// Mock analysis results
const analysisResults = [
  {
    id: 1,
    marker: "CD4",
    cellType: "T helper cell",
    tissue: "Blood",
    species: "Human",
    confidence: 0.95,
    context: "CD4+ T cells are crucial for adaptive immunity",
    validated: true,
  },
  {
    id: 2,
    marker: "NEUN",
    cellType: "Neuron",
    tissue: "Brain",
    species: "Mouse",
    confidence: 0.88,
    context: "NEUN is widely used as a neuronal marker",
    validated: false,
  },
  {
    id: 3,
    marker: "ALB",
    cellType: "Hepatocyte",
    tissue: "Liver",
    species: "Human",
    confidence: 0.92,
    context: "Albumin is specifically expressed in hepatocytes",
    validated: true,
  },
]

export function AnalysisResultDisplay() {
  const handleDownload = (format: string) => {
    console.log(`Downloading results in ${format} format`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Extraction Results</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleDownload("csv")}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload("excel")}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload("json")}>
              <Download className="h-4 w-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Extracted <span className="font-semibold">{analysisResults.length}</span> marker gene associations from the
            uploaded literature
          </p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Marker Gene</TableHead>
                <TableHead>Cell Type</TableHead>
                <TableHead>Tissue</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-mono font-semibold">{result.marker}</TableCell>
                  <TableCell>{result.cellType}</TableCell>
                  <TableCell>{result.tissue}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.species}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={result.confidence > 0.9 ? "default" : "secondary"}
                      className={result.confidence > 0.9 ? "bg-green-100 text-green-800" : ""}
                    >
                      {(result.confidence * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {result.validated ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Validated</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate" title={result.context}>
                      {result.context}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Extractions:</span> {analysisResults.length}
            </div>
            <div>
              <span className="font-medium">High Confidence:</span>{" "}
              {analysisResults.filter((r) => r.confidence > 0.9).length}
            </div>
            <div>
              <span className="font-medium">Validated:</span> {analysisResults.filter((r) => r.validated).length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
