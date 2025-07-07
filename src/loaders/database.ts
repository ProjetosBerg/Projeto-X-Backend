import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import postgresDbConfig from "@/config/postgres";
import mongoDbConfig from "@/config/mongodb";
import logger from "@/loaders/logger";
import PostgresEntities from "@/domain/entities/postgres";
import MongodbSchemas from "@/domain/entities/mongo";

class DatabaseHelper {
  private connections: Connection[];

  private postgresDbConfig: any;

  public mongoDgConfig: any;

  constructor() {
    this.connections = [];
    this.postgresDbConfig = postgresDbConfig;
    this.mongoDgConfig = mongoDbConfig;
  }

  async startPostgresConnection() {
    try {
      const postgresConnection = await createConnection({
        ...this.postgresDbConfig,
        entities: [...Object.values(PostgresEntities || {})],
        migrations: ["src/migrations/**/*.ts"],

        logging: false,
        maxQueryExecutionTime: 1000,
        name: "default",
      });
      this.connections.push(postgresConnection);
      logger.info("Postgres connected");
      return postgresConnection;
    } catch (error) {
      logger.error(`Database Postgres error: ${error}`);
      return process.exit(1);
    }
  }

  async startMongodbConnection() {
    try {
      const mongoConnection = await createConnection({
        ...this.mongoDgConfig,
        entities: [...Object.values(MongodbSchemas || {})],
        useUnifiedTopology: true,
        logging: false,
        maxQueryExecutionTime: 10000,
        name: "mongodb",
        poolSize: 1000,
      });

      await mongoConnection.synchronize(false);

      logger.info("Mongodb connected");
      return mongoConnection;
    } catch (error) {
      logger.error(`Database MongoDb error: ${error}`);
      return process.exit(1);
    }
  }

  initConnections() {
    return Promise.all([
      this.startPostgresConnection(),
      this.startMongodbConnection(),
    ]);
  }

  closeConnections() {
    const promises = this.connections.map((conn) => conn.close());
    return Promise.all(promises);
  }

  setPostgresPort(port: number) {
    this.postgresDbConfig.port = port;
    return this;
  }

  setMongoPort(port: number) {
    this.mongoDgConfig.port = port;
    return this;
  }
}

export default new DatabaseHelper();
