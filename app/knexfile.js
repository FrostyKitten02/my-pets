//used for migrations

const def = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',  // or your database host
    user: 'postgres',
    password: 'admin',
    database: 'my-pets'
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
}

module.exports = {
  default: def,
  development: def,
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, // Use environment variable for production
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
