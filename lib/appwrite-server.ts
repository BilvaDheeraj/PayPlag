import { Client, Databases, Users, Storage, ID, Query } from 'node-appwrite'

const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!)

export const serverDatabases = new Databases(serverClient)
export const serverUsers = new Users(serverClient)
export const serverStorage = new Storage(serverClient)

export { ID, Query }
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
export const COLLECTIONS = {
  USERS: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  ORDERS: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!,
  TOKENS: process.env.NEXT_PUBLIC_APPWRITE_TOKENS_COLLECTION_ID!,
  RESULTS: process.env.NEXT_PUBLIC_APPWRITE_RESULTS_COLLECTION_ID!,
}
