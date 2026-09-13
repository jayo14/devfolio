import { useState, useRef } from "react";
import { UploadCloud, Loader2, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useAdminStore } from "../lib/adminStore.js";

export default function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = "https://...",
  required = false,
  description = null,
}) {
  const uploadImage = useAdminStore((s) => s.uploadImage);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed (.png, .jpg, .webp, .svg, etc.)");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const res = await uploadImage(file);
      // Use the storage URL returned (fullUrl or relative url)
      const finalUrl = res.fullUrl || res.url;
      onChange(finalUrl);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image to storage");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    onChange("");
    setUploadError(null);
  };

  return (
    <div className="admin-field space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <span className="font-inconsolata text-xs tracking-wider uppercase text-white/90">
          {label}
          {required && <b className="text-accent ml-1">*</b>}
        </span>
        {description && <span className="text-[11px] text-white/50">{description}</span>}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-4 border border-dashed transition-all cursor-pointer rounded-none bg-[#080808] ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-line hover:border-white/40"
        } ${uploading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex items-center gap-2 py-3 font-inconsolata text-xs text-accent">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>UPLOADING TO NEON STORAGE...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 py-1 text-center">
            <UploadCloud className={`h-5 w-5 ${isDragging ? "text-accent" : "text-white/60"}`} />
            <p className="font-inconsolata text-xs text-white/80">
              <span className="text-accent font-medium">Click to upload</span> or drag and drop image
            </p>
            <p className="font-inconsolata text-[10px] text-white/40 uppercase tracking-wider">
              PNG, JPG, WEBP, SVG UP TO 15MB • SAVED TO NEON STORAGE
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <p className="font-inconsolata text-[11px] text-red-400 mt-1">
          [ERROR] {uploadError}
        </p>
      )}

      {/* Live Preview & URL input */}
      <div className="flex items-center gap-2 mt-2">
        {value && (
          <div className="relative group shrink-0 h-10 w-10 border border-line bg-black overflow-hidden flex items-center justify-center">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-accent"
                title="View full image"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        <div className="relative flex-1">
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className="admin-input font-inconsolata text-xs !py-2.5 !pr-8 w-full"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
              title="Clear image URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
