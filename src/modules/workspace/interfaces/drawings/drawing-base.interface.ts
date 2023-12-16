export interface DrawingBase {
  id: string;
  angel: number;
  coordinates: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
  };
  width: number;
  height: number;
  strokeColor: string;
  strokeWidth: number;
}
