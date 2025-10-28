'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Folder, File, ArrowLeft, Clock, HardDrive, Download, Upload, Trash2, Plus } from "lucide-react";

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

  const handleUpload = async (folderPath: string) => {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Create the full key path (folder path + filename)
      const fileName = file.name;
      const fullKey = folderPath ? `${folderPath}${fileName}` : fileName;
      
      try {
        // Get presigned URL with file size
        const params = new URLSearchParams({
          key: fullKey,
          contentType: file.type || 'application/octet-stream',
          fileSize: file.size.toString(),
        });
        const response = await fetch(`/api/upload?${params.toString()}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        
        if (!data.url) {
          throw new Error('No URL returned');
        }
        
        // Upload file using PUT request
        const uploadResponse = await fetch(data.url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Upload failed');
        }
        
        // Refresh the file list
        fetchData(currentPath);
        
        // Notify storage update
        window.dispatchEvent(new Event('storageUpdated'));
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
      }
      
      document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
  };

  const handleDelete = async (e: React.MouseEvent, fileKey: string) => {
    e.stopPropagation();
    
    const fileName = fileKey.split("/").pop();
    const confirmed = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    
    if (!confirmed) return;
    
    try {
      const response = await fetch(`/api/delete?key=${encodeURIComponent(fileKey)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error('Delete failed');
      }
      
      // Refresh the file list
      fetchData(currentPath);
      
      // Notify storage update
      window.dispatchEvent(new Event('storageUpdated'));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt('Enter folder name:');
    
    if (!folderName || !folderName.trim()) {
      return;
    }
    
    // Remove any slashes from the folder name
    const cleanFolderName = folderName.trim().replace(/\//g, '');
    
    try {
      const response = await fetch('/api/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderPath: cleanFolderName,
          parentPath: currentPath,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error('Failed to create folder');
      }
      
      // Refresh the file list
      fetchData(currentPath);
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder. Please try again.');
    }
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
        <div className="flex items-center justify-between">
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
                  className="gap-1 hover:bg-gray-200 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateFolder}
              className="gap-2 bg-white-600 hover:bg-gray-200 text-black cursor-pointer"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Create Folder
            </Button>
            <Button
              onClick={() => handleUpload(currentPath)}
              className="gap-2 bg-white-600 hover:bg-gray-200 text-black cursor-pointer"
              size="sm"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
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
                    <button
                      onClick={(e) => handleDelete(e, file.Key)}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Empty State */}
          {data && data.folders.length === 0 && data.files.filter((f) => isFile(f.Key)).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Folder className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Upload your files to get started</p>
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

