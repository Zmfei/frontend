"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Play, Download } from "lucide-react"

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

  const handleStartClassification = async () => {
    setIsProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          // Mock results
          setResults([
            { cellType: "T Cell", count: 1234, confidence: 0.95 },
            { cellType: "B Cell", count: 856, confidence: 0.92 },
            { cellType: "NK Cell", count: 432, confidence: 0.88 },
            { cellType: "Monocyte", count: 678, confidence: 0.91 },
          ])
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cell Classification Module</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="sequencing-data">Upload Sequencing Data</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Input
                id="sequencing-data"
                type="file"
                accept=".csv,.tsv,.h5,.h5ad,.xlsx"
                onChange={handleFileUpload}
                className="flex-1"
              />
            </div>
          </div>

          {uploadedFile && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Selected file:</strong> {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Parameter Configuration */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference-dataset">Reference Dataset</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select reference dataset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human-pbmc">Human PBMC</SelectItem>
                <SelectItem value="human-brain">Human Brain</SelectItem>
                <SelectItem value="mouse-brain">Mouse Brain</SelectItem>
                <SelectItem value="custom">Custom Dataset</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="classification-method">Classification Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="svm">Support Vector Machine</SelectItem>
                <SelectItem value="random-forest">Random Forest</SelectItem>
                <SelectItem value="neural-network">Neural Network</SelectItem>
                <SelectItem value="ensemble">Ensemble Method</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Processing Controls */}
        <div className="flex space-x-4">
          <Button onClick={handleStartClassification} disabled={!uploadedFile || isProcessing} className="flex-1">
            {isProcessing ? (
              <>
                <Play className="h-4 w-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Classification
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing sequencing data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Results Display */}
        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Classification Results</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{result.cellType}</h4>
                      <p className="text-sm text-gray-600">{result.count} cells identified</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${result.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Analysis Summary</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Cells:</span> {results.reduce((sum, r) => sum + r.count, 0)}
                </div>
                <div>
                  <span className="font-medium">Cell Types:</span> {results.length}
                </div>
                <div>
                  <span className="font-medium">Avg Confidence:</span>{" "}
                  {((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
