import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const POST = async(req : NextRequest)=>{

    const body = await req.json()
    const fileName = JSON.parse(body.fileName)
    if(!fileName) {
        return NextResponse.json({
            message : "file requried"
        })
    }

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/${fileName}`,
            ContentType: 'text/csv',
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return NextResponse.json({uploadUrl})
    }  catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return NextResponse.json({ message: 'Error generating upload URL' });
      }

}