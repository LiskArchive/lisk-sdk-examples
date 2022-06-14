export type AccountType = {
  username: string;
  followers: Array<string>;
  following: Array<string>;
  posts: Array<string>;
  replies: Array<string>;
  address: string;
};

export type AccountApiResponse = {
  address: string;
  token: {
    balance: string;
  };
  sequence: {
    nonce: string;
  };
  keys: {
    numberOfSignatures: number;
    mandatoryKeys: Array<string>;
    optionalKeys: Array<string>;
  };
  dpos: {
    delegate: {
      username: string;
    };
    sentVotes: Array<string>;
    unlocking: Array<string>;
  };
  post: {
    following: Array<string>;
    followers: Array<string>;
    posts: Array<string>;
    replies: Array<string>;
    likes: Array<string>;
  };
};
