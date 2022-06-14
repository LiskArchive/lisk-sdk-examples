import { transactions } from '@liskhq/lisk-client';
import { AuthContext } from 'context/AuthContext';
import { PostContext } from 'context/PostContext';
import types from 'context/types';
import { useContext, useState } from 'react';
import { PostType } from 'types/Post.type';
import { getClient } from 'utils/getClient';

const usePost = () => {
  const authContext = useContext(AuthContext);
  const postContext = useContext(PostContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPost = (id: string): Promise<PostType> =>
    new Promise((resolve) => {
      getClient().then((client) => {
        setIsLoading(false);
        client.invoke('post:getPost', { id }).then((res: PostType) => {
          resolve(res);
        });
      });
    });

  const getPostsArrayByIds = (ids: Array<string>): Promise<Array<PostType>> => {
    const posts = ids.map((id) => getPost(id));
    return Promise.all(posts);
  };

  const getLatestPosts = () => {
    setIsLoading(true);
    getClient().then((client) => {
      setIsLoading(false);
      client.invoke('post:getLatestPosts').then((res: Array<string>) => {
        res.forEach((id) =>
          getPost(id).then((data) => {
            postContext.dispatch({ type: types.GET_POSTS, payload: data });
          }),
        );
      });
    });
  };

  const createPost = (message: string, passphrase: string) => {
    setIsLoading(true);
    getClient().then(async (client) => {
      const tx = await client.transaction.create(
        {
          moduleID: 1000,
          assetID: 0,
          fee: BigInt(transactions.convertLSKToBeddows('0.1')),
          asset: {
            message,
          },
        },
        passphrase,
      );
      const res = await client.transaction.send(tx);
      setIsLoading(false);
      postContext.dispatch({
        type: types.GET_POSTS,
        payload: {
          id: res.transactionId,
          content: message,
          author: authContext.state.address,
          replies: [],
          reposts: [],
          likes: [],
          date: new Date(),
        },
      });
    });
  };

  const replyPost = (postId: string, content: string, passphrase: string, cb?: (id: string) => void) => {
    getClient().then(async (client) => {
      const tx = await client.transaction.create(
        {
          moduleID: 1000,
          assetID: 2,
          fee: BigInt(transactions.convertLSKToBeddows('0.1')),
          asset: {
            postId,
            content,
          },
        },
        passphrase,
      );
      console.log('Transaction object: ', tx);
      const res = await client.transaction.send(tx);
      cb?.(res.transactionId);
    });
  };

  const repost = (postId: string, passphrase: string, cb?: (id: string) => void) => {
    getClient().then(async (client) => {
      const tx = await client.transaction.create(
        {
          moduleID: 1000,
          assetID: 1,
          fee: BigInt(transactions.convertLSKToBeddows('0.1')),
          asset: {
            postId,
          },
        },
        passphrase,
      );
      const res = await client.transaction.send(tx);
      cb?.(res.transactionId);
    });
  };

  const likePost = (postId: string, passphrase: string) => {
    getClient().then(async (client) => {
      const tx = await client.transaction.create(
        {
          moduleID: 1000,
          assetID: 3,
          fee: BigInt(transactions.convertLSKToBeddows('0.1')),
          asset: {
            postId,
          },
        },
        passphrase,
      );
      console.log('Transaction object: ', tx);
      const res = await client.transaction.send(tx);
      console.log(res);
    });
  };

  return { getPost, createPost, getLatestPosts, replyPost, likePost, repost, isLoading, getPostsArrayByIds };
};

export default usePost;
