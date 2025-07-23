"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, Download, Loader2 } from "lucide-react"

export function CellClassificationModule() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleClassification = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const intervals = [10, 30, 50, 70, 85, 100]
    for (let i = 0; i < intervals.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(intervals[i])
    }

    // Mock results
    setResults([
      { cellId: "Cell_001", predictedType: "T Cell", confidence: 0.95, markers: ["CD3", "CD4"] },
      { cellId: "Cell_002", predictedType: "B Cell", confidence: 0.89, markers: ["CD19", "CD20"] },
      { cellId: "Cell_003", predictedType: "NK Cell", confidence: 0.92, markers: ["CD56", "CD16"] },
      { cellId: "Cell_004", predictedType: "Monocyte", confidence: 0.87, markers: ["CD14", "CD68"] },
    ])

    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cell Classification Module</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sequencing-data">Upload Sequencing Data</Label>
              <Input
                id="sequencing-data"
                type="file"
                accept=".csv,.tsv,.h5,.h5ad,.xlsx"
                onChange={handleFileUpload}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, TSV, H5, H5AD, Excel</p>
            </div>

            <div>
              <Label htmlFor="data-type">Data Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-cell-rna">Single-cell RNA-seq</SelectItem>
                  <SelectItem value="bulk-rna">Bulk RNA-seq</SelectItem>
                  <SelectItem value="spatial">Spatial transcriptomics</SelectItem>
                  <SelectItem value="proteomics">Proteomics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="species">Species</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="mouse">Mouse</SelectItem>
                  <SelectItem value="rat">Rat</SelectItem>
                  <SelectItem value="zebrafish">Zebrafish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="tissue-type">Tissue Type (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select tissue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood">Blood</SelectItem>
                  <SelectItem value="brain">Brain</SelectItem>
                  <SelectItem value="heart">Heart</SelectItem>
                  <SelectItem value="liver">Liver</SelectItem>
                  <SelectItem value="lung">Lung</SelectItem>
                  <SelectItem value="kidney">Kidney</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parameters">Additional Parameters</Label>
              <Textarea
                id="parameters"
                placeholder="Enter any additional parameters or notes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button onClick={handleClassification} disabled={!uploadedFile || isProcessing} className="min-w-[150px]">
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Classification
              </>
            )}
          </Button>

          {results.length > 0 && (
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Classification Results</h3>

            <div className="grid gap-4">
              {results.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{result.cellId}</span>
                    <Badge
                      variant={result.confidence > 0.9 ? "default" : "secondary"}
                      className={result.confidence > 0.9 ? "bg-green-100 text-green-800" : ""}
                    >
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{result.predictedType}</span>
                      <div className="text-sm text-gray-600 mt-1">Key markers: {result.markers.join(", ")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Cells:</span> {results.length}
                </div>
                <div>
                  <span className="font-medium">High Confidence:</span>{" "}
                  {results.filter((r) => r.confidence > 0.9).length}
                </div>
                <div>
                  <span className="font-medium">Cell Types:</span> {new Set(results.map((r) => r.predictedType)).size}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
