
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToExcel } from "@/utils/excelUtils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResultsDisplayProps {
  data: {
    allocations: any[];
    stats: {
      totalStudents: number;
      allocatedStudents: number;
      unallocatedStudents: number;
    };
  };
}

const ResultsDisplay = ({ data }: ResultsDisplayProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  
  const departments = ["all", ...new Set(data.allocations.map(item => item.department))];
  
  const filteredAllocations = data.allocations.filter(allocation => {
    const matchesSearch = 
      allocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.allocatedCourse.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || allocation.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleExportExcel = () => {
    exportToExcel(data.allocations, "course_allocations");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Allocation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-edu-primary">{data.stats.totalStudents}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allocated</p>
                <p className="text-2xl font-bold text-green-600">{data.stats.allocatedStudents}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unallocated</p>
                <p className="text-2xl font-bold text-red-500">{data.stats.unallocatedStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleExportExcel} className="w-full md:w-auto bg-edu-primary hover:bg-edu-secondary">
          <Download className="w-4 h-4 mr-2" /> Export to Excel
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Allocation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-2/3">
              <Input
                placeholder="Search by name, UID or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>UID</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Allocated Course</TableHead>
                  <TableHead>Preference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAllocations.length > 0 ? (
                  filteredAllocations.map((allocation, index) => (
                    <TableRow key={allocation.uid}>
                      <TableCell>{allocation.srno}</TableCell>
                      <TableCell className="font-medium">{allocation.name}</TableCell>
                      <TableCell>{allocation.uid}</TableCell>
                      <TableCell>{allocation.cgpa}</TableCell>
                      <TableCell>{allocation.department}</TableCell>
                      <TableCell>{allocation.allocatedCourse || "Not Allocated"}</TableCell>
                      <TableCell>
                        {allocation.preferenceNumber ? 
                          `Preference ${allocation.preferenceNumber}` : 
                          "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
