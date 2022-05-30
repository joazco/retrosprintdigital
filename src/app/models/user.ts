export type User = {
  username: string;
  email: string;
  business?: string;
  name?: string;
  firstname?: string;
  newsletter: boolean;
  createdAt: string;
  lastConnectionAt: string;
  account: Account;
  uid: string;
  sprints?: any;
  cgu: boolean;
};

export type Account = {
  type: "free";
};

export type USprint = {
  id: string;
  moderator?: boolean;
  createAt?: boolean;
};

export type Info = {
  content: string;
  theme: number;
  themeType?: string;
};
