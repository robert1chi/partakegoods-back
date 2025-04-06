import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class UserTable {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column()
    username: string

    @Column({ select: false })
    passwd: string

    @Column({ select: false })
    salt: string

    @Column({ type: 'int', nullable: false })
    role: number

    @Column('tinyint', { nullable: false, default: () => 0 })
    available: number
}