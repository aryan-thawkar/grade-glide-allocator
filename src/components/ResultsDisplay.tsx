
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, UserCheck, UserX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToExcel } from "@/utils/excelUtils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const [allocationType, setAllocationType] = useState("all");
  
  const departments = ["all", ...new Set(data.allocations.map(item => item.department))];
  
  const filteredAllocations = data.allocations.filter(allocation => {
    const matchesSearch = 
      allocation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      allocation.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (allocation.allocatedCourse && allocation.allocatedCourse.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === "all" || allocation.department === filterDepartment;
    
    const matchesAllocation = 
      allocationType === "all" || 
      (allocationType === "allocated" && allocation.allocatedCourse) || 
      (allocationType === "unallocated" && !allocation.allocatedCourse);
    
    return matchesSearch && matchesDepartment && matchesAllocation;
  });

  const handleExportExcel = () => {
    exportToExcel(data.allocations, "course_allocations");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 shadow-md border border-slate-200">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl text-blue-800">Allocation Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs defaultValue="all" onValueChange={setAllocationType} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all" className="relative">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>All Students</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                    {data.stats.totalStudents}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="allocated" className="relative">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Allocated</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                    {data.stats.allocatedStudents}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="unallocated" className="relative">
                  <div className="flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    <span>Unallocated</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                    {data.stats.unallocatedStudents}
                  </div>
                </TabsTrigger>
              </TabsList>
              
              <div className="grid grid-cols-3 gap-6 mb-4 text-center">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-blue-800">{data.stats.totalStudents}</p>
                  <p className="text-xs text-blue-500 mt-1">100%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Allocated</p>
                  <p className="text-3xl font-bold text-green-700">{data.stats.allocatedStudents}</p>
                  <p className="text-xs text-green-500 mt-1">
                    {data.stats.totalStudents > 0 
                      ? Math.round((data.stats.allocatedStudents / data.stats.totalStudents) * 100) 
                      : 0}%
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-medium">Unallocated</p>
                  <p className="text-3xl font-bold text-red-700">{data.stats.unallocatedStudents}</p>
                  <p className="text-xs text-red-500 mt-1">
                    {data.stats.totalStudents > 0 
                      ? Math.round((data.stats.unallocatedStudents / data.stats.totalStudents) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-slate-200">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-lg text-blue-800">Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <Button onClick={handleExportExcel} className="w-full bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" /> Export to Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md border border-slate-200">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-xl text-blue-800">
            {allocationType === "all" && "All Students"}
            {allocationType === "allocated" && "Allocated Students"}
            {allocationType === "unallocated" && "Unallocated Students"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-2/3">
              <Input
                placeholder="Search by name, UID or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-300"
              />
            </div>
            <div className="w-full md:w-1/3">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="border-slate-300">
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

          <div className="border rounded-md overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50">
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
                    <TableRow key={allocation.uid} className="hover:bg-slate-50">
                      <TableCell>{allocation.srno}</TableCell>
                      <TableCell className="font-medium">{allocation.name}</TableCell>
                      <TableCell>{allocation.uid}</TableCell>
                      <TableCell>{allocation.cgpa}</TableCell>
                      <TableCell>
                        <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs inline-block">
                          {allocation.department}
                        </div>
                      </TableCell>
                      <TableCell>
                        {allocation.allocatedCourse ? (
                          <span className="text-green-600 font-medium">{allocation.allocatedCourse}</span>
                        ) : (
                          <span className="text-red-500">Not Allocated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {allocation.preferenceNumber ? (
                          <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs inline-block">
                            Preference {allocation.preferenceNumber}
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-center text-sm text-slate-500">
            Showing {filteredAllocations.length} of {data.allocations.length} students
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
