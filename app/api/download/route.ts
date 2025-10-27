import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
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

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    try {
        // Add user prefix to the key
        const userKey = `${userId}/${key}`;
        
        const command = new GetObjectCommand({
            Bucket: 'fluxbox',
            Key: userKey,
        });

        const result = await client.send(command);
        
        if (!result.Body) {
            return NextResponse.json({ error: 'No file content' }, { status: 404 });
        }

        const stream = result.Body as any;
        const fileName = key.split('/').pop() || 'download';
        
        // Convert Readable to ReadableStream
        const readableStream = new ReadableStream({
            start(controller) {
                stream.on('data', (chunk: Buffer) => {
                    controller.enqueue(chunk);
                });
                stream.on('end', () => {
                    controller.close();
                });
                stream.on('error', (err: Error) => {
                    controller.error(err);
                });
            }
        });
        
        return new NextResponse(readableStream, {
            headers: {
                'Content-Type': result.ContentType || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
    }
}

