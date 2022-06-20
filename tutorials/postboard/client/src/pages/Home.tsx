import PostInput from 'components/PostInput';
import PostItem from 'components/PostItem';
import { AuthContext } from 'context/AuthContext';
import { PostContext } from 'context/PostContext';
import useAccount from 'hooks/useAccount';
import usePost from 'hooks/usePosts';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AccountType } from 'types/Account.type';

const Landing = () => {
  const authContext = useContext(AuthContext);
  const {
    state: { posts },
  } = useContext(PostContext);
  const { getLatestPosts, createPost, likePost, repost } = usePost();
  const { followAccount, isFollowing, getAccount } = useAccount();
  const [account, setAccount] = useState<AccountType>();
  const navigate = useNavigate();
  const isAuthenticated = useMemo<boolean>(() => !!authContext.state.address, [authContext]);

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      getLatestPosts();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const address = authContext.state.address;
    if (address) {
      getAccount(address).then(setAccount);
    }
  }, [authContext.state.address]);

  const submitPost = (message: string) => {
    createPost(message, authContext.state.passphrase);
  };

  const viewPost = (id: string) => {
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

  const followUser = (account: string) => {
    followAccount(account, authContext.state.passphrase);
  };

  return (
    <div className="app">
      {authContext.state.address ? <PostInput onSubmit={submitPost} /> : null}
      <h3 className="bold">Recent Post</h3>
      {posts.map((post) => (
        <PostItem
          className="shadow"
          key={post.id}
          post={post}
          viewPost={() => viewPost(post.id)}
          viewComments={() => viewPost(post.id)}
          repost={() => repostItem(post.id)}
          likePost={() => likePostItem(post.id)}
          followAccount={() => followUser(post.author)}
          isFollowing={account ? isFollowing(post.author, account.following) : false}
          disabled={!isAuthenticated}
          address={authContext.state.address}
        />
      ))}
    </div>
  );
};

export default Landing;
