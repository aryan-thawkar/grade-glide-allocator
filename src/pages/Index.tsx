
import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/FileUploader";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { generateSampleTemplate } from "@/utils/excelUtils";

const Index = () => {
  const [processedData, setProcessedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = () => {
    try {
      generateSampleTemplate();
      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  };

  return (
    <div className="min-h-screen bg-edu-light">
      <header className="bg-edu-primary text-white py-6">
        <div className="container">
          <h1 className="text-3xl font-bold">Grade Glide Allocator</h1>
          <p className="mt-2 text-edu-light/90">Efficiently allocate courses based on student preferences and CGPA</p>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="results" disabled={!processedData}>Results</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Input Template</CardTitle>
                  <CardDescription>
                    Download a sample Excel template to see the required format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-muted-foreground">
                    The template contains three sheets with the following structures:
                  </p>
                  <ul className="mb-6 space-y-2 text-sm">
                    <li><strong>Sheet 1 (Students):</strong> srno, name, UID, CGPA, Department, preference 1, preference 2, preference 3...</li>
                    <li><strong>Sheet 2 (Departments):</strong> sr no, department name, course offered, total intake</li>
                    <li><strong>Sheet 3 (Courses):</strong> sr no, course name, CSE, Other departments...</li>
                  </ul>
                  <Button onClick={handleDownloadTemplate} className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload & Process</CardTitle>
                  <CardDescription>
                    Upload your Excel file and process the allocations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader 
                    onProcessingStart={() => setIsProcessing(true)}
                    onProcessingComplete={(data) => {
                      setProcessedData(data);
                      setIsProcessing(false);
                      toast.success("Processing complete! View the results tab.");
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

      <footer className="bg-edu-dark text-white py-4">
        <div className="container text-center text-sm">
          <p>© 2025 Grade Glide Allocator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
