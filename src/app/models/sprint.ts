export type Sprint = {
  id: any;
  label: string;
  themes: Theme[];
  counterTheme: number;
  users: any;
  createDate: string;
  createDateString: string;
  link?: string;
};

export type Theme = {
  id: number;
  type: "is-success" | "is-danger" | "is-warning" | "is-valid";
  title: string;
};

export type SUser = {
  username: string;
  email: string;
  uid: any;
  moderator: boolean;
};
