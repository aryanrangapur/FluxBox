import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
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

    try {
        const command = new ListObjectsV2Command({
            Bucket: 'fluxbox',
            Prefix: `${userId}/`,
        });

        const result = await client.send(command);
        
        let totalSize = 0;
        result.Contents?.forEach(item => {
            totalSize += item.Size || 0;
        });

        // Convert to MB
        const totalSizeMB = totalSize / (1024 * 1024);
        
        return NextResponse.json({ 
            totalSize: totalSize,
            totalSizeMB: Math.round(totalSizeMB * 100) / 100,
            fileCount: result.Contents?.length || 0
        });
    } catch (error) {
        console.error('Error calculating storage:', error);
        return NextResponse.json({ error: 'Failed to calculate storage' }, { status: 500 });
    }
}