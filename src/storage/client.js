import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.DIGITAL_OCEAN_URL, 
  region: process.env.DIGITAL_OCEAN_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

async function uploadToSpaces(fileBuffer, fileName, mimeType) {
    const uploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    };
  
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
  
    console.log('Upload Successful to DigitalOcean Spaces');
  }

export default uploadToSpaces;