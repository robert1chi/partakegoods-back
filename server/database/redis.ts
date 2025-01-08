import { DataSource } from "typeorm";
import { BaseDataSourceOptions } from "typeorm/data-source/BaseDataSourceOptions";
import path from "path";
export interface RedisDatabaseTypes {
    type: ["mysql", "redis"];
    mysql: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    }[],
    redis: {
        host: string;
        port: number;
    }[]
}
export const redisConnect = (detail: RedisDatabaseTypes): DataSource => {
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
    const redisSetting: BaseDataSourceOptions["cache"] = (detail.redis.length > 1) ? {
        type: "ioredis/cluster",
        options: {
            startupNodes: detail.redis.map(item => ({
                host: item.host,
                port: item.port,
            }))
        }
    } : {
        type: "ioredis",
        options: {
            host: detail.redis[0].host,
            port: detail.redis[0].port,
        }
    }
    const connection = new DataSource({
        type: 'mysql',
        logging: true,
        ...mysqlSetting,
        cache: redisSetting,
        entities: [path.resolve(__dirname, "./entities/*.ts")],
        synchronize: true,
    })
    return connection
}