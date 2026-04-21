'use client'
import { Client, Account, Databases, Storage, ID, Query, OAuthProvider } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

export { ID, Query, OAuthProvider }

// ─── Database IDs ───
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  ORDERS: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
  TOKENS: process.env.NEXT_PUBLIC_APPWRITE_TOKENS_COLLECTION_ID!,
  RESULTS: process.env.NEXT_PUBLIC_APPWRITE_RESULTS_COLLECTION_ID!,
}
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!

// ─── Auth Helpers ───
export const createEmailAccount = async (
  email: string,
  password: string,
  name: string
) => {
  return await account.create(ID.unique(), email, password, name)
}

export const loginWithEmail = async (email: string, password: string) => {
  return await account.createEmailPasswordSession(email, password)
}

export const loginWithGoogle = async () => {
  return account.createOAuth2Session(
    OAuthProvider.Google,
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    `${process.env.NEXT_PUBLIC_APP_URL}/login`
  )
}

export const logout = async () => {
  return await account.deleteSession('current')
}

export const getCurrentUser = async () => {
  try {
    return await account.get()
  } catch {
    return null
  }
}
