
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { processExcelFile } from "@/utils/excelUtils";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onProcessingStart: () => void;
  onProcessingComplete: (data: any) => void;
  onProcessingError: (error: string) => void;
}

const FileUploader = ({
  onProcessingStart,
  onProcessingComplete,
  onProcessingError,
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        onProcessingError("Please upload a valid Excel file (.xlsx or .xls)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      onProcessingError("Please select a file first");
      return;
    }

    try {
      setIsUploading(true);
      onProcessingStart();

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      // Process the file
      const result = await processExcelFile(selectedFile);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onProcessingComplete(result);
      }, 500);
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error("Processing error:", error);
      onProcessingError("Error processing file. Please check the format and try again.");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-2 bg-muted/50 p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <label htmlFor="file-upload" className="cursor-pointer text-edu-secondary font-medium">
              Click to upload
            </label>{" "}
            or drag and drop
            <p>Excel files only (.xlsx, .xls)</p>
          </div>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </Card>

      {selectedFile && (
        <div className="bg-muted/30 p-3 rounded-md">
          <p className="text-sm font-medium">Selected file:</p>
          <p className="text-sm text-muted-foreground truncate">{selectedFile.name}</p>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-xs text-center text-muted-foreground">
            {uploadProgress < 100 ? "Processing..." : "Finalizing..."}
          </p>
        </div>
      )}

      <Button 
        onClick={handleProcess} 
        className="w-full bg-edu-secondary hover:bg-edu-accent"
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? "Processing..." : "Process File"}
      </Button>
    </div>
  );
};

export default FileUploader;
