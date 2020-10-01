export default function getCoordsFromId(id) {
  let data = require('../data/city.list.json');
  let x = data.filter(e => e.id===id)[0];
  return x.coord;
}