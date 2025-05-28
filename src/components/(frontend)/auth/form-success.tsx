import { BedSingleIcon } from "lucide-react";

interface FormSuccessProps {
    message?: string;
}


export const FormSuccess = ({message} : FormSuccessProps) => {
    if (!message) return null;

    return (
        <div className="flex space-x-4 items-center p-2 rounded-lg text-black bg-green-500/30">
            <BedSingleIcon className="w-4 h-4" />
            <p>{message}</p>
        
        </div>
    )
}