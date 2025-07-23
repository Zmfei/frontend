"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Paperclip, Loader2, FileText } from "lucide-react"

export function LLMInteractionBox() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [message, setMessage] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsAnalyzing(true)
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const handleSendMessage = () => {
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>AI Literature Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

            {uploadedFile && (
              <div className="flex justify-end">
                <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-blue-800">📎 Uploaded: {uploadedFile.name}</p>
                </div>
              </div>
            )}

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

            {uploadedFile && !isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-green-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-green-800">
                    ✅ Analysis complete! I found 3 marker gene associations. Check the results above.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Message Input with File Upload */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Ask about marker genes, cell types, or upload a document for analysis..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[60px]"
            />
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isAnalyzing}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()} size="icon">
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
        </div>
      </CardContent>
    </Card>
  )
}
