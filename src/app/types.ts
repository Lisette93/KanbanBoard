export type ID = string;

export type Task = {
  id: ID;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
};

export type Column = {
  id: ID;
  title: string;
  taskIds: ID[];
};

export type Board = {
  id: ID;
  name: string;
  columnOrder: ID[];
};

export type AppState = {
  boards: Record<ID, Board>;
  columns: Record<ID, Column>;
  tasks: Record<ID, Task>;
  ui: { activeBoardId: ID | null };
};
