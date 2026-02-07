
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log("NEXT_PUBLIC_POCKETBASE_URL:", process.env.NEXT_PUBLIC_POCKETBASE_URL);
console.log("POCKETBASE_ADMIN_EMAIL:", process.env.POCKETBASE_ADMIN_EMAIL ? "Set" : "Not Set");
