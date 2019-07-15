let db = {
  user: [
    {
      userId: 'sd34kkj433435sd',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-07-03T11:46:01.018Z',
      imageUrl: 'image/sdfwer/sdfswer',
      bio: 'Hellow, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Los Angeles, CA'
    },
  ],
  post: [
    {
      userHandle: 'user',
      body: 'this is the body',
      createdAt: '2019-07-03T11:46:01.018Z',
      likeCount: 5,
      commentCount: 2
    },
  ],
  comments: [
    {
      userHandle: 'user',
      postId: 'dskfjksdksjfkjflkd',
      body: 'Nice one mate!',
      createdAt: '2019-07-03T11:46:01.018Z'
    },
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read:  'true | false',
      postId: 'dskfjksdksjfkjflkd',
      type: 'like | comment',
      createdAt: '2019-07-03T11:46:01.018Z'
    },
  ],
};

const userDetails = {
  //Redux data
  credentials: {
    userId: 'N343343JSDF4342WSDF32',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2019-07-03T11:46:01.018Z',
    imageUrl: 'image/sdfwer/sdfswer',
    bio: 'Hellow, my name is user, nice to meet you',
    website: 'https://user.com',
    location: 'Los Angeles, CA'
  },
  likes: [
    {
      userHandle: 'user',
      postId: '234jsdfkles43341'
    },
    {
      userHandle: 'user',
      postId: '23434skjfnklsd34'
    },
  ],
};