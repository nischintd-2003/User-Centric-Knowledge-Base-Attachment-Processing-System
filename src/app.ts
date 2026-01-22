import express from 'express';
import routes from './routes/routes';
import cors from 'cors';
import { errorMiddleware } from './middleware/error-middleware';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);
export default app;
