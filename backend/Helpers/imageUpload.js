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
    // console.log('Uploading image...');
    // console.log('Original Name:', originalname);
    // console.log('MIME Type:', mimeType);
    
    try {
        // Create a readable stream from the buffer
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null); // Signifies the end of the stream

        const driveResponse = await drive.files.create({
            requestBody: {
                name: originalname,
                mimeType: mimeType,
                parents: [folderId ||process.env.GOOGLE_DRIVE_FOLDER_ID],
            },
            media: {
                mimeType: mimeType,
                body: bufferStream,
            },
            fields: 'id',
            auth,
        });

        const fileId = driveResponse.data.id;
        const imageUrl = `https://drive.google.com/uc?id=${fileId}`;
        // console.log('Image uploaded successfully. File ID:', fileId);
        // console.log('Image URL:', imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw new Error('Error uploading image: ' + error.message);
    }
};
