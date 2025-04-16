import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { UserTable } from "./UserTable";
import { GroupList } from "./GroupList";

@Entity()
export class UserGroupRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserTable, user => user.group_roles)
  user: UserTable;

  @ManyToOne(() => GroupList, group => group.user_roles)
  group: GroupList;

  @Column()
  role: number;
}