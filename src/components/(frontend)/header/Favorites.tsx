"use client";


import { Heart} from "lucide-react";

const Favorites = () => {


  return (
    <div
      className="relative cursor-pointer flex items-center"
    >
      <div className="text-3xl">
        <Heart />
      </div>
     
   
      <span className="ml-2">Favorilerim</span>
    </div>
  );
};

export default Favorites;
