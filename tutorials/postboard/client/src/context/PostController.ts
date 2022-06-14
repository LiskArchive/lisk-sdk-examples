import { useReducer } from 'react';
import { PostContextState, PostActionType } from './PostContext';
import types from './types';

const initialState: PostContextState = {
  posts: [],
};

function reducer(state: PostContextState, action: PostActionType) {
  switch (action.type) {
    case types.GET_POSTS:
      return {
        posts: action.payload,
      };
    default:
      return state;
  }
}

const usePostController = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
};

export default usePostController;
