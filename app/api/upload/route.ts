import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from '@clerk/nextjs/server';

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string
    },
    region: 'ap-south-2',
});

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = request.nextUrl.searchParams.get('key');
    const contentType = request.nextUrl.searchParams.get('contentType') || undefined;

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
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