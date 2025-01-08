import * as yaml from "js-yaml";
import { readFileSync } from "fs";
import { mysqlConnect, MysqlDatabaseTypes } from "./mysql";
import { redisConnect, RedisDatabaseTypes } from "./redis";
import path from "path";
import winston from "@/winstonLogger";
import { DataSource } from "typeorm";
import { database} from "../global/config"

/** 
 * Users can change this function to connect to their own database
 * and improve the performance of the application
 */
const handleConnection = (): DataSource => {
    const uri = database
    /**
     * For Relational database (except PostgreSQL) cluster user, this class offers a way to pick a connection from the pool
     * According to the docs of TypeORM, the first database will be used as the master database
     * The following databases will be used as the slaves database, which is used for read-only operations, such as SELECT and FIND
     * For more information, please refer to the docs of TypeORM:
     * https://typeorm.io/multiple-data-sources
     */
    const __type = (uri.type instanceof Array) ? [...new Set(uri.type)] : (winston.error("Invalid config file!"), [])
    const arrayCheck = (element: string) => element !== "mysql" && element !== "redis"
    if (__type.some(arrayCheck)) {
        winston.warn("Error: database type is not supported")
        throw new Error("Error: database type is not supported")
    }
    let __tempDataSource: DataSource
    if (__type.length === 2 && uri.redis.length > 0) {
        const connection: DataSource = redisConnect(uri as RedisDatabaseTypes)
        __tempDataSource = connection
        /** 
         * some companies would like to use their own auth database rather than the default one
         * Copy the redis.ts or mysql.ts, and change the name of the class to your own class name
         * Then, use the new class to connect to your own database
         * For example, if you want to connect to your own auth database, you can copy the redis.ts and change the name to RedisAuth
         * example: ``` const authConnect = new RedisAuth() ```
         * ``` await authConnect.connect(uri as RedisDatabaseTypes) ```
         * ```
         */
    } else if (__type.length === 1 && __type[0] === "mysql") {
        const connection: DataSource = mysqlConnect(uri as MysqlDatabaseTypes)
        __tempDataSource = connection
    }
    return __tempDataSource
}
export const handleDataSource = handleConnection()