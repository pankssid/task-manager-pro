import { Task, User } from './types';

// Simple in-memory storage for demo purposes
// In production, use a real database
class Storage {
  private tasks: Map<string, Task[]> = new Map();
  private users: Map<string, User> = new Map();

  // Task methods
  getTasks(userId: string): Task[] {
    return this.tasks.get(userId) || [];
  }

  addTask(userId: string, task: Task): Task {
    const userTasks = this.getTasks(userId);
    userTasks.push(task);
    this.tasks.set(userId, userTasks);
    return task;
  }

  updateTask(userId: string, taskId: string, updates: Partial<Task>): Task | null {
    const userTasks = this.getTasks(userId);
    const taskIndex = userTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return null;
    
    userTasks[taskIndex] = { ...userTasks[taskIndex], ...updates };
    this.tasks.set(userId, userTasks);
    return userTasks[taskIndex];
  }

  deleteTask(userId: string, taskId: string): boolean {
    const userTasks = this.getTasks(userId);
    const filteredTasks = userTasks.filter(t => t.id !== taskId);
    
    if (filteredTasks.length === userTasks.length) return false;
    
    this.tasks.set(userId, filteredTasks);
    return true;
  }

  // User methods
  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  createUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const user = this.getUser(userId);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
}

export const storage = new Storage();

