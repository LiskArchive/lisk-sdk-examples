import React from 'react';
import { AvatarSvg, BookmarkSvg, CommentSvg, LikeSvg } from 'assets/icons';
import { stringShortener } from 'utils/helpers';
import { ReplyType } from 'types/Reply.type';

type PostItemProps = {
  reply: ReplyType;
};

const ReplyItem = ({ reply }: PostItemProps) => {
  return (
    <div className="reply-item">
      <div className="avatar">
        <AvatarSvg />
      </div>
      <div className="content">
        <div className="message">
          <p>
            <span className="sub">
              <span>{stringShortener(reply.author, 6, 6)}</span>
            </span>
          </p>
          <p>{reply.content}</p>
        </div>
        <div className="icons">
          <div className="icon like">
            <LikeSvg />
          </div>
          <div className="icon">
            <CommentSvg />
          </div>
          <div className="icon">
            <BookmarkSvg />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyItem;
