import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const collections = ['users', 'students', 'companies', 'jobs', 'applications', 'interviews', 'messages', 'notifications', 'placementreports', 'resumes'];
        
        console.log('Database Document Counts:');
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col).countDocuments();
            console.log(`${col}: ${count}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error connecting to DB', err);
        process.exit(1);
    }
};

checkDb();
