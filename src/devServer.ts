import express, { Request, Response } from 'express';

import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? 4000;

const app = express();

// interface IRequest extends Request {
// 	headers: {
// 		host?: string;
// 	};
// }

// const getAllowedOrigins = (req: IRequest, res: Response, next: NextFunction) => {
// 	const allowedOrigins = [
// 	];
// 	const host = req.headers.host ?? '';
// 	console.log('host', host);

// 	if (allowedOrigins.includes(host)) {
// 		next();
// 	} else {
// 		res.status(405).send('Host not allowed');
// 	}
// };
// app.use(getAllowedOrigins);

app.use('/', function (req: Request, res: Response) {
	res.send('Hello World!');
});

// start express server for dev mode

app.listen(port, () => {
	console.log(`🚀 Server ready at http://localhost:${port}`);
});
