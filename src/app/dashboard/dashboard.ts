import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskItem, TaskDto } from '../services/task';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private taskService = inject(TaskService);

  // Core Data
  tasks = signal<TaskItem[]>([]);
  editingId = signal<number | null>(null);

  // Interaction & IxD States
  isLoadingTasks = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  deletingTaskId = signal<number | null>(null);
  
  feedbackMessage = signal<{ text: string; type: 'success' | 'danger' } | null>(null);

  // Sorting / Reordering Controls
  sortBy = signal<'title' | 'status' | 'id'>('id');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Computed Signal for Reordered Tasks
  sortedTasks = computed(() => {
    const list = [...this.tasks()];
    const field = this.sortBy();
    const isAsc = this.sortDirection() === 'asc';

    return list.sort((a, b) => {
      let valA = a[field] ?? '';
      let valB = b[field] ?? '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });
  });

  taskDto: TaskDto = {
    title: '',
    description: '',
    status: 'Open'
  };

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoadingTasks.set(true);
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoadingTasks.set(false);
      },
      error: (err) => {
        this.showFeedback('Failed to load tickets. Please check backend API.', 'danger');
        this.isLoadingTasks.set(false);
      }
    });
  }

  saveTask(): void {
    if (!this.taskDto.title.trim()) {
      this.showFeedback('Title is required.', 'danger');
      return;
    }

    this.isSaving.set(true);
    const id = this.editingId();

    if (id) {
      // UPDATE ACTION
      this.taskService.updateTask(id, this.taskDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showFeedback('Ticket updated successfully!', 'success');
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.isSaving.set(false);
          this.showFeedback('Failed to update ticket.', 'danger');
        }
      });
    } else {
      // CREATE ACTION
      this.taskService.createTask(this.taskDto).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.showFeedback('Ticket created successfully!', 'success');
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.isSaving.set(false);
          this.showFeedback('Failed to create ticket.', 'danger');
        }
      });
    }
  }

  startEdit(task: TaskItem): void {
    if (!task.id) return;
    this.editingId.set(task.id);
    this.taskDto = {
      title: task.title,
      description: task.description,
      status: task.status
    };
    this.showFeedback(`Editing "${task.title}"`, 'success');
  }

  deleteTask(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this ticket?')) {
      this.deletingTaskId.set(id);

      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.deletingTaskId.set(null);
          this.showFeedback('Ticket deleted successfully.', 'success');
          this.loadTasks();
        },
        error: () => {
          this.deletingTaskId.set(null);
          this.showFeedback('Failed to delete ticket.', 'danger');
        }
      });
    }
  }

  // Reordering controls handler
  setSort(field: 'title' | 'status' | 'id'): void {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  resetForm(): void {
    this.editingId.set(null);
    this.taskDto = { title: '', description: '', status: 'Open' };
  }

  private showFeedback(text: string, type: 'success' | 'danger'): void {
    this.feedbackMessage.set({ text, type });
    setTimeout(() => {
      this.feedbackMessage.set(null);
    }, 3500);
  }
}