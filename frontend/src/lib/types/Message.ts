export interface Message {
  message: string;
  id: number;
  created_at: Date;
  updated_at: Date;
  fromId: number;
  toId: number;
}
