import React from 'react'
import GuestHome from './GuestHome'
import NonMemberHome from './NonMemberHome'
import MemberHome from './MemberHome'
import CrewHome from './CrewHome'
import AdminHome from './AdminHome'

export default function Home( {user } ) {

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
