import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    },
    region: 'ap-south-2',
});

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { folderPath, parentPath } = body;

    if (!folderPath) {
        return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    try {
        // Construct the full folder path
        let fullFolderPath = '';
        if (parentPath) {
            fullFolderPath = `${parentPath}${folderPath}/`;
        } else {
            fullFolderPath = `${folderPath}/`;
        }
        
        // Add user prefix
        const userKey = `${userId}/${fullFolderPath}`;
        
        // Create a placeholder file to represent the folder
        // In S3, folders don't really exist, so we create an empty object
        const command = new PutObjectCommand({
            Bucket: 'fluxbox',
            Key: userKey,
            Body: '',
        });

        await client.send(command);

        return NextResponse.json({ success: true, path: fullFolderPath });
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}

