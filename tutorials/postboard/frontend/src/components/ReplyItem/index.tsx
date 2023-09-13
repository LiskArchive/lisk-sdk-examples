import React from 'react';
import { AvatarSvg } from 'assets/icons';
import { stringShortener } from 'utils/helpers';
import { ReplyType } from 'types/Reply.type';
import { Link } from 'react-router-dom';

type PostItemProps = {
  reply: ReplyType;
};

const ReplyItem = ({ reply }: PostItemProps) => {
  return (
    <div className="reply-item">
      <div className="avatar">
        <Link to={`/profile/${reply.author}`}>
          <AvatarSvg />
        </Link>
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
      </div>
    </div>
  );
};

export default ReplyItem;
