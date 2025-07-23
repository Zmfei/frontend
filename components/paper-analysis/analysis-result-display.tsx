"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

// Mock analysis results - simplified to 4 columns
const analysisResults = [
  {
    id: 1,
    species: "Human",
    tissue: "Blood",
    cellType: "T helper cell",
    marker: "CD4",
  },
  {
    id: 2,
    species: "Human",
    tissue: "Brain",
    cellType: "Neuron",
    marker: "NEUN",
  },
  {
    id: 3,
    species: "Human",
    tissue: "Liver",
    cellType: "Hepatocyte",
    marker: "ALB",
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
                <TableHead>Species</TableHead>
                <TableHead>Tissue</TableHead>
                <TableHead>Cell Type</TableHead>
                <TableHead>Marker Gene</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResults.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.species}</TableCell>
                  <TableCell>{result.tissue}</TableCell>
                  <TableCell>{result.cellType}</TableCell>
                  <TableCell className="font-mono font-semibold text-blue-600">{result.marker}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Extractions:</span> {analysisResults.length}
            </div>
            <div>
              <span className="font-medium">Processing Status:</span> Complete
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
