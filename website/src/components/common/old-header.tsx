import React from "react"

import FullScreenButton from "./full-screen-button"
import Logo from "./logo"
import NavBar from "./navbar"
import UserButton from "./user-button"

type Props = {}

const Header = async (props: Props) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-default-100">
      <div className="flex items-center justify-between px-4 md:px-5 lg:px-6">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Logo variant="horizontal" />
          <NavBar />
        </div>

        <div className="flex items-center gap-2">
          <UserButton />
          <FullScreenButton />
        </div>
      </div>
    </header>
  )
}

export default Header
