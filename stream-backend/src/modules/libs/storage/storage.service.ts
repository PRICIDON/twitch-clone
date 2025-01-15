import { Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      endpoint: this.configService.getOrThrow("S3_ENDPOINT"),
      region: this.configService.getOrThrow("S3_REGION"),
      credentials: {
        accessKeyId: this.configService.getOrThrow("S3_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.getOrThrow(
          "S3_SECRET_ACCESS_KEY_ID",
        ),
      },
    });
    this.bucket = this.configService.getOrThrow("S3_BUCKET_NAME");
  }

  async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      ContentType: mimetype,
    };
    try {
      await this.client.send(new PutObjectCommand(command));
    } catch (err) {
      throw err;
    }
  }

  async remove(key: string) {
    const command: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
    };

    try {
      await this.client.send(new DeleteObjectCommand(command));
    } catch (err) {
      throw err;
    }
  }
}
