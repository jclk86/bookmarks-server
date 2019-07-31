const express = require("express");
const uuid = require("uuid/v4");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
// logger 
const logger = require("../logger");
const {bookmarks} = require("../store");

bookmarkRouter
  .route("/bookmarks")
  .get((req,res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req,res) => {
    const {title, url, rating, desc} = req.body;
    if(!title) {
      logger.error("Title is required");
      res.status(400).send("Invalid data");
    };

    if(!url) {
      logger.error("url is required");
      res.status(400).send("Invalid data");
    };

    if(!rating) {
      logger.error("Rating is required");
      res.status(400).send("Invalid data");
    };

    if(!desc) {
      logger.error("Description is required");
      res.status(400).send("Invalid data")
    };

    const id = uuid();

    const mark = {
      id,
      title,
      url,
      rating,
      desc
    };

    bookmarks.push(mark);

    logger.info(`Book with id ${id} was added to list`)
    
    res.status(201).location(`http://localhost:8000/card/${id}`)
    .json(mark);
  });

bookmarkRouter
  .route("/bookmarks/:id")
  .get((req,res) => {
    const {id} = req.params;
    const mark = bookmarks.find(b => b.id == id); // == bc params is a string, but data is a #. 
    if(!mark) {
      logger.error(`No bookmark with id matching ${id}`);
      res.status(404).send(`Not found`);
    }
    res.json(mark);
  })
  .delete((req,res) => {
    const {id} = req.params;
    const markIndex = bookmarks.findIndex(li => li.id == id);
    if(markIndex === -1) {
        logger.error(`List with id ${id} not found.`);
        return res.status(404).send('Not found');
    }
    bookmarks.splice(markIndex, 1);
    logger.info(`List with id ${id} deleted.`);
    res.status(204).end();
  })


module.exports = bookmarkRouter;

// {
//   id: 1,
//   title: 'Thinkful',
//   url: 'http://www.thinkful.com',
//   rating: '5',
//   desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
// }