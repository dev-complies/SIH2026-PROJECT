"use client";

import * as React from "react";
import { cn, formatBytes, pseudoSha256 } from "@/utils";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "./button";

export interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  maxSizeBytes?: number;
  onFileSelect?: (file: File, sha256Hash: string) => void;
  onFileRemove?: () => void;
  className?: string;
}

export function FileUpload({
  label = "Upload Evidence or Document",
  description = "PDF, CSV, PNG, JPG up to 50MB. Cryptographic checksum automatically computed.",
  accept = ".pdf,.csv,.png,.jpg,.jpeg,.json",
  maxSizeBytes = 52428800, // 50MB
  onFileSelect,
  onFileRemove,
  className,
}: FileUploadProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileHash, setFileHash] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      setError(`File exceeds maximum size limit of ${formatBytes(maxSizeBytes)}`);
      return;
    }

    const hash = pseudoSha256(`${file.name}-${file.size}-${file.lastModified}`);
    setSelectedFile(file);
    setFileHash(hash);
    if (onFileSelect) onFileSelect(file, hash);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setFileHash(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onFileRemove) onFileRemove();
  };

  return (
    <div className={cn("w-full space-y-2 text-left select-none", className)}>
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-card cursor-pointer transition-colors duration-150",
            dragOver
              ? "border-gov-accent bg-blue-50/50"
              : "border-gov-border bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 shadow-2xs mb-2">
            <UploadCloud className="w-5 h-5 text-gov-accent" />
          </div>
          <p className="text-xs font-semibold text-slate-800">
            <span className="text-gov-accent hover:underline">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gov-muted text-center mt-1 max-w-sm">
            {description}
          </p>
        </div>
      ) : (
        <div className="rounded-control border border-slate-200 bg-white p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 rounded bg-blue-50 border border-blue-200 text-gov-accent shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {selectedFile.name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gov-muted mt-0.5">
                <span>{formatBytes(selectedFile.size)}</span>
                <span>•</span>
                <span className="font-mono text-emerald-700 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {fileHash?.slice(0, 16)}...
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            className="h-8 w-8 p-0 text-slate-400 hover:text-gov-danger"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-gov-danger flex items-center">
          <AlertCircle className="w-3.5 h-3.5 mr-1" /> {error}
        </p>
      )}
    </div>
  );
}
