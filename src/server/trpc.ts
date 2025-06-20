import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

export type CreateContextOptions = {
  req?: NextRequest;
  headers?: Headers;
};

export const createTRPCContext = async (opts: CreateContextOptions) => {
  const session = await getServerSession(authOptions);

  return {
    session,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed); 