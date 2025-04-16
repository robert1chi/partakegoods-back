import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class TypeList {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string

    @Column('timestamp', { nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'bigint' })
    creator_id: string

    @Column({ type: 'bigint' })
    owner_id: string
    
    @Column({ type: 'varchar', length: 255 })
    type_name: string

    @Column({ type: 'bigint' })
    group_id: string

    @Column({ type: 'int' })
    total_number: string

    @Column({ type: 'tinyint' })
    finished: string

    @Column('tinyint', { nullable: false, default: () => 0 })
    available: number
}