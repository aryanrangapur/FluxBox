import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    },
    region: 'ap-south-2',
});

export async function DELETE(request: NextRequest) {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = request.nextUrl.searchParams.get('key');

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
        // Add user prefix to the key
        const userKey = `${userId}/${key}`;
        
        const command = new DeleteObjectCommand({
            Bucket: 'fluxbox',
            Key: userKey,
        });

        await client.send(command);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}

