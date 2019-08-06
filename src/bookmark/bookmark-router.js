const express = require("express");
const uuid = require("uuid/v4");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
// logger 
const logger = require("../logger");
const {bookmarks} = require("../store");
const BookmarksService = require('./bookmarks-service')

bookmarkRouter
  .route("/bookmarks")
  .get((req,res) => {
    res.json(bookmarks)
  })
  .post(bodyParser, (req,res) => {
    const {title, url, rating, desc} = req.body;
    if(!title) {
      logger.error("Title is required");
      return res.status(400).send("Invalid data");
    };

    if(!url) {
      logger.error("url is required");
      return res.status(400).send("Invalid data");
    };

    if(!rating) {
      logger.error("Rating is required");
      return res.status(400).send("Invalid data");
    };

    if(!desc) {
      logger.error("Description is required");
      return res.status(400).send("Invalid data")
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
  .all((req,res, next) => { // all() is global and requires all routes with endpoint entails the bottom
    const {id} = req.params;
    BookmarksService.getById(req.app.get('db'), id)
    .then(mark => {
      if(!mark) {
      logger.error(`No bookmark with id matching ${id}`);
        return res.status(404).json({
          error: {message: 'Bookmark Not Found'}
        })
      }
      res.bookmark =  mark
      next()
    }) 
    .catch(next)
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

