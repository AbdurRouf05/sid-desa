const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('🔍 Starting Environment Variable Verification...');

try {
    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: .env file not found at ' + envPath);
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                envVars[key] = value;
            }
        }
    });

    const requiredVars = [
        'NEXT_PUBLIC_APP_URL',
        'NEXT_PUBLIC_ROOT_DOMAIN',
        'NEXT_PUBLIC_POCKETBASE_URL',
        'MINIO_ENDPOINT',
        'MINIO_BUCKET',
        'ADMIN_EMAIL'
    ];

    let missing = 0;

    console.log('\n📋 Variable Status:');
    requiredVars.forEach(key => {
        if (envVars[key]) {
            // Mask value: show first 4 chars, then stars
            const val = envVars[key];
            const masked = val.length > 8
                ? val.substring(0, 4) + '****' + val.substring(val.length - 2)
                : '****';
            console.log(`✅ ${key}: Found (${masked})`);
        } else {
            console.log(`❌ ${key}: MISSING`);
            missing++;
        }
    });

    if (missing > 0) {
        console.log(`\n❌ Verification Failed: ${missing} variables missing.`);
        process.exit(1);
    } else {
        console.log('\n✅ Verification Success: All required variables are present.');
    }

} catch (err) {
    console.error('❌ Unexpected Error:', err);
    process.exit(1);
}
