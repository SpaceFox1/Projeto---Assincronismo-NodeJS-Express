const DataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.id || !data.guests ) return res.status(400).send('Invalid body, missing parameters!');

  if (!data.guests.forEach) return res.status(400).send('Invalid body, wrong guest object!');

  data.guests.forEach(element => {
    if (!element.name || !element.phone || typeof(element.confirmed) !== 'boolean') return res.status(400).send('Invalid body, wrong guest object!');
  });

  const dbm = new DataBaseManager();
  const matches = dbm.readData();
  
  const theMatch = matches.findIndex((value) => { return value.id === data.id });
  if (theMatch < 0) return res.status(404).send('Match with provided id doesn\'t exists!');

  matches[theMatch].guests = data.guests;

  dbm.writeData(matches);
  return res.json(matches[theMatch]);
}