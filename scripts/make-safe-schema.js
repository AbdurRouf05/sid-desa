const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../pb_schema_import.json');
const outputPath = path.join(__dirname, '../pb_schema_safe.json');

try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const schema = JSON.parse(raw);

    // Remove indexes to prevent SQL errors
    schema.forEach(collection => {
        collection.indexes = [];
    });

    fs.writeFileSync(outputPath, JSON.stringify(schema, null, 4));
    console.log("✅ Safe schema (no indexes) saved to:", outputPath);
} catch (e) {
    console.error("Error creating safe schema:", e);
}
