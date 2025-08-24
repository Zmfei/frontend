"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Download, ExternalLink, Info } from "lucide-react"

interface Props {
  records?: any[]
}

export function DataDisplayArea({ records = [] }: Props) {
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 8

  // Calculate pagination
  const totalPages = Math.ceil(records.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const currentRecords = records.slice(startIndex, endIndex)

  // Reset to first page when records change
  useEffect(() => {
    setCurrentPage(1)
  }, [records])

  return (
    <div className="space-y-6 h-fit">
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {records.length === 0 ? "No results yet. Apply filters to fetch data." : (
                <>Found <span className="font-semibold">{records.length.toLocaleString()}</span> records</>
              )}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled={records.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" disabled={records.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Species</TableHead>
                  <TableHead>Tissue</TableHead>
                  <TableHead>Cell Type</TableHead>
                  <TableHead>Marker Gene</TableHead>
                  <TableHead>PMID</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((r, idx) => (
                  <TableRow key={r.id ?? idx}>
                    <TableCell className="font-medium">{r.species_name}</TableCell>
                    <TableCell>{r.tissue_type}</TableCell>
                    <TableCell>{r.cell_type}</TableCell>
                    <TableCell className="font-mono font-semibold text-blue-600">{r.marker_symbol}</TableCell>
                    <TableCell>{r.pmid}</TableCell>
                    <TableCell>{r.publication_year ?? ""}</TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(r)}>
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
                                  <a href={`https://pubmed.ncbi.nlm.nih.gov/${selectedRecord.pmid}`} target="_blank" rel="noreferrer">
                                    View on PubMed <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              </div>
                              <div>
                                <h4 className="font-semibold">Marker Details</h4>
                                <div className="text-sm space-y-1">
                                  <p><span className="font-medium">Gene:</span> {selectedRecord.marker_symbol}</p>
                                  <p><span className="font-medium">Cell Type:</span> {selectedRecord.cell_type}</p>
                                  <p><span className="font-medium">Tissue:</span> {selectedRecord.tissue_type}</p>
                                  <p><span className="font-medium">Species:</span> {selectedRecord.species_name}</p>
                                  <p><span className="font-medium">Publication Year:</span> {selectedRecord.publication_year ?? ""}</p>
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
          {records.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, records.length)} of {records.length} results
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
