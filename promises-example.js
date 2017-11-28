"use strict";

const request = require('request');

const knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'promise-test'
  },
  //debug: true
});

const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});

var queryUSDAFarmersMarkets = (zipCode) => {
  return new Promise((resolve, reject) => {
    const baseUrl = 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=';
    request(baseUrl + zipCode, (err, resp, body) => {
      if (err) reject(err);
      resolve(body);
    });
  });
};

// queryUSDAFarmersMarkets(11213)
// .then((respBody) => {
//   console.log('response', JSON.parse(respBody));
// })
// .catch((err) => {
//   console.log('error: ', err);
// });

Promise.resolve(knex.schema.createTableIfNotExists('markets', (table) => {
  table.string('id').primary()
  table.string('marketplace')
}))
  .then(() => {
    return queryUSDAFarmersMarkets(11213).then((respBody) => {
      return JSON.parse(respBody).results
    })
  })
  .then((markets) => {
    console.log('markets', markets)
  })
  .catch(err => console.log(err))