import { app } from './app.js';
import connectDB from './db/db.js';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
const server = 'http://localhost';

export const serverAddress = `${server}:${port}`;

export const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running. Use our API on server: ${serverAddress}`);
    });
  } catch (error) {
    console.error('Cannot connect to Mongo Database');
    console.error(error);
    process.exit(1);
  }
};

startServer();
