'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, File, ArrowLeft, Clock, HardDrive, Download } from "lucide-react";

interface FileItem {
  Key: string;
  Size: number;
  LastModified: string;
}

interface ApiResponse {
  files: FileItem[];
  folders: string[];
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export default function FileBrowser() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  const fetchData = async (prefix: string = "") => {
    setLoading(true);
    try {
      const url = prefix 
        ? `/api/objects?prefix=${encodeURIComponent(prefix)}`
        : "/api/objects";
      
      const response = await fetch(url);
      const result: ApiResponse = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPath);
  }, [currentPath]);

  const handleFolderClick = (folderName: string) => {
    setPathHistory([...pathHistory, currentPath]);
    setCurrentPath(folderName);
  };

  const handleBackClick = () => {
    if (pathHistory.length > 0) {
      const newHistory = [...pathHistory];
      const previousPath = newHistory.pop();
      setPathHistory(newHistory);
      setCurrentPath(previousPath || "");
    }
  };

  const handleRootClick = () => {
    setPathHistory([]);
    setCurrentPath("");
  };

  const isFile = (key: string) => {
    return key.endsWith("/") === false;
  };

  const handleDownload = (e: React.MouseEvent, fileKey: string) => {
    e.stopPropagation();
    const downloadUrl = `/api/download?key=${encodeURIComponent(fileKey)}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileKey.split("/").pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRootClick}
            className="text-sm"
          >
            Home
          </Button>
          {pathHistory.length > 0 && (
            <>
              <span className="text-gray-400">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                className="gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </>
          )}
        </div>
        {currentPath && (
          <div className="mt-2 text-sm text-gray-600 truncate">
            Current path: {currentPath}
          </div>
        )}
      </div>

      {/* Files and Folders List */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="divide-y">
          {/* Folders */}
          {data?.folders.map((folder, index) => {
            // Remove the trailing slash for display
            const displayName = folder.replace(/\/$/, "");
            const folderName = displayName.split("/").pop() || displayName;
            
            return (
              <button
                key={index}
                onClick={() => handleFolderClick(folder)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left group cursor-pointer"
              >
                <Folder className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {folderName}
                  </div>
                  <div className="text-xs text-gray-500">Folder</div>
                </div>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowLeft className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                </div>
              </button>
            );
          })}

          {/* Files */}
          {data?.files
            .filter((file) => isFile(file.Key))
            .map((file, index) => {
              const fileName = file.Key.split("/").pop();
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {fileName}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        {formatFileSize(file.Size)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(file.LastModified)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleDownload(e, file.Key)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="h-4 w-4 text-green-600" />
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Empty State */}
          {data && data.folders.length === 0 && data.files.filter((f) => isFile(f.Key)).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>This folder is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      {data && (
        <div className="mt-4 text-sm text-gray-600">
          {data.folders.length} folder{data.folders.length !== 1 ? "s" : ""} •{" "}
          {data.files.filter((f) => isFile(f.Key)).length} file
          {data.files.filter((f) => isFile(f.Key)).length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

