import { createAuthClient } from "better-auth/react";
import {
  anonymousClient,
  organizationClient,
} from "better-auth/client/plugins";
import { baseURL } from "./api";

export const { signIn, signUp, useSession, signOut, deleteUser, organization } =
  createAuthClient({
    baseURL: baseURL,
    plugins: [anonymousClient(), organizationClient()],
  });
