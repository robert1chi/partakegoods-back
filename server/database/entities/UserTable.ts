import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { UserGroupRole } from "./UserGroupRole";

@Entity()
export class UserTable {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column()
    username: string

    @Column({ type: 'varchar', length: 255 })
    email: string

    @Column({ select: false })
    passwd: string

    @Column({ select: false })
    salt: string

    @Column({ type: 'int', nullable: false })
    role: number

    @Column({ type: 'bigint' })
    group_id: number

    @Column('tinyint', { nullable: false, default: () => 0 })
    available: number

    @ManyToOne(()=> UserGroupRole, ugr=>ugr.user)
    group_roles: UserGroupRole[]
}