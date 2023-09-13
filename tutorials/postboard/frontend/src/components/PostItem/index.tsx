import React from 'react';
import { AvatarSvg, CommentSvg, LikeFilledSvg, LikeSvg, RepostSvg } from 'assets/icons';
import { PostType } from 'types/Post.type';
import { stringShortener } from 'utils/helpers';
import { Link } from 'react-router-dom';

type PostItemProps = {
  post: PostType;
  address: string;
  isFollowing?: boolean;
  viewPost?: () => void;
  likePost?: () => void;
  repost?: () => void;
  followAccount?: () => void;
  viewComments?: () => void;
  disabled?: boolean;
  className?: string;
};

const PostItem = ({
  post,
  likePost,
  repost,
  viewPost,
  viewComments,
  followAccount,
  disabled,
  className,
  address,
  isFollowing,
}: PostItemProps) => {
  const getValue = (val: number) => (val ? val : null);
  const isLiked = post.likes.indexOf(address) !== -1;
  return (
    <div className={`post-item ${className}`}>
      <div className="avatar">
        <Link to={`/profile/${post.author}`}>
          <AvatarSvg />
        </Link>
      </div>
      <div className="content">
        <p>
          {/* <strong>{account?.username}</strong>{' '} */}
          <span className="sub">
            <span>{stringShortener(post.author, 6, 6)}</span>
          </span>
          {!disabled && (
            <button className="outline" onClick={followAccount} disabled={isFollowing}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </p>
        <div className="message" onClick={viewPost}>
          <p>{post.content}</p>
        </div>
        <div className="icons">
          <button className="icon like" onClick={likePost} disabled={disabled}>
            {isLiked ? <LikeFilledSvg /> : <LikeSvg />}
            <span className="icon-item">{getValue(post.likes.length)}</span>
          </button>
          <button className="icon" onClick={viewComments}>
            <CommentSvg />
            <span className="icon-item">{getValue(post.replies.length)}</span>
          </button>
          <button className="icon" onClick={repost} disabled={disabled}>
            <RepostSvg />
            <span className="icon-item">{getValue(post.reposts.length)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
