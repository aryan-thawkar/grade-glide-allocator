
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        onProcessingError("Please upload a valid Excel file (.xlsx or .xls)");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
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

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
          <div className={`p-3 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-slate-200'}`}>
            <Upload className={`h-6 w-6 ${isDragging ? 'text-blue-600' : 'text-slate-600'}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              <label htmlFor="file-upload" className="cursor-pointer text-blue-600 font-medium hover:underline">
                Click to upload
              </label>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">Excel files only (.xlsx, .xls)</p>
          </div>
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {selectedFile && (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Selected file:</p>
                <p className="text-sm text-slate-600 truncate max-w-[200px]">{selectedFile.name}</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600">Processing...</span>
            <span className="text-blue-600 font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-slate-500">
            {uploadProgress < 100 ? "Processing file data..." : "Almost done..."}
          </p>
        </div>
      )}

      <Button 
        onClick={handleProcess} 
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 h-10"
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? (
          <>Processing...</>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Process File
          </>
        )}
      </Button>
    </div>
  );
};

export default FileUploader;
