import { createContext, Dispatch } from 'react';
import { PostType } from 'types/Post.type';

export type PostContextState = {
  posts: { [key: string]: PostType };
};

export type PostActionType = { type: string; payload: PostType };

type PostContext = {
  state: PostContextState;
  dispatch: Dispatch<PostActionType>;
};

export const PostContext = createContext({} as PostContext);
