export interface CreateMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CreateMessageResponse {
  message: string;
}
