import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserGroupRole } from "./UserGroupRole"

@Entity()
export class GroupList {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'bigint' })
    creator_id: string

    @Column({ type: 'varchar', length: 255 })
    group_name: string

    @Column({ type: 'varchar', length: 255 })
    group_desc: string

    @Column('tinyint', { nullable: false, default: () => 0 })
    available: number

    @OneToMany(()=>UserGroupRole, ugr=> ugr.group)
    user_roles: UserGroupRole[]
}