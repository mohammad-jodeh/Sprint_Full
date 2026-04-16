import { injectable, inject } from "tsyringe";
import { IProjectRepo } from "../../domain/IRepos/IProjectRepo";
import {
  CreateProjectDto,
  UpdateProjectDTO,
} from "../../domain/DTOs/projectDTO";
import { Project } from "../../domain/entities";
import {
  FindProjectOptions,
  ProjectPermission,
  StatusType,
} from "../../domain/types";
import { ProjectMembersService } from "./project-members.service";
import { CreateProjectMemberDto } from "../../domain/DTOs/projectMemberDTO";
import { BoardColumnService } from "./board-column.service";
import { StatusService } from "./status.service";
import { CreateStatusDto } from "../../domain/DTOs/statusDTO";

@injectable()
export class ProjectService {
  constructor(
    @inject("IProjectRepo") private projectRepo: IProjectRepo,
    @inject(ProjectMembersService)
    private memberService: ProjectMembersService,
    @inject(BoardColumnService) private boardColumnService: BoardColumnService,
    @inject(StatusService) private statusService: StatusService
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = await this.projectRepo.create(dto);

    const newMembership: CreateProjectMemberDto = {
      userId: project.createdBy,
      projectId: project.id,
      permission: ProjectPermission.ADMINISTRATOR,
    };
    const members = await this.memberService.add(newMembership);

    // Columns are now created via Settings/Project Configuration
    // No default columns are created here anymore

    return { ...project, members: [members] };
  }

  async update(dto: UpdateProjectDTO): Promise<Project> {
    // TODO: When the user tries to update the keyPrefix, I should update all keys for epics and issues to use the new keyPrefix
    // * Cannot address this [todo] until the issue and epic services are implemented
    return this.projectRepo.update(dto);
  }

  async delete(id: string): Promise<void> {
    return this.projectRepo.delete(id);
  }

  async find(options: FindProjectOptions, userId: string): Promise<Project[]> {
    return this.projectRepo.find(options, userId);
  }
}
