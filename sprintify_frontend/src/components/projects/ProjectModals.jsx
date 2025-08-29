import NewProjectModal from "../modals/NewProjectModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

export default function ProjectModals({
  showCreateModal,
  onCloseCreateModal,
  onCreateProject,
  editTarget,
  onCloseEditModal,
  onUpdateProject,
  deleteTarget,
  onCloseDeleteModal,
  onDeleteProject,
}) {
  return (
    <>
      {showCreateModal && (
        <NewProjectModal
          onClose={onCloseCreateModal}
          onCreate={onCreateProject}
        />
      )}
      
      {editTarget && (
        <NewProjectModal
          project={editTarget}
          onClose={onCloseEditModal}
          onCreate={onUpdateProject}
        />
      )}
      
      {deleteTarget && (
        <ConfirmDeleteModal
          name={deleteTarget.name}
          type="project"
          onClose={onCloseDeleteModal}
          onConfirm={onDeleteProject}
        />
      )}
    </>
  );
}
