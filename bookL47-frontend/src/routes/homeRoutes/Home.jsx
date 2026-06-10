import React from 'react'
import { useOutletContext } from "react-router";

import GuestHome from './GuestHome.jsx'
import NonMemberHome from './NonMemberHome.jsx'
import MemberHome from './MemberHome.jsx'
import CrewHome from './CrewHome.jsx'
import AdminHome from './AdminHome.jsx'



export default function Home() {

  const { user, setLoading } = useOutletContext()

  switch (user.role) {
    case "guest":
      return <GuestHome />;
    case "nonMember":
      return <NonMemberHome />;
    case "member":
      return <MemberHome />;
    case "crew":
      return <CrewHome />;
    case "admin":
      return <AdminHome />;
  } 
}
