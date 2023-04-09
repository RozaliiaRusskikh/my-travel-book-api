const attractionsData = require("../seed_data/attractions");
const postsData = require("../seed_data/posts");

exports.seed = function (knex) {
  return knex("posts")
    .del()
    .then(function () {
      return knex("posts").insert(postsData);
    })
    .then(() => {
      return knex("attractions").del();
    })
    .then(() => {
      return knex("attractions").insert(attractionsData);
    });
};
