import dotenv from 'dotenv';
import connectDB from './config/database';
import app from './app';

dotenv.config({
  path: './.env',
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server is running at port :     
            ${process.env.PORT}`);
    });
  } catch (error) {
    console.log('MONGO DB connection failed', error);
  }
};

startServer();
