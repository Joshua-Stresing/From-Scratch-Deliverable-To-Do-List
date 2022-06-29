const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserServices');

const mockUser = {
  email: 'test@example.com',
  password: '12345678',
};

const LoggedIn = async (props = {}) => {
  const password = props.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...props });
  const { email } = user;

  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todo test suite', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('Test to create new todo', async () => {
    const [agent] = await LoggedIn();
    const todo = { description: 'Finish APP' };
    const data = await agent.post('/api/v1/todos/').send(todo);
    expect(data.status).toEqual(200);
    expect(data.body).toEqual({
      id: expect.any(String),
      user_id: expect.any(String),
      description: 'Finish APP',
      completed: false,
    });
  });

  afterAll(() => {
    pool.end();
  });
});
