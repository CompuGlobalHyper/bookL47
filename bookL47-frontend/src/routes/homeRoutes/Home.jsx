import React, { useContext, useEffect } from 'react'
import { useOutletContext } from "react-router";

import GuestHome from './GuestHome.jsx'
import UserHome from './UserHome.jsx'
import MemberHome from './MemberHome.jsx'
import CrewHome from './CrewHome.jsx'
import AdminHome from './AdminHome.jsx'
import { UserContext } from '../../contexts/UserContext.jsx';

export default function Home() {
  const { user } = useContext(UserContext)
  const { setMessage } = useOutletContext()


  const homePages = {
  guest: <GuestHome setMessage={setMessage} />,
  nonMember: <UserHome setMessage={setMessage} />,
  member: <UserHome setMessage={setMessage} />,
  life: <UserHome setMessage={setMessage} />,
  crew: <CrewHome setMessage={setMessage} />,
  admin: <AdminHome setMessage={setMessage} />,
  };
  return homePages[user.role]
}
