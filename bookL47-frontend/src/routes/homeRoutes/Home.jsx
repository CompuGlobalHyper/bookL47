import React, { useEffect } from 'react'
import { useOutletContext } from "react-router";

import GuestHome from './GuestHome.jsx'
import NonMemberHome from './NonMemberHome.jsx'
import MemberHome from './MemberHome.jsx'
import CrewHome from './CrewHome.jsx'
import AdminHome from './AdminHome.jsx'

export default function Home() {

  const { user, setUser, setLoading, setMessage } = useOutletContext()

  useEffect(() => {
  }, [user])

  const homePages = {
  guest: <GuestHome setMessage={setMessage} setUser={setUser} />,
  nonMember: <NonMemberHome setMessage={setMessage} />,
  member: <MemberHome setMessage={setMessage} />,
  crew: <CrewHome setMessage={setMessage} />,
  admin: <AdminHome setMessage={setMessage} />,
  };
  return homePages[user.role] ?? <p>Invalid user role.</p>
}
