import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./database";
import {
  anonymous,
  createAuthMiddleware,
  organization,
} from "better-auth/plugins";
import { sendUserInvitation } from "@/utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  user: { deleteUser: { enabled: true } },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {}),
  },
  plugins: [
    anonymous(),
    organization({
      async sendInvitationEmail(data) {
        const url = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
        const inviteLink = `${url}/invitation/${data.id}`;
        sendUserInvitation({
          to: data.email,
          from: data.inviter.user.email,
          inviteLink,
        });
      },
    }),
  ],
});
