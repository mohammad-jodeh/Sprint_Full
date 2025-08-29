import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";

export default function ProjectsContent({
  projects = [],
  onProjectClick,
  onProjectEdit,
  onProjectDelete,
  canEditProject,
  canDeleteProject,
}) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects found."
        subtitle="Click 'New Project' in the navbar to start."
        icon="📁"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project)}
          onEdit={canEditProject(project) ? () => onProjectEdit(project) : null}
          onDelete={canDeleteProject(project) ? () => onProjectDelete(project) : null}
        />
      ))}
    </div>
  );
}
