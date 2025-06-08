"use client";

const steps = ["address", "delivery", "payment", "summary"] as const;
type Step = typeof steps[number];

export default function ProgressBar({ step }: { step: Step }) {
  const stepLabels = ["Adres", "Kargo", "Ödeme", "Özet"];
  const currentIndex = steps.indexOf(step);

  return (
    <div className="flex justify-between mb-6">
      {stepLabels.map((label, index) => (
        <div
          key={label}
          className={`flex-1 text-center text-sm ${
            index <= currentIndex ? "font-bold text-black" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
              index <= currentIndex ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </div>
          {label}
        </div>
      ))}
    </div>
  );
}
