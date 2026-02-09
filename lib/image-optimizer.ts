
/**
 * Smart Image Optimizer
 * 
 * Uses HTML5 Canvas to resize, compress, and convert images client-side
 * before uploading to the server.
 */

type OptimizationConfig = {
    maxWidth: number;
    maxHeight: number;
    quality: number; // 0.1 to 1.0
    format: "image/webp" | "image/jpeg" | "image/png";
};

const LOGO_CONFIG: OptimizationConfig = {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.9,
    format: "image/webp"
};

const FAVICON_CONFIG: OptimizationConfig = {
    maxWidth: 256,
    maxHeight: 256,
    quality: 1.0,
    format: "image/png"
};

const OG_CONFIG: OptimizationConfig = {
    maxWidth: 1200,
    maxHeight: 630,
    quality: 0.8,
    format: "image/webp"
};

export async function optimizeImage(file: File, type: 'logo' | 'favicon' | 'og'): Promise<File> {
    return new Promise((resolve, reject) => {
        // 1. Create Image Object
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            // 2. Determine Config
            let config = LOGO_CONFIG;
            if (type === 'favicon') config = FAVICON_CONFIG;
            if (type === 'og') config = OG_CONFIG;

            // 3. Calculate New Dimensions (Keep Aspect Ratio)
            let width = img.width;
            let height = img.height;

            if (width > config.maxWidth) {
                height = Math.round(height * (config.maxWidth / width));
                width = config.maxWidth;
            }
            // Height check (secondary, usually width matters more for web)
            if (height > config.maxHeight) {
                width = Math.round(width * (config.maxHeight / height));
                height = config.maxHeight;
            }

            // 4. Draw to Canvas
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error("Browser does not support Canvas operations"));
                return;
            }

            // High quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // 5. Convert to Blob -> File
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Image conversion failed"));
                    return;
                }

                // Determine new filename extension
                const ext = config.format.split('/')[1]; // webp, png, jpeg
                const newName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;

                const optimizedFile = new File([blob], newName, {
                    type: config.format,
                    lastModified: Date.now(),
                });


                resolve(optimizedFile);

                // Cleanup
                URL.revokeObjectURL(img.src);

            }, config.format, config.quality);
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(img.src);
            reject(new Error("Failed to load image for optimization"));
        };
    });
}
