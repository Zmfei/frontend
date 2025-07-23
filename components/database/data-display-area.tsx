"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Download, ExternalLink, Info } from "lucide-react"

// Mock data for demonstration - all human data
const mockData = [
  {
    id: 1,
    species: "Human",
    tissue: "Brain",
    cellType: "Neuron",
    marker: "NEUN",
    pmid: "12345678",
    year: 2023,
  },
  {
    id: 2,
    species: "Human",
    tissue: "Heart",
    cellType: "Cardiomyocyte",
    marker: "TNNT2",
    pmid: "87654321",
    year: 2022,
  },
  {
    id: 3,
    species: "Human",
    tissue: "Liver",
    cellType: "Hepatocyte",
    marker: "ALB",
    pmid: "11223344",
    year: 2024,
  },
  {
    id: 4,
    species: "Human",
    tissue: "Blood",
    cellType: "T Cell",
    marker: "CD4",
    pmid: "55667788",
    year: 2023,
  },
  {
    id: 5,
    species: "Human",
    tissue: "Kidney",
    cellType: "Podocyte",
    marker: "NPHS1",
    pmid: "99887766",
    year: 2024,
  },
]

export function DataDisplayArea() {
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  return (
    <div className="space-y-6 h-fit">
      {/* Results Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Found <span className="font-semibold">1,247</span> marker gene records
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          {/* Four-column Data Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead>Tissue</TableHead>
                  <TableHead>Cell Type</TableHead>
                  <TableHead>Marker Gene</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.species}</TableCell>
                    <TableCell>{record.tissue}</TableCell>
                    <TableCell>{record.cellType}</TableCell>
                    <TableCell className="font-mono font-semibold text-blue-600">{record.marker}</TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(record)}>
                            <Info className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Literature Information</SheetTitle>
                            <SheetDescription>Detailed information about the source literature</SheetDescription>
                          </SheetHeader>
                          {selectedRecord && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <h4 className="font-semibold">PMID</h4>
                                <p className="text-sm text-gray-600">{selectedRecord.pmid}</p>
                                <Button variant="link" className="p-0 h-auto" asChild>
                                  <a
                                    href={`https://pubmed.ncbi.nlm.nih.gov/${selectedRecord.pmid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    View on PubMed <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              </div>
                              <div>
                                <h4 className="font-semibold">Marker Details</h4>
                                <div className="text-sm space-y-1">
                                  <p>
                                    <span className="font-medium">Gene:</span> {selectedRecord.marker}
                                  </p>
                                  <p>
                                    <span className="font-medium">Cell Type:</span> {selectedRecord.cellType}
                                  </p>
                                  <p>
                                    <span className="font-medium">Tissue:</span> {selectedRecord.tissue}
                                  </p>
                                  <p>
                                    <span className="font-medium">Species:</span> {selectedRecord.species}
                                  </p>
                                  <p>
                                    <span className="font-medium">Publication Year:</span> {selectedRecord.year}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">Showing 1-5 of 1,247 results</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
