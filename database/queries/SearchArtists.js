const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {

  return Promise.all([
    Artist.find( buildQuery(criteria) )
      .sort({ [sortProperty]: 1 })
      .skip( offset )
      .limit( limit ),
    Artist.count()
  ])
  .then( (results) => {
    let artists = results[0];
    let count = results[1];
    console.log('artists: ', artists);
    console.log('count: ', count);
    return {
      all: artists,
      count: artists.length,
      offset,
      limit
    }
  });

};

const buildQuery = (criteria) => {
  var query = {};

  if (criteria.name){
    query.$text = { $search: criteria.name }
  }

  if (criteria.age){
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max
    };
  }

  if (criteria.yearsActive){
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    }
  }
  console.log("query: ", query)
  return query;
};
