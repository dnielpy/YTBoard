import { Account } from "./Account";

export type User = {
  id: string;
  email: string;
  imageURL: string;
  accounts: Account[];
};
