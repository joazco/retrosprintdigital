export type Notification = {
  type: "info" | "warning" | "danger";
  message: string;
  new: boolean;
  createDate: string;
};
