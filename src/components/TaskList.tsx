
import { Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const TaskList = ({ tasks, isLoading, onEdit, onDelete, isDeleting }: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">No tasks yet</div>
        <div className="text-muted-foreground text-sm mt-1">Click "Add Task" to create your first task</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task._id} className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {task.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
                <h3 className="font-semibold text-foreground">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {task.status}
                </span>
              </div>
              {task.description && (
                <p className="text-muted-foreground mb-2">{task.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                disabled={isDeleting}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
