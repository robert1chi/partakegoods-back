import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class ValidJwt {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column()
    user_id: string

    @Column({ nullable: false })
    jwt: string

    @Column({ type: 'tinyint', nullable: false })
    blocked: number
}