import {
	BadRequestException,
	Injectable,
	type NestMiddleware
} from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import * as bodyParser from 'body-parser'

interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
	public use(req: Request, res: Response, next: NextFunction) {
		const chunks: Buffer[] = [];

		req.on("data", (chunk: Buffer) => {
			chunks.push(chunk);
		});

		req.on("end", () => {
			((req as unknown) as RequestWithRawBody).rawBody = Buffer.concat(chunks);
			next();
		});
	}
}
