import ProjectsHeader from "./ProjectsHeader";
import ProjectsContent from "./ProjectsContent";
import ProjectModals from "./ProjectModals";
import useProjectsLogic from "./useProjectsLogic";

export default function ProjectsContainer() {
  const {
    filteredProjects,
    showCreateModal,
    editTarget,
    deleteTarget,
    canEditProject,
    canDeleteProject,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleProjectClick,
    handleProjectEdit,
    handleProjectDelete,
    handleCloseCreateModal,
    handleCloseEditModal,
    handleCloseDeleteModal,
  } = useProjectsLogic();

  return (
    <div className="space-y-6">
      <ProjectsHeader title="Projects" />
      
      <ProjectsContent
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
        onProjectEdit={handleProjectEdit}
        onProjectDelete={handleProjectDelete}
        canEditProject={canEditProject}
        canDeleteProject={canDeleteProject}
      />

      <ProjectModals
        showCreateModal={showCreateModal}
        onCloseCreateModal={handleCloseCreateModal}
        onCreateProject={handleCreate}
        editTarget={editTarget}
        onCloseEditModal={handleCloseEditModal}
        onUpdateProject={handleUpdate}
        deleteTarget={deleteTarget}
        onCloseDeleteModal={handleCloseDeleteModal}
        onDeleteProject={handleDelete}
      />
    </div>
  );
}
