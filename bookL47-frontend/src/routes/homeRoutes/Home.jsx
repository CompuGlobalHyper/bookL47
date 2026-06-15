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
    console.log(user)

  }, [user])

  switch (user.role) {
    case "guest":
      return <GuestHome setMessage={setMessage}/>;
    case "nonMember":
      return <NonMemberHome setMessage={setMessage}/>;
    case "member":
      return <MemberHome setMessage={setMessage}/>;
    case "crew":
      return <CrewHome setMessage={setMessage}/>;
    case "admin":
      return <AdminHome setMessage={setMessage}/>;
  } 
}
