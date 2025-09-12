
import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Download, FileSpreadsheet, BarChart, Users, GraduationCap, Award } from "lucide-react";
import { generateSampleTemplate } from "@/utils/excelUtils";

const Index = () => {
  const [processedData, setProcessedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const handleDownloadTemplate = () => {
    try {
      generateSampleTemplate();
      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  };

  const handleStartProcess = () => {
    setActiveTab("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Grade Glide Allocator</h1>
              <p className="mt-2 text-blue-100">Efficiently allocate courses based on student preferences and CGPA</p>
            </div>
            {processedData && (
              <Button 
                onClick={() => setActiveTab("results")} 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                View Results
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="results" disabled={!processedData}>Results</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-6 py-12">
                <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Streamline Your Course Allocation Process</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Grade Glide Allocator helps educational institutions allocate courses to students 
                  based on their preferences and academic performance, efficiently and fairly.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button onClick={handleStartProcess} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button onClick={handleDownloadTemplate} variant="outline" size="lg">
                    <Download className="mr-2 h-4 w-4" /> Download Template
                  </Button>
                </div>
              </div>

              {/* Features Section */}
              <div className="py-12">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle>1. Upload Data</CardTitle>
                      <CardDescription>
                        Upload Excel file with student preferences, department offerings, and course details
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <BarChart className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle>2. Process Allocations</CardTitle>
                      <CardDescription>
                        Our algorithm allocates courses based on CGPA ranking and student preferences
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle>3. View & Export Results</CardTitle>
                      <CardDescription>
                        Review allocations, filter results, and export to Excel for distribution
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Benefits</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <GraduationCap className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Fair Allocation</h3>
                      <p className="text-gray-600">Ensures courses are allocated based on merit and student preferences, providing fair opportunities for all students.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-full shadow-md">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Time Efficient</h3>
                      <p className="text-gray-600">Automates the entire allocation process, reducing administrative work and eliminating manual errors.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-blue-800">Input Template</CardTitle>
                  <CardDescription>
                    Download a sample Excel template to see the required format
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-slate-600">
                    The template contains three sheets with the following structures:
                  </p>
                  <ul className="mb-6 space-y-2 text-sm pl-5 list-disc text-slate-600">
                    <li><strong>Sheet 1 (Students):</strong> srno, name, UID, CGPA, Department, preference 1, preference 2, preference 3...</li>
                    <li><strong>Sheet 2 (Departments):</strong> sr no, department name, course offered, total intake</li>
                    <li><strong>Sheet 3 (Courses):</strong> sr no, course name, CSE, Other departments...</li>
                  </ul>
                  <Button onClick={handleDownloadTemplate} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" /> Download Template
                  </Button>
                </CardContent>
              </Card>

              <Card className="border shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="text-blue-800">Upload & Process</CardTitle>
                  <CardDescription>
                    Upload your Excel file and process the allocations
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FileUploader 
                    onProcessingStart={() => setIsProcessing(true)}
                    onProcessingComplete={(data) => {
                      setProcessedData(data);
                      setIsProcessing(false);
                      toast.success("Processing complete! View the results tab.");
                      setActiveTab("results");
                    }}
                    onProcessingError={(error) => {
                      setIsProcessing(false);
                      toast.error(error);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results">
            {processedData && <ResultsDisplay data={processedData} />}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Grade Glide Allocator</h3>
              <p className="text-gray-300 max-w-md">A powerful tool for educational institutions to streamline course allocation based on student preferences and performance.</p>
            </div>
            <div className="md:text-right">
              <h3 className="text-xl font-bold mb-3">Quick Links</h3>
              <div className="flex md:justify-end gap-4">
                <button 
                  onClick={() => setActiveTab("home")}
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  Home
                </button>
                <button 
                  onClick={() => setActiveTab("upload")}
                  className="text-gray-300 hover:text-white hover:underline"
                >
                  Upload & Process
                </button>
                {processedData && (
                  <button 
                    onClick={() => setActiveTab("results")}
                    className="text-gray-300 hover:text-white hover:underline"
                  >
                    Results
                  </button>
                )}
              </div>
              <p className="text-gray-400 mt-6">© 2025 Grade Glide Allocator. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
