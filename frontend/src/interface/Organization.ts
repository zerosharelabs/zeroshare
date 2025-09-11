import { Member as BetterAuthMember } from "better-auth/plugins/organization";
import { User } from "./User";

export type MembersResponse = {
  members: Member[];
  total: number;
};

export type Member = BetterAuthMember & {
  user: User;
};
