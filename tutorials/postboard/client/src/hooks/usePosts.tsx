import { transactions } from '@liskhq/lisk-client/browser';
import { PostContext } from 'context/PostContext';
import types from 'context/types';
import { useContext, useState } from 'react';
import { PostType } from 'types/Post.type';
import { getClient } from 'utils/getClient';
import useAlert from './useAlert';

const usePost = () => {
  const postContext = useContext(PostContext);
  const alert = useAlert();
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
      client.invoke('post:getLatestPosts').then(async (res: Array<string>) => {
        const data = await getPostsArrayByIds(res);
        postContext.dispatch({ type: types.GET_POSTS, payload: data });
      });
    });
  };

  const createPost = (message: string, passphrase: string) => {
    setIsLoading(true);
    getClient()
      .then(async (client) => {
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
        await client.transaction.send(tx);
        setIsLoading(false);
        alert.showSuccessAlert('Post created');
      })
      .catch((err) => {
        alert.showErrorAlert(err.message);
      });
  };

  const replyPost = (postId: string, content: string, passphrase: string, cb?: (id: string) => void) => {
    getClient()
      .then(async (client) => {
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
        const res = await client.transaction.send(tx);
        cb?.(res.transactionId);
        alert.showSuccessAlert('Reply sent');
      })
      .catch((err) => {
        alert.showErrorAlert(err.message);
      });
  };

  const repost = (postId: string, passphrase: string, cb?: (id: string) => void) => {
    getClient()
      .then(async (client) => {
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
        alert.showSuccessAlert('Reposted');
      })
      .catch((err) => {
        alert.showErrorAlert(err.message);
      });
  };

  const likePost = (postId: string, passphrase: string) => {
    getClient()
      .then(async (client) => {
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
        await client.transaction.send(tx);
        alert.showSuccessAlert('Liked');
      })
      .catch((err) => {
        alert.showErrorAlert(err.message);
      });
  };

  return { getPost, createPost, getLatestPosts, replyPost, likePost, repost, isLoading, getPostsArrayByIds };
};

export default usePost;
