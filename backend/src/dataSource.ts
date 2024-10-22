import { DataSource } from "typeorm";
import { DATABASE } from "./constant";

const dataSource = new DataSource({
  type: "mysql",
  host: DATABASE.host,
  port: DATABASE.port,
  username: DATABASE.username,
  password: DATABASE.pass,
  database: DATABASE.dbname,
  entities: [__dirname + "/entities/*.entity{.ts,.js}"],
  synchronize: true,
});

export default dataSource;
