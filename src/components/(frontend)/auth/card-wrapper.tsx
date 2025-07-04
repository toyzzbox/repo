"use client"



import {
    Card,
    CardContent,

    CardFooter,
    CardHeader,

  } from "@/components/ui/card";

  import { AuthHeader } from "./auth-header";
  import { BackButton } from "./back-button";


  interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    title: string;
    showSocial?: boolean;
    backButtonHref: string;
  }


  const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, title}: CardWrapperProps) => {
    return (
        <Card className="xl:w-1/3 md:w-1/2 shadow-md">
  <CardHeader>
   <AuthHeader label={headerLabel} title={title}/>
  </CardHeader>
  <CardContent>
  {children}
  </CardContent>
  <CardFooter>
  <BackButton label={backButtonLabel} href={backButtonHref} />
  </CardFooter>
</Card>
    )
  }


  export default CardWrapper;