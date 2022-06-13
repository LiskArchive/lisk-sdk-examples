import React from 'react';
import { AvatarSvg, BookmarkSvg, CommentSvg, LikeFilledSvg, LikeSvg, RepostSvg } from 'assets/icons';
import { PostType } from 'types/Post.type';
import { stringShortener } from 'utils/helpers';

type PostItemProps = {
  post: PostType;
  address: string;
  viewPost?: () => void;
  likePost?: () => void;
  repost?: () => void;
  viewComments?: () => void;
  disabled?: boolean;
  className?: string;
};

const PostItem = ({ post, likePost, repost, viewPost, viewComments, disabled, className, address }: PostItemProps) => {
  const getValue = (val: number) => (val ? val : null);
  const isLiked = post.likes.indexOf(address) !== -1;
  return (
    <div className={`post-item ${className}`}>
      <div className="avatar">
        <AvatarSvg />
      </div>
      <div className="content">
        <div className="message" onClick={viewPost}>
          <p>
            {/* <strong>{account?.username}</strong>{' '} */}
            <span className="sub">
              <span>{stringShortener(post.author, 6, 6)}</span>
            </span>
          </p>
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
          <button className="icon" disabled={disabled}>
            <BookmarkSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
