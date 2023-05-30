const knex = require("knex")(require("../knexfile"));

//1. GET data on all posts to display on Travel Notes page and on the Home page Map as markers
exports.index = (_req, res) => {
  knex
    .select("id", "name", "image_path", "long", "lat", "year", "country")
    .from("posts")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Posts ${err}`));
};

//2. Read a single post using GET to display on Trip Details page
exports.singlePost = (req, res) => {
  knex
    .select(
      "id",
      "title",
      "name",
      "description",
      "image_path",
      "country",
      "year",
      "lat",
      "long"
    )
    .from("posts")
    .where({ id: req.params.id })
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(404).json({
          message: `Unable to find post with id: ${req.params.id}`,
        });
      }
      // Knex returns an array of records, so we need to send response with a single object only
      res.json(posts[0]);
    })
    .catch((err) =>
      res
        .status(400)
        .json({ message: "There was an issue with the request", err })
    );
};

//3. Retrieve attractions from a particular post using GET to display on Trip Details page
exports.postAttractions = (req, res) => {
  knex("attractions")
    .where({ post_id: req.params.id })
    .then((attractions) => {
      if (attractions.length === 0) {
        return res.status(404).json({
          error: `Unable to find attractions for post ${req.params.id}`,
        });
      }
      res.json(attractions);
    })
    .catch((err) =>
      res.status(400).json({
        message: "There was an issue with the request",
        err,
      })
    );
};

//4. Create a new post using POST
exports.addPost = (req, res) => {
  // Validate the request body for required data
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.year ||
    !req.body.country ||
    !req.body.long ||
    !req.body.lat ||
    !req.body.title
  ) {
    return res.status(400).json({
      message: "All fields are required. Missing one or more required fields",
    });
  }

  const { name, description, year, country, long, lat, title } = req.body;

  knex("posts")
    .where({ name: name })
    .then((posts) => {
      if (posts.length > 0) {
        return res.status(400).json({
          message: `Post about ${name} already exists`,
        });
      }

      knex("posts")
        .insert({
          name,
          description,
          year,
          country,
          image_path: req.file.location,
          long,
          lat,
          title,
        })
        .then((createdIds) => {
          const postId = createdIds[0];
          return knex("posts").where({ id: postId });
        })
        .then((posts) => {
          return res.status(201).json(posts[0]);
        })
        .catch((err) => {
          return res.status(400).json({
            message: "There was an issue with the request",
            err,
          });
        });
    });
};

//5. Create a new attraction using POST
exports.addAttraction = (req, res) => {
  // Validate the request body for required data
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: "All fields are required. Missing one or more required fields",
    });
  }

  const { name, description } = req.body;

  // Check for unique name
  knex("attractions")
    .where({ name: name })
    .then((attractions) => {
      if (attractions.length > 0) {
        return res.status(400).json({
          message: `Attraction called ${name} already exists`,
        });
      }

      knex("attractions")
        .insert({
          name,
          description,
          image_path: req.file.location,
          post_id: req.params.id,
        })
        .then((createdIds) => {
          const attractionId = createdIds[0];
          return knex("attractions").where({ id: attractionId });
        })
        .then((attractions) => {
          return res.status(201).json(attractions[0]);
        })
        .catch((err) => {
          return res.status(400).json({
            message: "There was an issue with the request",
            err,
          });
        });
    });
};

//6. Update an existing post using PUT
exports.updatePost = (req, res) => {
  if (
    !req.body.name ||
    !req.body.description ||
    !req.body.year ||
    !req.body.country ||
    !req.body.long ||
    !req.body.lat ||
    !req.body.title
  ) {
    return res.status(400).json({
      message: "All fields are required. Missing one or more required fields",
    });
  }

  const { name, description, year, country, long, lat, title } = req.body;
  knex("posts")
    .update({
      name,
      description,
      year,
      country,
      image_path: req.file.location,
      long,
      lat,
      title,
    })
    .where({ id: req.params.id })
    .then(() => {
      return knex("posts").where({ id: req.params.id });
    })
    .then((posts) => {
      res.json(posts[0]);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};
//7. Update an existing attraction using PUT
exports.updateAttraction = (req, res) => {
  // Validate the request body for required data
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({
      message: "All fields are required. Missing one or more required fields",
    });
  }

  const { name, description } = req.body;
  knex("attractions")
    .update({
      name,
      description,
      image_path: req.file.location,
      post_id: req.params.postId,
    })
    .where({ id: req.params.attractionId })
    .then(() => {
      return knex("attractions").where({ id: req.params.attractionId });
    })
    .then((attractions) => {
      return res.status(201).json(attractions[0]);
    })
    .catch((err) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        err,
      });
    });
};

//8. Delete an existing post using DELETE
exports.deletePost = (req, res) => {
  knex("posts")
    .delete()
    .where({ id: req.params.id })
    .then((numberOfPostsDeleted) => {
      if (numberOfPostsDeleted === 0) {
        return res.status(404).json({
          message: `Post not found with id ${req.params.id}`,
        });
      }
      // 204 - No Content
      res.sendStatus(204);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

//9. Delete an existing attraction using DELETE

exports.deleteAttraction = (req, res) => {
  knex("attractions")
    .delete()
    .where({ id: req.params.attractionId })
    .then((numberOfPostsDeleted) => {
      if (numberOfPostsDeleted === 0) {
        return res.status(404).json({
          message: `Post not found with id ${req.params.attractionId}`,
        });
      }
      // 204 - No Content
      res.sendStatus(204);
    })
    .catch((error) => {
      return res.status(400).json({
        message: "There was an issue with the request",
        error,
      });
    });
};

//10. Read a single attraction using GET to display on Trip Details page
exports.singleAttraction = (req, res) => {
  knex("attractions")
    .where({ id: req.params.attractionId })
    .then((attractions) => {
      if (attractions.length === 0) {
        return res.status(404).json({
          message: `Unable to find attraction with id: ${req.params.attractionId}`,
        });
      }
      // Knex returns an array of records, so we need to send response with a single object only
      res.json(attractions[0]);
    })
    .catch((err) =>
      res
        .status(400)
        .json({ message: "There was an issue with the request", err })
    );
};
