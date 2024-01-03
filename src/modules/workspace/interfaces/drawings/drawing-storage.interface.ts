import { Drawing } from "./drawing.interface";

export interface DrawingStorageData {
  drawings: Drawing[];
}

export interface DrawingStorage {
  restore(): Promise<DrawingStorageData>;
  setDrawings(drawings: Drawing[]): Promise<void>;
}
