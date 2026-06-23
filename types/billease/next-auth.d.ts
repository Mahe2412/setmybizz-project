import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      businessId?: string | null;
      businessName?: string | null;
    };
  }

  interface User {
    businessId?: string | null;
    businessName?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    businessId?: string | null;
    businessName?: string | null;
  }
}
