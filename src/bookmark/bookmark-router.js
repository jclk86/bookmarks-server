const express = require("express");
const { isWebUri } = require('valid-url')
const uuid = require("uuid/v4");
const bookmarkRouter = express.Router();
const bodyParser = express.json();
// logger 
const logger = require("../logger");
const {bookmarks} = require("../store");
const BookmarksService = require('./bookmarks-service')
const xss = require('xss')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  desc: xss(bookmark.desc),
  rating: bookmark.rating
})

bookmarkRouter
  .route("/bookmarks")
  .get((req,res, next) => {
    BookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmarks => {
      res.json(bookmarks.map(serializeBookmark))
    })
    .catch(next)
  })
  .post(bodyParser, (req,res) => {

    for (const field of ['title', 'url', 'rating']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }
    // check the inputs 
    const {title, url, rating, desc} = req.body;
    
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send({
        error: { message: `'rating' must be a number between 0 and 5` }
      })
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send({
        error: { message: `'url' must be a valid URL` }
      })
    } 
    // generate ID
    // const id = uuid();
    // compose the object/data
    const newBookmark = { title, url, description, rating }
    // Add it 
    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
    .then(bookmark => {
      logger.info(`Book with id ${id} was added to list`)
      // assigning location 
      res.status(201).location(`http://localhost:8000/card/${id}`) // location response header indicates the URL to redirect a page to. 300s or 201s for creation
      .json(serializeBookmark(bookmark)); //bodyParser
    })
    .catch(next)
  });

bookmarkRouter
  .route("/bookmarks/:id")
  .all((req,res, next) => { // router.all: What this means is, it doesn't matter the method of the request.. (post, get, put), if the url matches, execute the function. B/c you need to access the page and data before deleting it. If you choose to delete. 
    const {id} = req.params;
    BookmarksService.getById(req.app.get('db'), id) // data 
    .then(bookmark => {
      if(!bookmark) {
      logger.error(`No bookmark with id matching ${id}`);
        return res.status(404).json({
          error: {message: 'Bookmark Not Found'}
        })
      }
      res.bookmark =  bookmark
      next() // need this so the next middleware can run. Passes request to other handlers. If matches, will call that handler. Passing end() responsbility to next middleware. Can put in if else statement, in else, if condition not met, it ignores the current route and goes to the next
    }) 
    .catch(next) // this lets next handle it and goes on to the next middleware. 
  })
  .get((res,req) => {
    res.json(serializeBookmark(res.bookmark)) 
  })
  .delete((req,res) => {
    const {id} = req.params;
   BookmarksService.deleteBookmark(
     req.app.get('db'),
     bookmark_id
   )
   .then(
     numRowsAffected => {
         logger.info(`List with id ${id} deleted.`);
    res.status(204).end();
    })
  .catch(next)
  })


module.exports = bookmarkRouter;

// https://stackoverflow.com/questions/14125997/difference-between-app-all-and-app-use

// app.use applies the specified middleware to the main app middleware stack. When attaching middleware to the main app stack, the order of attachment matters; if you attach middleware A before middleware B, middleware A will always execute first. You can specify a path for which a particular middleware is applicable. In the below example, “hello world” will always be logged before “happy holidays.”