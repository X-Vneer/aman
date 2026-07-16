"use client"
import React, { createContext, useContext, useState } from "react"
import { User } from "../../types"

const UserContext = createContext<[User, React.Dispatch<React.SetStateAction<User>>] | null>(null)

export const UserProvider = ({ children, user }: { children: React.ReactNode; user: User }) => {
  const state = useState(user)
  return <UserContext.Provider value={state}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const value = useContext(UserContext)
  if (!value) throw new Error("useUser should be UserContext")

  return value
}
