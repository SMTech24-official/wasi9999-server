export type TShift = {
  readonly id: string;
  role: string;
  location: string;
  date: string; 
  startTime: string;
  endTime: string;
  payAmount: number;
  vacancy?: number; 
  description: string;
  isUrgent?: boolean;
};