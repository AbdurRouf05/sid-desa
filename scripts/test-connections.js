const fs = require('fs');
const path = require('path');

// Manually load .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const parts = trimmed.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        }
    });
}

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const MINIO_URL = process.env.MINIO_ENDPOINT;

console.log('🚀 Starting Connection Tests...\n');

async function checkPocketBase() {
    console.log(`📡 Checking PocketBase at: ${PB_URL}`);
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // PocketBase health check endpoint
        const response = await fetch(`${PB_URL}/api/health`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            console.log(`✅ PocketBase Online! (Status: ${response.status})`);
            console.log(`   Message: ${data.message || 'OK'}`);
            return true;
        } else {
            console.error(`❌ PocketBase Error: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (err) {
        console.error(`❌ PocketBase Unreachable: ${err.message}`);
        return false;
    }
}

async function checkMinIO() {
    console.log(`\n🗄️  Checking MinIO at: ${MINIO_URL}`);
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // MinIO health check
        const response = await fetch(`${MINIO_URL}/minio/health/live`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            console.log(`✅ MinIO Online! (Status: ${response.status})`);
            return true;
        } else {
            console.error(`❌ MinIO Error: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (err) {
        console.error(`❌ MinIO Unreachable: ${err.message}`);
        return false;
    }
}

async function run() {
    if (!PB_URL || !MINIO_URL) {
        console.error('❌ Missing URL configuration in .env');
        process.exit(1);
    }

    const pbStatus = await checkPocketBase();
    const minioStatus = await checkMinIO();

    if (pbStatus && minioStatus) {
        console.log('\n🎉 All Systems Operational!');
        process.exit(0);
    } else {
        console.log('\n⚠️  Some systems are offline.');
        process.exit(1);
    }
}

run();
