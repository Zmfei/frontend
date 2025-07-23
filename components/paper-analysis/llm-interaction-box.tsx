"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Send, FileText, Loader2 } from "lucide-react"

export function LLMInteractionBox() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsAnalyzing(false)
  }

  const handleSendMessage = () => {
    // Handle message sending
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Literature Analysis & AI Interaction</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Upload Literature</Label>
            <div className="mt-2 flex items-center space-x-4">
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button onClick={handleAnalyze} disabled={!uploadedFile || isAnalyzing} className="min-w-[120px]">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          {uploadedFile && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Selected file:</strong> {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="space-y-4">
          <Label>Ask questions about the uploaded literature</Label>

          {/* Chat Messages Area */}
          <div className="h-64 border rounded-lg p-4 bg-gray-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-sm">
                    Hello! I'm ready to analyze your literature. Please upload a document and I'll extract marker gene
                    information for you.
                  </p>
                </div>
              </div>

              {isAnalyzing && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-blue-800">
                      <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                      Analyzing your document... This may take a few minutes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask about marker genes, cell types, or any specific information from the literature..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[60px]"
            />
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="space-y-2">
          <Label>Quick Questions</Label>
          <div className="flex flex-wrap gap-2">
            {[
              "What marker genes are mentioned?",
              "Which cell types are discussed?",
              "What tissues are studied?",
              "Extract all gene-cell associations",
            ].map((question, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setMessage(question)}>
                {question}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
