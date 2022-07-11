const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const data = await Todo.getById(req.params.id);

    if (!data || data.user_id !== req.user.id) {
      throw new Error('Please properly login and with proper credentials.');
    }
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
