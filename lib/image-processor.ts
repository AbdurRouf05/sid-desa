
import imageCompression from 'browser-image-compression';

export async function processImageForUpload(file: File): Promise<File> {
    console.log("Starting image processing...", file.name, file.size);

    // 1. Initial Compression & Resize
    // Target: Max 1920px width, max 1MB size, convert to WebP
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
        initialQuality: 0.8
    };

    try {
        const compressedBlob = await imageCompression(file, options);
        console.log("Compression done:", compressedBlob.size);

        // 2. Add Watermark via Canvas
        const watermarkedBlob = await addWatermark(compressedBlob);

        // 3. Convert back to File
        const finalFile = new File([watermarkedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now()
        });

        console.log("Final processed file:", finalFile.name, finalFile.size);
        return finalFile;

    } catch (error) {
        console.error("Image processing failed:", error);
        throw error;
    }
}

async function addWatermark(imageBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageBlob);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }

            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Watermark Configuration
            const text = "BMT NU LUMAJANG";
            const fontSize = Math.max(24, Math.floor(canvas.width * 0.03)); // Responsive font size (3% of width)
            const padding = Math.floor(fontSize * 0.8);

            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';

            // X and Y coordinates (Bottom Right)
            const x = canvas.width - padding;
            const y = canvas.height - padding;

            // Shadow/Outline for readability on any background
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Draw Text (White)
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillText(text, x, y);

            // Add subtext domain if large enough
            if (fontSize > 16) {
                ctx.font = `${Math.floor(fontSize * 0.6)}px sans-serif`;
                ctx.fillText("bmtnu-lumajang.id", x, y - fontSize - 4);
            }

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Canvas to Blob failed"));
                }
            }, 'image/webp', 0.9);
        };

        img.onerror = (e) => reject(e);
    });
}
