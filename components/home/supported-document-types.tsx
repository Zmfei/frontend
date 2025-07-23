import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ImageIcon, FileSpreadsheet, File, Database } from "lucide-react"

export function SupportedDocumentTypes() {
  const documentTypes = [
    {
      icon: FileText,
      title: "PDF Documents",
      description: "Research papers, reviews, and scientific articles",
      formats: ["PDF", "Scientific Papers"],
    },
    {
      icon: ImageIcon,
      title: "Images & Figures",
      description: "Microscopy images, charts, and scientific illustrations",
      formats: ["PNG", "JPG", "TIFF", "SVG"],
    },
    {
      icon: FileSpreadsheet,
      title: "Spreadsheets",
      description: "Data tables, gene expression matrices, and supplementary data",
      formats: ["Excel", "CSV", "TSV"],
    },
    {
      icon: File,
      title: "Text Documents",
      description: "Word documents, plain text, and formatted manuscripts",
      formats: ["DOCX", "TXT", "RTF"],
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Supported Document Types</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our system can process multiple document formats to extract marker gene information from diverse scientific
            literature sources.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <type.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm mb-4">{type.description}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {type.formats.map((format, formatIndex) => (
                    <span key={formatIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {format}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">
              Multi-modal processing ensures comprehensive data extraction from all document types
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
