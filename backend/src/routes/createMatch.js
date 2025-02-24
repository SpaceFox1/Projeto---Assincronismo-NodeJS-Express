const crypto = require('crypto');
const dataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.name || !data.address || !data.date) return res.status(400).send('Invalid body, missing parameters!');

  const dbm = new dataBaseManager();
  const id = crypto.randomUUID();
  const finalDataObject = {
    id: id,
    title: data.name,
    address: data.address,
    date: data.date,
    guests: [],
  }
  dbm.appendData(finalDataObject);
  return res.json(finalDataObject);
}