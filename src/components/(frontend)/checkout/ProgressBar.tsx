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
    <div className="flex items-center justify-between gap-4 mb-8 px-2">
      {steps.map((_, index) => {
        const Icon = stepIcons[index];
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Icon Circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10
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

            {/* Label */}
            <span
              className={`mt-2 text-sm ${
                isCompleted || isActive ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              {stepLabels[index]}
            </span>

            {/* Çizgi */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 left-1/2 w-full h-0.5 z-0
                  ${
                    index < currentIndex
                      ? "bg-blue-600"
                      : "bg-gray-300"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
