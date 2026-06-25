import React, { useEffect } from 'react'
import { useOutletContext } from "react-router";

import NonMemberBook from './NonMemberBook.jsx'
import MemberBook from './MemberBook.jsx'
import AdminBook from './AdminBook.jsx'


export default function Book() {

  const { user, setUser, setLoading, setMessage } = useOutletContext()

  const bookPages = {
  nonMember: NonMemberBook,
  member: MemberBook,
  admin: AdminBook,
};

const Component = bookPages[user.role];

return Component
  ? <Component setMessage={setMessage} />
  : <p>Invalid user role.</p>;
}
