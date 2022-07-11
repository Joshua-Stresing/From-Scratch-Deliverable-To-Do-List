const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserServices');
const Todo = require('../lib/models/Todo');

const mockUser = {
  email: 'test@example.com',
  password: '12345678',
};

const mockUser2 = {
  email: 'test2@example.com',
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
    const [agent, user] = await LoggedIn();
    // console.log('user log', user);
    const resp = await agent
      .post('/api/v1/todos')
      .send({ description: 'Finish APP' });
    // expect(resp.status).toBe(200);
    // console.log(resp.body);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      description: expect.any(String),
      complete: false,
    });
  });

  it('Test my get list of todos for user', async () => {
    const [agent, user] = await LoggedIn();
    const testinguser = await UserService.create(mockUser2);
    const testData = await Todo.insert({
      description: 'Finish App',
      user_id: user.id,
      complete: true,
    });
    await Todo.insert({
      description: 'Get a job',
      user_id: testinguser.id,
      complete: false,
    });
    const data = await agent.get('/api/v1/todos');
    expect(data.status).toEqual(200);
    expect(data.body).toEqual([testData]);
  });

  it('Test to check if not logged in', async () => {
    const data = await request(app).get('/api/v1/todos');
    expect(data.status).toEqual(401);
  });

  it('Test the update todo for the user', async () => {
    const [agent, user] = await LoggedIn();
    const data = await Todo.insert({
      description: 'Test Edit',
      user_id: user.id,
      complete: true,
    });
    const resp = await agent
      .put(`/api/v1/todos/${data.id}`)
      .send({ description: 'Edited', complete: false });
    // expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      ...data,
      description: 'Edited',
      complete: false,
    });
  });

  it.only('Test the delete for a user.', async () => {
    const [agent, user] = await LoggedIn();
    const todo = await Todo.insert({
      description: 'Finish App',
      user_id: user.id,
    });
    const resp = await agent.delete(`/api/v1/todos/${todo.id}`);
    // expect(resp.status).toBe(200);
    const remove = await Todo.getById(todo.id);
    expect(remove).toBeNull();
  });

  afterAll(() => {
    pool.end();
  });
});
