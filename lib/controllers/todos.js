const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const data = await Todo.insert({ ...req.body, user_id: req.user.id });
    res.json(data);
  } catch (e) {
    next(e);
  }
});
