"use client";

import React from "react";
import ProceedToBuy from "./ProceedToBuy";
import ShoppingCart from "./ShoppingCart";

const Cart = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mt-10 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sepet */}
        <div className="flex-1">
          <ShoppingCart />
        </div>

        {/* Satın Al */}
        <div className="w-full lg:w-1/3">
          <ProceedToBuy />
        </div>
      </div>
    </div>
  );
};

export default Cart;
