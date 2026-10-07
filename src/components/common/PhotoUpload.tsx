import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface PhotoUploadProps {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
  label?: string;
  helperText?: string;
}

// Sample realistic campus lost & found item photos for quick testing
const SAMPLE_ITEM_PHOTOS = [
  {
    name: 'Sony Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Nike Sneakers',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'MacBook Pro',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hydro Flask',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Leather Wallet',
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Campus Keys',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  },
];

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  imageUrls,
  onChange,
  maxPhotos = 4,
  label = 'Upload Item Photos for Review',
  helperText = 'Add high-clarity photos from different angles (PNG, JPG, WebP up to 10MB)',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxPhotos - imageUrls.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          onChange([...imageUrls, e.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    const next = [...imageUrls];
    next.splice(index, 1);
    onChange(next);
  };

  const addPresetPhoto = (url: string) => {
    if (imageUrls.length >= maxPhotos) return;
    if (!imageUrls.includes(url)) {
      onChange([...imageUrls, url]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} <span className="text-slate-400 font-normal">({imageUrls.length}/{maxPhotos})</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-[11px] font-bold text-[#22a36b] hover:text-[#1c8c5c] flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showPresets ? 'Hide Sample Photos' : 'Choose Sample Photo'}</span>
        </button>
      </div>

      {/* Preset Photo Picker */}
      {showPresets && (
        <div className="p-3 bg-[#e8f7ee] rounded-2xl border border-[#22a36b]/30 space-y-2 animate-fade-in">
          <span className="text-[10px] font-bold text-[#1c8c5c] uppercase tracking-wider block">
            Click to attach realistic campus lost &amp; found sample photo:
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {SAMPLE_ITEM_PHOTOS.map((sample) => {
              const isSelected = imageUrls.includes(sample.url);
              return (
                <button
                  type="button"
                  key={sample.name}
                  onClick={() => addPresetPhoto(sample.url)}
                  disabled={isSelected || imageUrls.length >= maxPhotos}
                  className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${
                    isSelected
                      ? 'border-[#22a36b] opacity-50 ring-2 ring-[#22a36b]'
                      : 'border-white hover:border-[#22a36b] hover:scale-105'
                  }`}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold py-0.5 px-1 truncate block">
                    {sample.name}
                  </span>
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#22a36b]/60 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      {imageUrls.length < maxPhotos && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#22a36b] bg-[#e8f7ee]'
              : 'border-slate-300 hover:border-[#22a36b] bg-[#f8faf9] hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="w-11 h-11 rounded-2xl bg-white text-[#22a36b] shadow-soft border border-slate-200 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>

          <div>
            <div className="text-xs font-bold text-slate-800">
              <span className="text-[#22a36b] underline">Click to upload photo</span> or drag and drop
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{helperText}</p>
          </div>
        </div>
      )}

      {/* Photo Preview Thumbnails */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-soft group"
            >
              <img
                src={url}
                alt={`Uploaded ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white">
                Photo #{idx + 1}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(idx);
                }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md hover:bg-rose-700 transition-transform active:scale-90"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
