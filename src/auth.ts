import { nodePublicApi, apisBaseUrl, logRequestInterceptor } from '@/services/intercepter';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import returnFetch from 'return-fetch';
import axios from 'axios';

declare module 'next-auth' {
  interface Session {
    token?: string;
    role?: string;

    user: {
      role?: string;
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessToken?: string;
  }
}

interface CredentialsType {
  account?: string;
  password: string;
  role: string;
  phoneNumber?: string;
}
const ERROR_MESSAGE = 'User not found.';

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update, //Beta!!
} = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      authorize: async credentials => {
        const userInfo = credentials as unknown as CredentialsType;
        try {
          // 번호가 있으면 회원가입으로 간주
          // if (!userInfo.phoneNumber) {
          //   return await _signIn('sign-in', userInfo);
          // }
          // return await _signIn('sign-up', userInfo);
          console.log('authorize 함수 호출됨:', userInfo);
          return { ...userInfo, id: 'dummy-id' }; // 임의의 유저 세션 생성
        } catch (error) {
          console.error('authorize 함수 에러:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 세션 만료 시간(sec)
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      console.log('JWT 콜백 호출됨:', { token, user, trigger, session });
      if (user) {
        token = { ...token, ...user };
      }
      console.log('JWT 콜백 반환됨:', token);
      return token;
    },
    session: async ({ session, token, user }) => {
      console.log('세션 콜백 호출됨:', { session, token, user });
      session.token = token.token as string;
      session.role = token.role;
      console.log('세션 콜백 반환됨:', session);
      return session;
    },
  },
});

async function _signIn(
  type: 'sign-up' | 'sign-in',
  userInfo: { account?: string; password: string; role: string; phoneNumber?: string },
) {
  // 임의의 유저 세션 생성
  return { ...userInfo, id: 'dummy-id' };
  // const { account, password, role, phoneNumber } = userInfo;
  // try {
  //   const bodyData: { email: string | undefined; password: string; phone_number?: string } = {
  //     email: account,
  //     password: password,
  //   };
  //   if (type === 'sign-up' && phoneNumber) {
  //     bodyData['phone_number'] = phoneNumber;
  //   }
  //   const res = await fetch(`${process.env.API_BASE_URL}/public-api/${type}/${role}`, {
  //     cache: 'no-store',
  //     method: 'POST',
  //     body: JSON.stringify(bodyData),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   if (res.ok) {
  //     const data = await res.json();
  //     return data;
  //   } else {
  //     const errorMessage = await res.text();
  //     throw new Error(errorMessage);
  //   }
  // } catch (error) {
  //   console.error('인증 에러:', error);
  //   const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGE;
  //   throw new Error(errorMessage);
  // }
}
