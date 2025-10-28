import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from '@clerk/nextjs/server';

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    },
    region: 'ap-south-2',
});

const MAX_STORAGE_PER_USER = 25 * 1024 * 1024; // 25MB in bytes

// Helper function to calculate total storage for a user
async function getUserStorage(userId: string): Promise<number> {
    const command = new ListObjectsV2Command({
        Bucket: 'fluxbox',
        Prefix: `${userId}/`,
    });

    const result = await client.send(command);
    
    const totalSize = result.Contents?.reduce((sum, obj) => {
        return sum + (obj.Size || 0);
    }, 0) || 0;

    return totalSize;
}

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = request.nextUrl.searchParams.get('key');
    const contentType = request.nextUrl.searchParams.get('contentType') || undefined;
    const fileSizeStr = request.nextUrl.searchParams.get('fileSize');

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    if (!fileSizeStr) {
        return NextResponse.json({ error: 'File size is required' }, { status: 400 });
    }

    const fileSize = parseInt(fileSizeStr);
    
    if (isNaN(fileSize) || fileSize < 0) {
        return NextResponse.json({ error: 'Invalid file size' }, { status: 400 });
    }

    try {
        // Check total storage for user
        const currentStorage = await getUserStorage(userId);
        const newTotalStorage = currentStorage + fileSize;

        if (newTotalStorage > MAX_STORAGE_PER_USER) {
            const usedMB = (currentStorage / (1024 * 1024)).toFixed(2);
            const limitMB = (MAX_STORAGE_PER_USER / (1024 * 1024)).toFixed(0);
            return NextResponse.json({ 
                error: `Storage limit exceeded. You have used ${usedMB} MB. Maximum allowed is ${limitMB} MB per account.` 
            }, { status: 403 });
        }

        // Prefix the key with user ID
        const userKey = `${userId}/${key}`;
        
        const command = new PutObjectCommand({
            Bucket: 'fluxbox',
            Key: userKey,
            ContentType: contentType,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 });

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 });
    }
}