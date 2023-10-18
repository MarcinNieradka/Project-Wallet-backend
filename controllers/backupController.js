import databaseBackup from '../backup/index.cjs';
import dotenv from 'dotenv';
dotenv.config();

export const getDatabaseBackup = async (req, res, next) => {
  try {
    await databaseBackup();

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
