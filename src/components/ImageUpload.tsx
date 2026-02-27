import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <label
          className={`
            relative flex flex-col items-center justify-center w-full h-64 
            border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-200 ease-in-out
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-50/50' 
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
            }
          `}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <Upload className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="mb-2 text-sm text-slate-700 font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              Casual selfie (PNG, JPG or WEBP)
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={onFileSelect} />
        </label>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-square max-w-sm mx-auto">
          <img 
            src={selectedImage} 
            alt="Selected selfie" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={() => onImageSelect('')}
              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3" />
            Source Photo
          </div>
        </div>
      )}
    </div>
  );
};
