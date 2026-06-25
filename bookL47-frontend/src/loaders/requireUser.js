import getUser from "../functions/getUser";
import { redirect } from "react-router";

export default async function requireUser() {
    const user = await getUser()
    if (!user || user.role === 'guest' ) {
        throw redirect("/")
    }
    return null
}