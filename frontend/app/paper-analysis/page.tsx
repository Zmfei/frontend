"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsAnalyzing(true)
      const fileMessage = {
        id: Date.now(),
        type: "user",
        content: `📎 Uploaded: ${file.name}`,
      }
      setMessages((prev) => [...prev, fileMessage])

      setTimeout(() => {
        const resultMessage = {
          id: Date.now() + 1,
          type: "ai",
          content: `Analysis complete! I found 3 marker gene associations in **${file.name}**:\n\n| Species | Tissue | Cell Type | Marker Gene |\n|---|---|---|---|\n| Human | Blood | T helper cell | CD4 |\n| Human | Brain | Neuron | NEUN |\n| Human | Liver | Hepatocyte | ALB |\n\nWould you like me to explain any of these findings?`,
        }
        setMessages((prev) => [...prev, resultMessage])
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
    }
    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "I am a demo model. I cannot process this request, but thank you for your input!",
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50">      
      {/* Main Content Area */}
      <div className="flex-1 flex justify-center overflow-hidden p-4">
        <div className="w-full max-w-4xl flex flex-col h-full">
          {/* Chat Messages Area - Fixed Height with Scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0 bg-white rounded-lg shadow-sm border mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-4 ${message.type === "user" ? "justify-end" : ""}`}>
                {message.type === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    D
                  </div>
                )}
                <div
                  className={`rounded-lg px-4 py-3 max-w-[85%] shadow-sm ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  D
                </div>
                <div className="rounded-lg px-4 py-3 bg-white text-gray-800 border shadow-sm">
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Analyzing document...</span>
                  </div>
                </div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Fixed Input Area at Bottom */}
          <div className="flex-shrink-0 bg-white border rounded-lg shadow-sm p-4">
            <div className="relative">
              <Textarea
                placeholder="Ask a question or drop a file to start analysis..."
                className="w-full pr-24 min-h-[60px] max-h-[120px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="h-5 w-5 text-gray-500" />
                    <span className="sr-only">Upload file</span>
                  </label>
                </Button>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
