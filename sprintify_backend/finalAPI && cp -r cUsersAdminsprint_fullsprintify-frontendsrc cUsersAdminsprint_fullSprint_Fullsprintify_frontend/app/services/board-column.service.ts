import { inject, injectable } from "tsyringe";
import { IBoardColumnRepo } from "../../domain/IRepos/IBoard-columnRepo";
import { BoardColumn } from "../../domain/entities";
import {
  CreateBoardColumnDto,
  UpdateBoardColumnDto,
} from "../../domain/DTOs/board-columnDTO";
import { StatusService } from "./status.service";
import { CreateStatusDto } from "../../domain/DTOs/statusDTO";
import { StatusType } from "../../domain/types";

@injectable()
export class BoardColumnService {
  constructor(
    @inject("IBoardColumnRepo") private boardColumnRepo: IBoardColumnRepo,
    @inject(StatusService) private statusService: StatusService
  ) {}

  async create(dto: CreateBoardColumnDto): Promise<BoardColumn> {
    // Create the column
    const column = await this.boardColumnRepo.create(dto);

    // Auto-create a default status with the same name as the column
    const statusDto: CreateStatusDto = {
      name: dto.name,
      columnId: column.id,
      projectId: dto.projectId,
      type: StatusType.BACKLOG, // Default to BACKLOG type for new columns
    };

    await this.statusService.create(statusDto);

    return column;
  }

  async update(dto: UpdateBoardColumnDto): Promise<BoardColumn> {
    return await this.boardColumnRepo.update(dto);
  }

  async updateBulk(updates: UpdateBoardColumnDto[]): Promise<BoardColumn[]> {
    return await this.boardColumnRepo.updateBulk(updates);
  }

  async delete(id: string): Promise<boolean> {
    return await this.boardColumnRepo.delete(id);
  }

  async getByProject(projectId: string): Promise<BoardColumn[]> {
    return await this.boardColumnRepo.find({ projectId });
  }
}
