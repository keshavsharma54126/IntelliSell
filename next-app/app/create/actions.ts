"use server";

import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import {
  PutObjectCommand,
  S3,
  GetObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import csv from "csv-parser";
import { Readable } from "stream";
// import s3Client from "@/lib/s3Client"
import prisma from "@/db";

interface UserDataTypes {
  name: string;
  phoneno: string;
  projectId: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedURL(id: string) {
  console.log("Attempting to get signed URL for id:", id);

  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session) {
    console.error("Authentication failed: No session found");
    return { failure: "Not authenticated", details: "No session found" };
  }

  if (!session.user || !session.user.id) {
    console.error("Authentication failed: Invalid session user data");
    return {
      failure: "Not authenticated",
      details: "Invalid session user data",
    };
  }

  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: id,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 60,
    });

    console.log("Signed URL generated successfully");
    return { success: { url: signedUrl } };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { failure: "Error generating signed URL", details: error.message };
  }
}

export async function getParsedData(
  id: string,
  projectId: string
): Promise<UserDataTypes[] | void> {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: id };
  const command = new GetObjectCommand(params);
  const { Body } = await s3Client.send(command);

  if (!Body) {
    return;
  }

  let stream;

  // Convert Blob or ReadableStream to AsyncIterable
  if (Body instanceof Readable) {
    stream = Body; // It's already a readable stream in Node.js
  } else if (Body instanceof ReadableStream) {
    stream = Readable.from(readableStreamToAsyncIterable(Body)); // Convert ReadableStream to Node.js stream
  } else {
    return;
  }

  // Create an array to store parsed CSV data
  const results: any[] = [];

  const userData: UserDataTypes[] = [];
  // Stream the CSV data and parse it using csv-parser
  await stream
    .pipe(csv())
    .on("data", (data) => results.push(data)) // Push each row to results array
    .on("end", () => {
      results.map((items: any) => {
        const Obj = {
          name: items.Name,
          phoneno: items.Phoneno.toString(),
          projectId: projectId,
        };
        userData.push(Obj);
      });

      console.log(userData);
      // createData(userData)

      // console.log(typeof(results[0].Phoneno))
    })
    .on("error", (err) => {
      console.error(err);
      return err;
    });

  return userData;
}

export async function deleteFile(id: string) {
  const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: id };
  const command = new DeleteObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    console.log("file deleted successfully : ", data);
  } catch (error) {
    console.error(error);
  }
}

// for pushing users data to postgres Data Table
export async function createData(data: UserDataTypes[] | void) {
  if (!data) {
    return;
  }
  const res = await prisma.data.createMany({
    data: data as any,
    skipDuplicates: true,
  });

  console.log(res);
}

// export async function downloadFileFromS3() {
//   // get sample CSV file from S3 and make it downloadable
//   try {

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 bucket name
//       Key: "sample-csv.csv", // S3 object key
//     });

//     const response = await s3Client.send(command);

//     const bodyStream = response.Body as Readable;
//     const chunks = [];

//     for await (const chunk of bodyStream) {
//       chunks.push(chunk);
//     }

//     const fileBuffer = Buffer.concat(chunks);

//     return {
//       fileBuffer,
//       contentType: response.ContentType,
//       contentLength: response.ContentLength,
//     };

//   } catch (error) {
//     console.error('Error downloading file:', error);
//     throw new Error('File download failed');
//   }

// }

export const getPublicUrl = (key: string) => {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

function readableStreamToAsyncIterable(
  Body: ReadableStream<any> & import("@smithy/types").SdkStreamMixin
): Iterable<any> | AsyncIterable<any> {
  throw new Error("Function not implemented.");
}

export async function getProjects() {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
      return { failure: "Not authenticated" };
    }
    const projects = await prisma.project.findMany({
      where: {
        clientId: session.user.id,
      },
    });
    return { success: { projects } };
  } catch (error) {
    console.error(error);
    return { failure: "Error fetching projects" };
  }
}

export async function getUserDetails() {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
      return { failure: "Not authenticated" };
    }
    const user = await prisma.client.findUnique({
      where: {
        id: session.user.id,
      },
    });
    return { success: { user } };
  } catch (error) {
    console.error(error);
    return { failure: "Error fetching user details" };
  }
}

export async function editUserDetails({
  fullName,
  companyName,
  phoneNumber,
  address,
}: {
  fullName: string;
  companyName: string;
  phoneNumber: string;
  address: string;
}) {
  try {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if (!session) {
      return { failure: "not authenticated" };
    }
    const user = await prisma.client.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: fullName,
        companyName,
        address,
        phone: phoneNumber,
      },
    });
    return { success: { user } };
  } catch (error) {
    console.error(error);
    return { failure: "Error fetching user details" };
  }
}

export async function getProjectDetails(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    return { success: { project } };
  } catch (error) {
    console.error(error);
    return { failure: "Error fetching project details" };
  }
}
