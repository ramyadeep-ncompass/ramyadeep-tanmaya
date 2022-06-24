import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.service";
import { Repo } from "./repo.entity";
import { RepoService } from "./repo.service";

@Module({
    imports: [TypeOrmModule.forFeature([Repo])],
    providers: [RepoService],
    exports:[RepoService]
})
export class RepoModule { }