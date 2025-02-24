const path = require('path');
const fs = require('fs');
const { Logger } = require('@promisepending/logger.js');

const dbFolder = path.resolve(__dirname, '..', '..', 'db');
const dbFile = path.resolve(dbFolder, 'dbFile.json');

let instance;

// Singleton class for accessing the database
class DataBaseManager {
  constructor() {
    if (instance) return instance;
    instance = this;
    this.logger = new Logger({ prefixes: [{
      content: 'backend',
      color: '#ffffff',
      backgroundColor: (txt) => {
        const colors = ['#ff5555', '#55ff55', '#5555ff'];
        return txt.split('').map((_, i) => {
          return colors[i % colors.length];
        });
      },
    },{
      content: 'Database Manager',
      color: '#ffffff',
      backgroundColor: (txt) => {
        const colors = ['#ff5555', '#55ff55', '#5555ff'];
        return txt.split('').map((_, i) => {
          return colors[i % colors.length];
        });
      },
    }]});
  }

  start() {
    this.ensureFileExists();
    this.logger.info('Database Ready!');
  }

  ensureFileExists() {
    // create folder if it doesn't exists
    if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
    if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '[]');
  }

  getLogger() {
    return this.logger;
  }

  readData() {
    return JSON.parse(fs.readFileSync(dbFile));
  }

  writeData(objectArray) {
    return fs.writeFileSync(dbFile, JSON.stringify(objectArray));
  }

  appendData(newData) {
    const currentData = this.readData();
    currentData.push(newData);
    this.writeData(currentData);
  }
}

module.exports = DataBaseManager;