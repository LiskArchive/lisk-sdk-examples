import PostInput from 'components/PostInput';
import PostItem from 'components/PostItem';
import { AuthContext } from 'context/AuthContext';
import { PostContext } from 'context/PostContext';
import useAccount from 'hooks/useAccount';
import usePost from 'hooks/usePosts';
import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

const Landing = () => {
  const authContext = useContext(AuthContext);
  const {
    state: { posts },
  } = useContext(PostContext);
  const { getLatestPosts, createPost, likePost, repost } = usePost();
  const { followAccount } = useAccount();
  const navigate = useNavigate();
  const postItems = useMemo(() => Object.values(posts), [posts]);
  const isAuthenticated = useMemo<boolean>(() => !!authContext.state.address, [authContext]);

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      getLatestPosts();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      {postItems.length ? (
        postItems.map((post) => (
          <PostItem
            className="shadow"
            key={post.id}
            post={post}
            viewPost={() => viewPost(post.id)}
            viewComments={() => viewPost(post.id)}
            repost={() => repostItem(post.id)}
            likePost={() => likePostItem(post.id)}
            followAccount={() => followUser(post.author)}
            disabled={!isAuthenticated}
            address={authContext.state.address}
          />
        ))
      ) : (
        <h5>...fetching posts</h5>
      )}
    </div>
  );
};

export default Landing;
