/**
 * Mysql database connection
 * Includes TiDB/MySQL/MariaDB
 */
import { DataSource } from 'typeorm';
import path from 'path';

/**
 * MySQL database connection type definition
 */
export interface MysqlDatabaseTypes {
    type: ["mariadb"];
    mysql: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    }[],
}
export const mysqlConnect = (detail: MysqlDatabaseTypes): DataSource => {
    const mysqlSetting =
        (detail.mysql.length > 1) ? ({
            replication: {
                master: {
                    host: detail.mysql[0].host,
                    port: detail.mysql[0].port,
                    username: detail.mysql[0].username,
                    password: detail.mysql[0].password,
                    database: detail.mysql[0].database,
                },
                slaves: detail.mysql.slice(1).map(item => ({
                    host: item.host,
                    port: item.port,
                    username: item.username,
                    password: item.password,
                    database: item.database,
                }))
            }
        }) : {
            host: detail.mysql[0].host,
            port: detail.mysql[0].port,
            username: detail.mysql[0].username,
            password: detail.mysql[0].password,
            database: detail.mysql[0].database,
        }
    const connection = new DataSource({
        type: 'mariadb',
        logging: true,
        ...mysqlSetting,
        entities: [path.resolve(__dirname,"./entities/*.ts")],
        synchronize: true,
        cache: {
            duration: 30000 // 30 seconds
        }
    })
    return connection
}