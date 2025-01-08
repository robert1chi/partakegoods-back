import * as yaml from "js-yaml";
import { readFileSync } from "fs";
import path from 'path';
import winston from '@/winstonLogger';

type YamlUri = {
    database: {
        type: ["mysql", "redis"] | ["mysql"] | ["mariadb"];
        mysql: {
            host: string;
            port: number
            username: string
            password: string
            database: string
        }[],
        redis?: {
            host: string
            port: number
        }[]
    },
    global: {
        host: string
        protocol: 'http' | 'https' | 'ws' | 'wss'
        port: number
    }
}

const getYamlUri = (): YamlUri => {
    const yamlPath = readFileSync(path.resolve(__dirname, "../../config/setting.yaml"), "utf-8")
    if (!yamlPath) {
        winston.warn("Error: config file not found")
        throw new Error("Error: config file not found")
    }
    const uri = yaml.load(yamlPath) as YamlUri
    return uri
}

export const global = getYamlUri().global
export const database = getYamlUri().database