import React, { useContext, useEffect, useMemo, useState } from 'react';
import { PostType } from 'types/Post.type';
import { useParams } from 'react-router';
import usePost from 'hooks/usePosts';
import PostInput from 'components/PostInput';
import { AuthContext } from 'context/AuthContext';
import ReplyItem from 'components/ReplyItem';
import PostItem from 'components/PostItem';

const ViewPost = () => {
  const params = useParams();
  const authContext = useContext(AuthContext);
  const { getPost, isLoading, replyPost, repost, likePost } = usePost();
  const [post, setPost] = useState<PostType | undefined>();

  const isAuthenticated = useMemo<boolean>(() => !!authContext.state.address, [authContext]);

  const getPostDetails = (id: string) => {
    getPost(id).then((data) => {
      if (data.id) {
        setPost(data);
      }
    });
  };

  const likePostItem = () => {
    if (post && isAuthenticated) {
      likePost(post.id, authContext.state.passphrase);
    }
  };

  const repostItem = () => {
    if (post && isAuthenticated) {
      repost(post.id, authContext.state.passphrase, () => {
        setPost((prevDetails) => {
          if (prevDetails) {
            return {
              ...prevDetails,
              reposts: [...prevDetails?.reposts, authContext.state.address],
            };
          }
        });
      });
    }
  };

  useEffect(() => {
    const id = params.id;
    if (id) {
      getPostDetails(id);
    }
  }, [params.id]);

  if (isLoading && !post) {
    return <div className="spinner">Loading...</div>;
  }

  const onSubmit = (message: string) => {
    if (post) {
      replyPost(post.id, message, authContext.state.passphrase, (id) => {
        setPost((prevDetails) => {
          if (prevDetails) {
            return {
              ...prevDetails,
              replies: [
                ...prevDetails?.replies,
                {
                  id,
                  content: message,
                  likes: [],
                  author: authContext.state.address,
                  date: new Date(),
                },
              ],
            };
          }
        });
      });
    }
  };

  return !post ? (
    <h3>Cannot find post</h3>
  ) : (
    <div>
      <h3 className="bold">Post</h3>
      <div className="view-post">
        <PostItem
          address={authContext.state.address}
          post={post}
          likePost={likePostItem}
          repost={repostItem}
          disabled={!isAuthenticated}
        />
        {isAuthenticated && (
          <div className="reply">
            <PostInput className="reply-input" onSubmit={onSubmit} />
          </div>
        )}
        <div className="replies">
          {post.replies.map((reply) => (
            <ReplyItem key={`${reply.date}`} reply={reply} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
