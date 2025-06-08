"use client";

import { Step, steps } from "./types";
import {
  Home,
  Truck,
  CreditCard,
  FileText,
} from "lucide-react";

const stepIcons = [Home, Truck, CreditCard, FileText];
const stepLabels = ["Adres", "Kargo", "Ödeme", "Özet"];

export default function ProgressBar({ step }: { step: Step }) {
  const currentIndex = steps.indexOf(step);

  return (
    <div className="relative flex justify-between items-center w-full mb-8 px-4">
      {/* Çizgi arka plan (tüm bar) */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 z-0" />

      {steps.map((_, index) => {
        const Icon = stepIcons[index];
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div
            key={index}
            className="relative z-10 flex flex-col items-center flex-1 text-center"
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200
                ${
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white"
                    : isActive
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
            >
              <Icon size={20} />
            </div>

            <span
              className={`mt-2 text-xs font-medium ${
                isCompleted || isActive ? "text-black" : "text-gray-400"
              }`}
            >
              {stepLabels[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
