"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Search, Calendar } from "lucide-react"

export function SearchAndFilterArea() {
  const [yearRange, setYearRange] = useState([2020, 2024])
  const [searchTerm, setSearchTerm] = useState("")

  const tissues = ["Brain", "Heart", "Liver", "Kidney", "Lung", "Muscle", "Blood", "Skin"]

  return (
    <div className="space-y-6 h-fit">
      {/* Keyword Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Keyword Search</Label>
              <Input
                id="search"
                placeholder="Search markers, cell types, tissues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temporal Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Publication Year</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>
                Year Range: {yearRange[0]} - {yearRange[1]}
              </Label>
              <Slider value={yearRange} onValueChange={setYearRange} max={2024} min={2000} step={1} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tissue Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tissue Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {tissues.map((tissue) => (
              <div key={tissue} className="flex items-center space-x-2">
                <Checkbox id={tissue} />
                <Label htmlFor={tissue} className="text-sm font-normal">
                  {tissue}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
