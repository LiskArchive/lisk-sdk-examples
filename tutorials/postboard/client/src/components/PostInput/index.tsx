// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { LegacyRef, useRef, useState, FormEvent, ChangeEvent } from 'react';
import { AvatarSvg } from 'assets/icons';
import Button from 'components/Button';

type PostInputType = {
  onSubmit: (message: string) => void;
  className?: string;
};

const PostInput = ({ onSubmit, className }: PostInputType) => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<LegacyRef<HTMLInputElement> | undefined>();

  const submitPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(message);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

  return (
    <form onSubmit={submitPost} className={`post-input ${className}`}>
      <AvatarSvg />
      <input
        onChange={handleChange}
        value={message}
        maxLength={250}
        ref={inputRef}
        type="text"
        placeholder="Type your message"
      />
      <Button type="submit" disabled={!message}>
        Post
      </Button>
    </form>
  );
};

export default PostInput;
