import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config(); 

const drive = google.drive('v3');
const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
});

export const uploadImageToDrive = async (fileBuffer, originalname, mimeType, folderId) => {
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const bufferStream = new Readable();
            bufferStream.push(fileBuffer);
            bufferStream.push(null); // End of stream

            const driveResponse = await drive.files.create({
                requestBody: {
                    name: originalname,
                    mimeType: mimeType,
                    parents: [folderId || process.env.GOOGLE_DRIVE_FOLDER_ID],
                },
                media: {
                    mimeType: mimeType,
                    body: bufferStream,
                },
                fields: 'id',
                auth,
            });

            const fileId = driveResponse.data.id;
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w10000`;
        } catch (error) {
            if (error.code === 429) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                console.log(`Rate limited. Waiting for ${waitTime} ms before retrying...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.error('Error uploading image:', error.message);
                throw error;
            }
        }
    }
    throw new Error('Max retries reached for uploading image');
};

export const deleteImageFromDrive = async (imageUrl) => {
    const match = imageUrl.match(/id=([^&]+)/);
    if (!match) {
        throw new Error('Invalid image URL: unable to extract file ID');
    }
    const fileId = match[1];

    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            await drive.files.delete({
                fileId,
                auth,
            });
            console.log('Image deleted successfully.');
            return;
        } catch (error) {
            if (error.code === 429) {
                const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                console.log(`Rate limited. Waiting for ${waitTime} ms before retrying...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.error('Error deleting image:', error.message);
                throw error;
            }
        }
    }
    throw new Error('Max retries reached for deleting image');
};
