const DataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.id) return res.status(400).send('Invalid body, missing parameters!');

  const dbm = new DataBaseManager();
  const matches = dbm.readData();
  
  const theMatch = matches.findIndex((value) => { return value.id === data.id });
  if (!theMatch || theMatch < 0) return res.status(418).send('Match with provided id doesn\'t exists!');

  matches.splice(theMatch, 1);
  dbm.writeData(matches);
  return res.status(200).send('Success!');
};