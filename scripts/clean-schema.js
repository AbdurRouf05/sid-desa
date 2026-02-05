const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../pb_schema.json');
const outputPath = path.join(__dirname, '../pb_schema_import.json');

try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const schema = JSON.parse(raw);

    // Recursively remove 'id' fields
    function clean(obj) {
        if (Array.isArray(obj)) {
            return obj.map(clean);
        } else if (typeof obj === 'object' && obj !== null) {
            const newObj = {};
            for (const key in obj) {
                if (key === 'id') continue; // Skip ID
                newObj[key] = clean(obj[key]);
            }
            return newObj;
        }
        return obj;
    }

    const cleanedSchema = clean(schema);
    fs.writeFileSync(outputPath, JSON.stringify(cleanedSchema, null, 4));
    console.log("✅ Cleaned schema saved to:", outputPath);
} catch (e) {
    console.error("Error cleaning schema:", e);
}
