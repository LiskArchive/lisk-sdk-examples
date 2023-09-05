import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAccount from 'hooks/useAccount';
import usePost from 'hooks/usePosts';
import { PostType } from 'types/Post.type';
import PostItem from 'components/PostItem';
import { AccountType } from 'types/Account.type';
import { AuthContext } from 'context/AuthContext';

const ViewProfile = () => {
  const address = useParams().id;
  const authContext = useContext(AuthContext);
  const { getPostsArrayByIds, likePost, repost } = usePost();
  const navigate = useNavigate();
  const { isLoading, getAccount } = useAccount();
  const [posts, setPosts] = useState<Array<PostType>>([]);
  const [account, setAccount] = useState<AccountType | undefined>();
  const isAuthenticated = useMemo<boolean>(() => !!authContext.state.address, [authContext]);

  useEffect(() => {
    if (address) {
      getAccount(address).then(setAccount);
    }
  }, [address]);

  useEffect(() => {
    if (account?.posts.length) {
      getPostsArrayByIds(account.posts).then((data) => {
        setPosts(data);
      });
    }
  }, [account?.posts.length]);

  const viewPost = (id: string) => {
    console.log('id', id);
    navigate(`/post/${id}`);
  };

  const likePostItem = (id: string) => {
    if (isAuthenticated) {
      likePost(id, authContext.state.passphrase);
    }
  };

  const repostItem = (id: string) => {
    if (isAuthenticated) {
      repost(id, authContext.state.passphrase);
    }
  };

  if (isLoading && !account) {
    return <div className="spinner">Loading...</div>;
  }

  return !account ? (
    <h3>Cannot find account</h3>
  ) : (
    <div>
      {posts.map((post, i) => (
        <PostItem
          key={`${post.id}-${i}`}
          address={account.address}
          post={post}
          viewPost={() => viewPost(post.id)}
          viewComments={() => viewPost(post.id)}
          likePost={() => likePostItem(post.id)}
          repost={() => repostItem(post.id)}
          disabled={!isAuthenticated}
        />
      ))}
    </div>
  );
};

export default ViewProfile;
