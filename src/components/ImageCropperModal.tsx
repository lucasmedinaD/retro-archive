
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropUtils';
import { X, Check } from 'lucide-react';

interface ImageCropperModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    aspect?: number;
    onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropperModal({
    isOpen,
    onClose,
    imageSrc,
    aspect = 4 / 5, // Default for transformations
    onCropComplete
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = useCallback((crop: { x: number; y: number }) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const handleCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedBlob);
            onClose();
        } catch (e) {
            console.error('Crop failed:', e);
            alert('Failed to crop image');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90">
            <div className="relative w-full max-w-2xl bg-[#0a0a0a] border-2 border-white rounded-lg p-4 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold uppercase">Adjust Image</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <div className="relative w-full h-[60vh] bg-[#111] mb-6 rounded-lg overflow-hidden border border-gray-800">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onCropComplete={handleCropComplete}
                        onZoomChange={onZoomChange}
                        showGrid={true}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400 uppercase w-12">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            disabled={isProcessing}
                            className="flex-1 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {isProcessing ? 'Processing...' : <><Check size={18} /> Apply Crop</>}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-white text-white font-bold uppercase hover:bg-white hover:text-black transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
