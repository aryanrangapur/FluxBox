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

    const prefix = request.nextUrl.searchParams.get('prefix') || '';
    
    // Add user ID prefix to scope files to the user
    const userPrefix = `${userId}/${prefix}`;
    
    const command = new ListObjectsV2Command({
        Bucket: 'fluxbox',
        Delimiter: '/',
        Prefix: userPrefix,
    });

    const result = await client.send(command);
    console.log(result);

    // Remove the user prefix from the keys for display
    const rootFiles = result.Contents?.map((e) => ({
        Key: e.Key?.replace(`${userId}/`, '') || '',
        Size: e.Size,
        LastModified: e.LastModified,
    })) || [];

    const rootFolders = result.CommonPrefixes?.map((e) => 
        e.Prefix?.replace(`${userId}/`, '')
    ).filter(Boolean) || [];

    return NextResponse.json({ files: rootFiles, folders: rootFolders });
}