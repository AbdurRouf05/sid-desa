
import imageCompression from 'browser-image-compression';

export async function processImageForUpload(file: File, logoUrl?: string): Promise<File> {


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


        // 2. Add Watermark via Canvas
        const watermarkedBlob = await addWatermark(compressedBlob, logoUrl);

        // 3. Convert back to File
        const finalFile = new File([watermarkedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now()
        });


        return finalFile;

    } catch (error) {
        console.error("Image processing failed:", error);
        throw error;
    }
}

async function addWatermark(imageBlob: Blob, logoUrl?: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(imageBlob);

        img.onload = async () => {
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
            const fontSize = Math.max(20, Math.floor(canvas.width * 0.025)); // Responsive font size
            const padding = Math.floor(fontSize * 1.5);

            // Coordinates (Bottom Left)
            let x = padding;
            const y = canvas.height - padding;

            // Load & Draw Logo if available
            if (logoUrl) {
                try {
                    const logoImg = new Image();
                    logoImg.crossOrigin = "anonymous"; // Prevent taint
                    logoImg.src = logoUrl;

                    await new Promise((r, f) => {
                        logoImg.onload = r;
                        logoImg.onerror = () => { console.warn("Logo load failed, skipping"); r(null); }; // Don't fail entire process
                    });

                    // Draw Logo (Resize to appropriate height)
                    const logoHeight = fontSize * 2.5;
                    const logoWidth = (logoImg.width / logoImg.height) * logoHeight;

                    // Draw logo with shadow
                    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                    ctx.shadowBlur = 4;
                    ctx.drawImage(logoImg, x, y - logoHeight, logoWidth, logoHeight);

                    // Shift text to the right of logo
                    x += logoWidth + (fontSize * 0.5);

                } catch (e) {
                    console.warn("Watermark logo processing error", e);
                }
            }

            // Draw Text "bmtnulumajang.id"
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';

            ctx.fillText("bmtnulumajang.id", x, y - (fontSize * 0.2));

            // Optional: Draw smaller text below or above if needed, but user asked for just address
            // ctx.font = `${Math.floor(fontSize * 0.7)}px sans-serif`;
            // ctx.fillText("BMT NU Lumajang", x, y - fontSize - 5);

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
