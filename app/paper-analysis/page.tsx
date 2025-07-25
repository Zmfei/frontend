"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Send, Paperclip, Loader2 } from "lucide-react"

export default function PaperAnalysisPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm ready to analyze your literature. Please upload a document or ask me any questions about marker genes.",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsAnalyzing(true)

      // Add file upload message
      const fileMessage = {
        id: messages.length + 1,
        type: "user",
        content: `📎 Uploaded: ${file.name}`,
      }
      setMessages((prev) => [...prev, fileMessage])

      // Add analyzing message
      const analyzingMessage = {
        id: messages.length + 2,
        type: "ai",
        content: "Analyzing your document... This may take a few minutes.",
      }
      setMessages((prev) => [...prev, analyzingMessage])

      // Simulate analysis
      setTimeout(() => {
        const resultMessage = {
          id: messages.length + 3,
          type: "ai",
          content: `Analysis complete! I found 3 marker gene associations:

| Species | Tissue | Cell Type | Marker Gene |
|---------|--------|-----------|-------------|
| Human | Blood | T helper cell | CD4 |
| Human | Brain | Neuron | NEUN |
| Human | Liver | Hepatocyte | ALB |

Would you like me to explain any of these findings or analyze additional aspects of the document?`,
        }
        setMessages((prev) => [...prev, resultMessage])
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        type: "ai",
        content: "I understand your question. Let me analyze that for you...",
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setInputMessage("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      setUploadedFile(file)
      // Trigger the same analysis as file upload
      const event = { target: { files: [file] } } as any
      handleFileUpload(event)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">GeneExplore</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="/database" className="text-gray-600 hover:text-blue-600 transition-colors">
                Database
              </a>
              <a href="/advanced-analysis" className="text-gray-600 hover:text-blue-600 transition-colors">
                Advanced
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paper Analysis</h1>
          <p className="text-gray-600">Upload literature and extract marker gene information using AI analysis</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6">
              {/* Chat Messages Area */}
              <div
                className="flex-1 overflow-y-auto space-y-4 mb-6 p-4 border-2 border-dashed border-gray-200 rounded-lg"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content.includes("|") ? (
                          // Render table content
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-1">Species</th>
                                  <th className="text-left p-1">Tissue</th>
                                  <th className="text-left p-1">Cell Type</th>
                                  <th className="text-left p-1">Marker Gene</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="p-1">Human</td>
                                  <td className="p-1">Blood</td>
                                  <td className="p-1">T helper cell</td>
                                  <td className="p-1 font-mono font-semibold text-blue-600">CD4</td>
                                </tr>
                                <tr>
                                  <td className="p-1">Human</td>
                                  <td className="p-1">Brain</td>
                                  <td className="p-1">Neuron</td>
                                  <td className="p-1 font-mono font-semibold text-blue-600">NEUN</td>
                                </tr>
                                <tr>
                                  <td className="p-1">Human</td>
                                  <td className="p-1">Liver</td>
                                  <td className="p-1">Hepatocyte</td>
                                  <td className="p-1 font-mono font-semibold text-blue-600">ALB</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-blue-800">
                        <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />
                        Processing...
                      </p>
                    </div>
                  </div>
                )}

                {/* Drop zone indicator */}
                <div className="text-center text-gray-400 py-8">
                  <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Drag and drop files here or use the upload button below</p>
                </div>
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about marker genes, cell types, or upload a document for analysis..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
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
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isAnalyzing} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    "What marker genes are mentioned?",
                    "Which cell types are discussed?",
                    "What tissues are studied?",
                    "Extract all gene-cell associations",
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(question)}
                      disabled={isAnalyzing}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
