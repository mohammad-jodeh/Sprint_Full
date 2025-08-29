import { AppDataSource } from "../data-source";

/**
 * Migration to fix status records with null projectId values
 * This must run before schema synchronization to prevent constraint violations
 */
export async function fixStatusProjectIdMigration(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    console.warn("⚠️  Database not initialized. Skipping status projectId migration.");
    return;
  }

  const queryRunner = AppDataSource.createQueryRunner();
  
  try {
    console.info("🔧 Starting status projectId migration...");
    
    // Check if there are any status records with null projectId
    const nullProjectIdStatuses = await queryRunner.query(
      `SELECT id FROM status WHERE "projectId" IS NULL`
    );
    
    if (nullProjectIdStatuses.length === 0) {
      console.info("✅ No status records with null projectId found. Migration skipped.");
      return;
    }
    
    console.info(`🔍 Found ${nullProjectIdStatuses.length} status records with null projectId`);
    
    // Get the first available project to assign orphaned statuses to
    const firstProject = await queryRunner.query(
      `SELECT id FROM project LIMIT 1`
    );
    
    if (firstProject.length === 0) {
      // If no projects exist, delete orphaned statuses as they cannot be valid
      console.warn("⚠️  No projects found. Deleting orphaned status records...");
      await queryRunner.query(`DELETE FROM status WHERE "projectId" IS NULL`);
      console.info("✅ Orphaned status records deleted.");
    } else {
      // Assign orphaned statuses to the first available project
      const projectId = firstProject[0].id;
      console.info(`🔄 Assigning orphaned statuses to project: ${projectId}`);
      
      await queryRunner.query(
        `UPDATE status SET "projectId" = $1 WHERE "projectId" IS NULL`,
        [projectId]
      );
      
      console.info("✅ Orphaned status records updated with projectId.");
    }
    
    console.info("✅ Status projectId migration completed successfully.");
    
  } catch (error) {
    console.error("❌ Error during status projectId migration:", error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}