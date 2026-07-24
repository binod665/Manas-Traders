import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const PRESET_IMAGES = [
  { name: 'Jeera Rice Bag', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
  { name: 'Mustard Oil Bottle', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80' },
  { name: 'Atta Bag', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80' },
  { name: 'Pulses & Daal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&q=80' },
  { name: 'Aromatic Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80' },
  { name: 'Fresh Red Onions', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=500&q=80' },
  { name: 'Vegetables Basket', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80' },
  { name: 'Wai Wai Noodles', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'url' | 'file'>('preset');
  const [urlInput, setUrlInput] = useState(value);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Product Image
      </label>

      {/* Preview Box */}
      {value && (
        <div className="relative w-full h-36 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center group">
          <img
            src={value}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
            }}
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs font-bold text-white bg-slate-800/80 px-3 py-1.5 rounded-full backdrop-blur-xs">
              Current Image
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold text-slate-500">
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'preset' ? 'border-[#0B7A3D] text-[#0B7A3D]' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Presets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'url' ? 'border-[#0B7A3D] text-[#0B7A3D]' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('file')}
          className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'file' ? 'border-[#0B7A3D] text-[#0B7A3D]' : 'border-transparent hover:text-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Local
        </button>
      </div>

      {/* Preset Selector */}
      {activeTab === 'preset' && (
        <div className="grid grid-cols-4 gap-2">
          {PRESET_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(preset.url)}
              className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                value === preset.url ? 'border-[#0B7A3D] ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-80 hover:opacity-100'
              }`}
            >
              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              {value === preset.url && (
                <div className="absolute top-1 right-1 bg-[#0B7A3D] text-white p-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* URL Input */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B7A3D]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-2 bg-[#0B7A3D] text-white text-xs font-bold rounded-xl hover:bg-emerald-800"
          >
            Apply URL
          </button>
        </div>
      )}

      {/* File Upload */}
      {activeTab === 'file' && (
        <label className="border-2 border-dashed border-slate-300 hover:border-[#0B7A3D] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/50">
          <Upload className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs font-bold text-slate-700">Click to choose image file</span>
          <span className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};
