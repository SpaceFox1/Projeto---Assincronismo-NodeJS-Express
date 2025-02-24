const DataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  const dbm = new DataBaseManager();
  return res.json(dbm.readData());
}