import { Coordinates } from "@workspace/interfaces/coordinates.interface";

export interface DrawingBase {
  id: string;
  angel: number;
  coordinates: Coordinates;
  width: number;
  height: number;
}
