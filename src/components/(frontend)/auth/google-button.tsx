'use client';

import { googleAutheticate } from "@/actions/google-login";
import { useActionState } from "react";
import {BsGoogle} from "react-icons/bs";
import { Button } from "../ui/button";


const GoogleLogin = ()=> {
    const [errorMsgGoogle, dispatchGoogle]  = useActionState(googleAutheticate,undefined)
    return (
        <form className="flex mt-4" action={dispatchGoogle}>
            <Button variant={"outline"} className="flex flex-row items-center gap-3 w-full">
                <BsGoogle/>
                Google ile Giriş Yap
            </Button>
            <p>{errorMsgGoogle}</p>
        </form>
    )

}

export default GoogleLogin;