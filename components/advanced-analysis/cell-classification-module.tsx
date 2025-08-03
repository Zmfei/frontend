"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Play, Download, Loader2 } from "lucide-react"

export function CellClassificationModule() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [results, setResults] = useState<any[]>([])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleStartAnalysis = () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Mock results
          setResults([
            { cellId: "Cell_001", predictedType: "T Cell", confidence: 0.95 },
            { cellId: "Cell_002", predictedType: "B Cell", confidence: 0.89 },
            { cellId: "Cell_003", predictedType: "NK Cell", confidence: 0.92 },
            { cellId: "Cell_004", predictedType: "Monocyte", confidence: 0.87 },
            { cellId: "Cell_005", predictedType: "T Cell", confidence: 0.94 },
          ])
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="data-upload">Upload Sequencing Data</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  id="data-upload"
                  type="file"
                  accept=".csv,.tsv,.h5,.xlsx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
                  <span className="text-gray-500">
                    {uploadedFile ? uploadedFile.name : "Choose file..."}
                  </span>
                  <Button type="button" variant="outline" size="sm" className="ml-2">
                    <Upload className="h-4 w-4 mr-1" />
                    Browse
                  </Button>
                </div>
              </div>
            </div>
            {uploadedFile ? (
              <p className="text-sm text-green-600">
                ✓ Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            ) : (
              <p className="text-sm text-gray-400">No file selected. Supported formats: CSV, TSV, H5, XLSX</p>
            )}
          </div>

          {/* Reference Dataset */}
          <div className="space-y-2">
            <Label>Reference Dataset</Label>
            <Select defaultValue="human-pbmc">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-pbmc">Human PBMC (10x Genomics)</SelectItem>
                <SelectItem value="mouse-brain">Mouse Brain Atlas</SelectItem>
                <SelectItem value="human-heart">Human Heart Cell Atlas</SelectItem>
                <SelectItem value="custom">Custom Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Classification Method */}
          <div className="space-y-2">
            <Label>Classification Method</Label>
            <Select defaultValue="marker-based">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marker-based">Marker Gene Based</SelectItem>
                <SelectItem value="ml-ensemble">ML Ensemble</SelectItem>
                <SelectItem value="deep-learning">Deep Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Analysis */}
          <Button onClick={handleStartAnalysis} disabled={!uploadedFile || isProcessing} className="w-full">
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
        </CardContent>
      </Card>

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Classification Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">Analyzing cell types using marker gene signatures...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Classification Results</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Classified {results.length} cells with average confidence of{" "}
                {((results.reduce((acc, r) => acc + r.confidence, 0) / results.length) * 100).toFixed(1)}%
              </p>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cell ID</TableHead>
                      <TableHead>Predicted Type</TableHead>
                      <TableHead>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono">{result.cellId}</TableCell>
                        <TableCell className="font-semibold">{result.predictedType}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${result.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
