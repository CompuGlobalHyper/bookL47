import React, { useContext, useEffect } from 'react'
import { useOutletContext } from "react-router";

import GuestHome from './GuestHome.jsx'
import NonMemberHome from './NonMemberHome.jsx'
import MemberHome from './MemberHome.jsx'
import CrewHome from './CrewHome.jsx'
import AdminHome from './AdminHome.jsx'
import { UserContext } from '../../contexts/UserContext.jsx';

export default function Home() {
  const { user } = useContext(UserContext)
  const { setMessage } = useOutletContext()


  const homePages = {
  guest: <GuestHome setMessage={setMessage} />,
  nonMember: <NonMemberHome setMessage={setMessage} />,
  member: <MemberHome setMessage={setMessage} />,
  crew: <CrewHome setMessage={setMessage} />,
  admin: <AdminHome setMessage={setMessage} />,
  };
  return homePages[user.role]
}
