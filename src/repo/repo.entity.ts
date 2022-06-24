import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Repo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    repositoryOwner: string;

    @Column()
    email: string;

    @Column()
    repositoryId:number;

    @Column()
    repositoryName: string;

    @Column()
    repositoryUrl: string;

    @Column()
    cloneUrl: string;

    @Column()
    contributorsUrl: string;
}