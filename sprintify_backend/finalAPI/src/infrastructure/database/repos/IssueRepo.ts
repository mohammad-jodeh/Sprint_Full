import { In, Repository } from "typeorm";
import { Issue } from "../../../domain/entities/issue.entity";
import { IIssueRepo } from "../../../domain/IRepos/IIssueRepo";
import { IssueType } from "../../../domain/types";
import { AppDataSource } from "../data-source";
import { FindIssueQueryOptions } from "../../../domain/option/issueQueryOptions"; // Only import FindIssueQueryOptions

export class IssueRepo implements IIssueRepo {
  private repo: Repository<Issue>;

  constructor() {
    this.repo = AppDataSource.getRepository(Issue);
  }

  async create(issueData: Partial<Issue>): Promise<Issue> {
    // Always remove id to force new insert
    if ('id' in issueData) {
      delete issueData.id;
    }
    const issue = this.repo.create(issueData);
    return await this.repo.save(issue);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0 && result.affected !== null;
  }

  // Consolidated get and find into a single find method
  async find(
    options?: FindIssueQueryOptions // Use the imported interface
  ): Promise<{ issues: Issue[]; total: number }> {
    const query = this.repo.createQueryBuilder("issue")
      .leftJoinAndSelect("issue.status", "status")
      .leftJoinAndSelect("issue.assigneeUser", "assigneeUser")
      .leftJoinAndSelect("issue.sprint", "sprint")
      .leftJoinAndSelect("issue.epic", "epic");    // Build WHERE conditions with simple, clear logic
    let hasWhere = false;

    if (options?.projectId) {
      query.where("issue.projectId = :projectId", { projectId: options.projectId });
      hasWhere = true;
    }
    
    if (options?.sprintId) {
      if (hasWhere) {
        query.andWhere("issue.sprintId = :sprintId", { sprintId: options.sprintId });
      } else {
        query.where("issue.sprintId = :sprintId", { sprintId: options.sprintId });
        hasWhere = true;
      }
    }
    
    if (options?.assignee) {
      if (hasWhere) {
        query.andWhere("issue.assignee = :assignee", { assignee: options.assignee });
      } else {
        query.where("issue.assignee = :assignee", { assignee: options.assignee });
        hasWhere = true;
      }
    }
    
    if (options?.statusId) {
      if (hasWhere) {
        query.andWhere("issue.statusId = :statusId", { statusId: options.statusId });
      } else {
        query.where("issue.statusId = :statusId", { statusId: options.statusId });
        hasWhere = true;
      }
    }
    
    if (options?.epicId) {
      if (hasWhere) {
        query.andWhere("issue.epicId = :epicId", { epicId: options.epicId });
      } else {
        query.where("issue.epicId = :epicId", { epicId: options.epicId });
        hasWhere = true;
      }
    }
    
    if (options?.type) {
      if (hasWhere) {
        query.andWhere("issue.type = :type", { type: options.type });
      } else {
        query.where("issue.type = :type", { type: options.type });
        hasWhere = true;
      }
    }
      if (options?.priority !== undefined) {
      if (hasWhere) {
        query.andWhere("issue.issuePriority = :priority", { priority: options.priority });
      } else {
        query.where("issue.issuePriority = :priority", { priority: options.priority });
        hasWhere = true;
      }
    }

    // Get total count
    const total = await query.getCount();
    
    // Select only needed fields for performance
    query.select([
      "issue.id",
      "issue.key",
      "issue.title",
      "issue.storyPoint",
      "issue.type",
      "issue.issuePriority",
      "status.id",
      "status.name",
      "assigneeUser.id",
      "assigneeUser.fullName",
      "assigneeUser.image",
      "sprint.id",
      "sprint.name",
      "epic.id",
      "epic.title"
    ]);

    const issues = await query.getMany();
    return { issues, total };
  }

  // Renamed from findFullById to getById
  async getById(id: string): Promise<Issue | null> {
    return await this.repo.findOne({
      where: { id },
      relations: [
        "assigneeUser",
        "project",
        "status",
        "sprint",
        "epic",
        // Removed outgoingRelations and incomingRelations as per the change request
      ],
    });
  }

  // Renamed from findByKey to getByKey
  async getByKey(key: string): Promise<Issue | null> {
    return await this.repo.findOne({ where: { key } });
  }

  async update(id: string, updateData: Partial<Issue>): Promise<Issue | null> {
    await this.repo.update(id, updateData);
    return await this.getById(id); // Assuming getById fetches the full entity
  }

  async generateIssueKey(projectId: string): Promise<string> {
    // Find the project prefix (e.g., from project entity or a config)
    const project = await AppDataSource.getRepository("Project").findOne({ where: { id: projectId } });
    // Use project.keyPrefix if available, otherwise fallback to projectId substring
    const prefix = project?.keyPrefix || projectId.substring(0, 3).toUpperCase();
    
    const lastIssue = await this.repo.createQueryBuilder("issue")
        .where("issue.projectId = :projectId", { projectId })
        .orderBy("issue.createdAt", "DESC") // Assuming key generation is sequential
        .select("issue.key", "issue_key") // Explicitly alias to ensure consistent raw result
        .getRawOne();

    let nextNumber = 1;
    if (lastIssue && lastIssue.issue_key) { // Access aliased column
        const parts = lastIssue.issue_key.split('-'); // Use aliased column
        if (parts.length > 1) {
            const lastNumber = parseInt(parts[parts.length -1], 10);
            if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }
    }
    return `${prefix}-${nextNumber}`;
  }

  // async getIssueCount(projectId: string): Promise<number> {
  //   return this.ormRepo.count({ where: { project: { id: projectId } } });
  // }

  async findById(id: string): Promise<Issue | null> {
    return await this.repo.findOne({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<Issue[]> {
    return await this.repo.findBy({ id: In(ids) });
  }
}
