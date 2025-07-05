export interface Message {
  message: string;
  id: number | string;
  created_at: Date;
  updated_at: Date;
  from_id: number;
  to_id: number;
}

export interface AIMessage {
  id: number;
  created_at: Date;
  updated_at: Date;
  session_id: string;
  prompt: string;
  response: string;
}
