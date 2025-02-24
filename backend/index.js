const { Logger, ConsoleEngine } = require('@promisepending/logger.js');
const databaseManager = require('./src/database/databaseHandler');
const appRoutes = require('./src/router');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());

const port = 3000;

const consoleOut = new ConsoleEngine({ debug: true, });
const logger = new Logger({ prefixes: [{
    content: 'backend',
    color: '#ffffff',
    backgroundColor: (txt) => {
      const colors = ['#ff5555', '#55ff55', '#5555ff'];
      return txt.split('').map((_, i) => {
        return colors[i % colors.length];
      });
    },
  }],
  allLineColored: true,
});
consoleOut.registerLogger(logger);

// creates and registers the database manager singleton
const dbManager = new databaseManager();
consoleOut.registerLogger(dbManager.getLogger());
dbManager.start();

app.use(appRoutes);

app.listen(port, () => {
  logger.info`Started on port ${port}!`;
});