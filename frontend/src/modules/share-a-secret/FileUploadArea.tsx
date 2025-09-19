"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/Icon";
import SecondaryButton from "@/components/common/SecondaryButton";

type FileUploadAreaProps = {
  file: File | null;
  loading: boolean;
  setFile: (file: File | null) => void;
  disabled?: boolean;
};

export default function FileUploadArea({
  file,
  loading,
  setFile,
  disabled = false,
}: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSize = 100 * 1024 * 1024; // 100MB

  const allowedTypes = [
    'text/plain',
    'text/csv',
    'application/pdf',
    'application/json',
    'application/xml',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return "File size must be less than 100MB";
    }
    if (!allowedTypes.includes(file.type)) {
      return "File type not supported";
    }
    return null;
  };

  const handleFile = useCallback((selectedFile: File) => {
    setError(null);
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFile(selectedFile);
  }, [setFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled || loading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [disabled, loading, handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !loading) {
      setIsDragOver(true);
    }
  }, [disabled, loading]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    setError(null);
  }, [setFile]);



  return (
    <div className="bg-neutral-925 w-full flex flex-col items-center justify-between">
      <div className="w-full relative flex flex-col">
        <div
          className={cn(
            "w-full border border-dashed text-center transition-colors cursor-pointer",
            "p-4 border-neutral-800",
            isDragOver
              ? "border-blue-400 bg-blue-50/5"
              : !file ?  " hover:border-neutral-700 hover:bg-neutral-900" : "",
            disabled || loading ? "opacity-50 cursor-not-allowed" : ""
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!disabled && !loading && !file) {
              document.getElementById('file-input')?.click();
            }
          }}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileInput}
            disabled={disabled || loading}
            accept={allowedTypes.join(',')}
          />

            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 bg-neutral-925 border border-neutral-800 flex items-center justify-center", file && "border-neutral-700")}>
                  {file ?  <Icon name="upload_file" size={16} className="text-yellow-300" />:  <Icon name="attach_file_add" size={16} className="text-neutral-300" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-200">
                    {file ? file.name : "Drag & Drop or Click to Upload a File"}
                </p>
                <p className="text-xs text-neutral-400">
                    {file ? formatFileSize(file.size) : "Max 50MB • PDF, Images, Documents, Archives"}
                </p>
              </div>
            </div>

            {file && !loading && (
                <div className={"absolute right-0 mr-4 top-0 h-full flex items-center justify-center"}>

                    <SecondaryButton
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                        }}
                        className={"h-8 w-8 p-0 group"}
                        aria-label="Remove file"
                    >
                        <Icon name="close" size={16} className="group-hover:text-red-400" />
                    </SecondaryButton>
                </div>

            )}
        </div>

        {error && (
          <div className="mt-3 text-xs text-red-400 flex items-center gap-1">
            <Icon name="error" size={14} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}


export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};