import { ReplyType } from './Reply.type';

export type PostType = {
  id: string;
  likes: string[];
  replies: ReplyType[];
  reposts: string[];
  date: Date;
  author: string;
  content: string;
};
