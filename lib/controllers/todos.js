const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      // console.log(typeof req.user.id);
      const data = await Todo.insert({ ...req.body, user_id: req.user.id });
      // console.log('controller data', data);
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.getAll(req.user.id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
