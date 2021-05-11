import { createConnection, getConnectionOptions } from 'typeorm';

(async () => {
  const connectionOptions = await getConnectionOptions(
    process.env.NODE_ENV === 'test' ? 'tests' : 'default',
  );

  return await createConnection({ ...connectionOptions, name: 'default' });
})();
