import { Drawing } from "./drawing.interface";

export interface DrawingStorage {
  getAll(): Promise<Drawing[]>;
  set(drawings: Drawing[]): Promise<void>;
}
