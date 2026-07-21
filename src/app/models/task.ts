export interface TaskItem {
  id?: number;
  title: string;
  description: string;
  status: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskDto {
  title: string;
  description: string;
  status: string;
}