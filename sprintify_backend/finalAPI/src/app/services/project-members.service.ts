import { inject, injectable } from "tsyringe";
import { IProjectMemberRepo } from "../../domain/IRepos/IProjectMemberRepo";
import {
  CreateProjectMemberDto,
  UpdateProjectMemberDto,
} from "../../domain/DTOs/projectMemberDTO";

@injectable()
export class ProjectMembersService {
  constructor(@inject("IProjectMemberRepo") private repo: IProjectMemberRepo) {}

  async add(newMembership: CreateProjectMemberDto) {
    return this.repo.add(newMembership);
  }

  async update(membership: UpdateProjectMemberDto) {
    return this.repo.update(membership);
  }

  async remove(membershipId: string): Promise<void> {
    await this.repo.remove(membershipId);
  }
  
  async find(where: Partial<CreateProjectMemberDto>) {
    return this.repo.find(where);
  }
}
