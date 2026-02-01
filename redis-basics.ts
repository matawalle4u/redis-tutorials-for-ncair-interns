// redis-basic.ts
import { createClient } from 'redis';

async function main() {
  // Create client
  const client = createClient({
    url: 'redis://localhost:6379'
  });

  // Handle errors
  client.on('error', (err: any) => console.error('Redis Client Error', err));

  // Connect
  await client.connect();
  console.log('Connected to Redis!');

  // SET and GET
  await client.set('mykey', 'Hello Redis!');
  const value = await client.get('mykey');
  console.log('Value:', value);

  // SET with expiration (30 seconds)
  await client.setEx('session:abc123', 30, 'user_data');

  // JSON storage
  const user = { id: 1, name: 'Alice', email: 'alice@example.com' };
  await client.set('user:1', JSON.stringify(user));
  const userData = await client.get('user:1');
  console.log('User:', JSON.parse(userData!));

  // Hash operations
  await client.hSet('user:2', {
    name: 'Bob',
    email: 'bob@example.com',
    age: '30'
  });
  const userHash = await client.hGetAll('user:2');
  console.log('User Hash:', userHash);

  // Increment
  await client.set('views', '0');
  await client.incr('views');
  await client.incrBy('views', 10);
  const views = await client.get('views');
  console.log('Views:', views);

  // List operations, pushing to a list calledd 'messages' and values array
  await client.lPush('messages', ['msg3', 'msg2', 'msg1']);
  const messages = await client.lRange('messages', 0, -1);
  console.log('Messages:', messages);

  // Delete
  await client.del('mykey');

  // Check existence
  const exists = await client.exists('user:1');
  console.log('Exists:', exists);

  // Disconnect
  await client.quit();
}

main().catch(console.error);