import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

// 1. Interfaces matching your .NET TaskItem and TaskDto models
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

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Matches route: api/tasks on your ASP.NET backend
  private api = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) { }

  // GET: api/tasks
  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.api);
  }

  // GET: api/tasks/{id}
  getTask(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.api}/${id}`);
  }

  // POST: api/tasks
  createTask(dto: TaskDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.api, dto);
  }

  // PUT: api/tasks/{id}
  updateTask(id: number, dto: TaskDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.api}/${id}`, dto);
  }

  // DELETE: api/tasks/{id}
  deleteTask(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${id}`);
  }
}