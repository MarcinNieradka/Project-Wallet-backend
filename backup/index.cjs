const mongoose = require('mongoose');
const fs = require('fs');
const moment = require('moment');
const cron = require('node-cron');

const baseBackupFolder = 'backup';

const databaseBackup = async (req, res, next) => {
  await mongoose.connect(process.env.DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true });

  const modelsToBackup = [mongoose.model('transaction'), mongoose.model('user')];

  const backupDate = moment().format('DD-MM-YYYY');

  const backupFolder = `${baseBackupFolder}/${backupDate}`;

  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }

  const backupPromises = modelsToBackup.map(Model => {
    return Model.find().lean();
  });

  Promise.all(backupPromises)
    .then(data => {
      data.forEach((documents, index) => {
        const modelName = modelsToBackup[index].collection.name;
        const jsonDocs = JSON.stringify(documents, null, 2);
        const filePath = `${backupFolder}/${modelName}.json`;

        fs.writeFileSync(filePath, jsonDocs);
        console.log(`File "${filePath}" saved.`);
      });
    })
    .catch(err => {
      console.error('Error:', err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

cron.schedule('0 0 * * *', () => {
  databaseBackup();
});
