import getUser from "../functions/getUser";
import { redirect } from "react-router";

export default async function requireVerfied() {
    const user = await getUser()
    if (!user || !user.verified) {
        throw redirect("/")
    }
    return null
}