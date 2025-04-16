import jwt from "jsonwebtoken"
import winston from "@/winstonLogger"
import { handleDataSource } from '../database'
import { UserTable } from '../database/entities/UserTable'
import { ValidJwt } from '../database/entities/ValidJwt'
import HashCrypto from './crypto'

type AcceptMsg = {
    userId: number;
    accepted: boolean;
    username?: string;
    role?: number;
    msg?: string;
    token?: string;
}

type IAuthToken = {
    code: number;
    msg: string;
    accepted?: boolean;
} | true
const userTableRepository = handleDataSource.getRepository(UserTable)
const tokenTableRepository = handleDataSource.getRepository(ValidJwt)

class Token {
    level: number
    constructor(level = -1) {
        this.level = level
    }
    private async createToken(userInfo: any): Promise<string> {
        const token = jwt.sign({ data: userInfo.username }, 'testSecret', {
            expiresIn: '12h'
        })
        await tokenTableRepository
            .createQueryBuilder()
            .insert()
            .into(ValidJwt)
            .values({
                jwt: token,
                user_id: userInfo.id,
                blocked: 0
            })
            .execute()
        return token
    }
    get authUser() {
        return async (ctx: any, next: any) => {
            const { username, password } = ctx.request.body
            // console.log(ctx.request.body)
            const accept = async (): Promise<AcceptMsg> => {
                if (username && password) {
                    const getUser = await userTableRepository
                        .createQueryBuilder("user")
                        .select(["user.id", "user.salt"])
                        .where("user.username = :username", { username: username })
                        .cache(3000)
                        .getOne()
                    if (!getUser) {
                        winston.info(`User not found ${username}`)
                        return {
                            userId: -1,
                            accepted: false,
                            msg: "loginPage.noUser"
                        }
                    }
                    const salt = getUser.salt
                    const hashedPassword = HashCrypto.hashedPassword(password, salt)
                    const userDetail = await userTableRepository
                        .createQueryBuilder("user")
                        .where("user.id = :id", { id: getUser.id })
                        .andWhere("user.passwd = :password", { password: hashedPassword })
                        .cache(3000)
                        .getOne()
                    if (!userDetail) {
                        winston.info(`Password incorrect ${username}`)
                        return {
                            userId: -1,
                            accepted: false,
                            msg: "loginPage.noUser"
                        }
                    }
                    if (userDetail.available === 1) {
                        winston.info(`User ${username} login success`)
                        return {
                            userId: Number(userDetail.id),
                            accepted: true,
                            username: userDetail.username,
                            role: userDetail.role,
                            token: await this.createToken(userDetail)
                        }
                    } else if (userDetail.available === 0) {
                        winston.info("User forbidden")
                        return {
                            userId: Number(userDetail.id),
                            accepted: false,
                            msg: "loginPage.forbidden"
                        }
                    } else {
                        return {
                            userId: -1,
                            accepted: false,
                            msg: "loginPage.failed"
                        }
                    }
                } else {
                    return {
                        userId: -1,
                        accepted: false,
                        msg: "loginPage.empty",
                    }
                }
            }
            ctx.auth = await accept()
            await next()
        }
    }
    get authLevel() {
        return async (ctx: any, next: any) => {
            const id = ctx.cookies.get('USERID')
            const userLevel = await userTableRepository
                .createQueryBuilder("user")
                .select("user.role")
                .where("user.id = :id", { id })
                .cache(5000)
                .getOne()
            if (this.level < 0) {
                await next()
            } else if (userLevel !== null) {
                if (userLevel.role <= this.level && userLevel.role > 0) {
                    await next()
                } else {
                    ctx.body = {
                        code: 403,
                        data: {},
                        msg: "level.not_enough"
                    }
                }
            }
        }
    }
}
export const authToken = async (token: string, id: string): Promise<IAuthToken> => {
    if (!token) return { code: 403, msg: "token.empty" }
    const jwtAuth: unknown | IAuthToken = jwt.verify(token, 'testSecret', (err, decoded) => {
        if (err) {
            winston.warn(err)
            if (err.name === 'TokenExpiredError') {
                return { code: 403, msg: "token.expired" }
            } else if (err.name === 'JsonWebTokenError') {
                return { code: 403, msg: "token.invalid" }
            }
        } else {
            return { code: 0, decoded }
        }
    })
    if (jwtAuth['code'] !== 0) return jwtAuth as IAuthToken
    const expireCheck = Number(jwtAuth?.['decoded']?.iat ?? 0) < Number(jwtAuth?.['decoded']?.exp ?? 0)
    if (!expireCheck) return { code: 403, msg: "token.expired" }
    const validToken = await tokenTableRepository
        .createQueryBuilder("token")
        .select("token.blocked")
        .where("token.jwt = :token", { token })
        .andWhere("token.user_id = :id", { id })
        .getOne()
    if (validToken !== null) {
        if (validToken.blocked === 0) {
            return true
        } else {
            return { code: 403, msg: "token.blocked" }
        }
    } else return { code: 403, msg: "token.id_not_match" }
}
export default Token