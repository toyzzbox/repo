"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface CategoryFiltersProps {
  subcategories?: { id: string; name: string; _count?: { products: number } }[];
  brands?: { slug: string; name: string }[];
  attributeGroups?: {
    id: string;
    name: string;
    attributes: { id: string; name: string }[];
  }[];
}

// Custom Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
  className?: string;
}

const CustomCheckbox = ({ checked, onChange, id, className = "" }: CheckboxProps) => (
  <div className={`relative ${className}`}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <label
      htmlFor={id}
      className={`
        inline-flex items-center justify-center w-4 h-4 border-2 rounded cursor-pointer transition-all
        ${checked 
          ? 'bg-blue-600 border-blue-600' 
          : 'bg-white border-gray-300 hover:border-gray-400'
        }
      `}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </label>
  </div>
);

// Custom Button Component
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

const CustomButton = ({ onClick, children, variant = 'default', className = "" }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      ${variant === 'outline' 
        ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50' 
        : 'bg-blue-600 text-white hover:bg-blue-700'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

// Custom Slider Component
interface SliderProps {
  defaultValue: number[];
  min: number;
  max: number;
  step: number;
  onValueCommit: (values: number[]) => void;
}

const CustomSlider = ({ defaultValue, min, max, step, onValueCommit }: SliderProps) => {
  const [values, setValues] = useState(defaultValue);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    if (newMin <= values[1]) {
      const newValues = [newMin, values[1]];
      setValues(newValues);
      onValueCommit(newValues);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    if (newMax >= values[0]) {
      const newValues = [values[0], newMax];
      setValues(newValues);
      onValueCommit(newValues);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={values[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        <input
          type="number"
          value={values[0]}
          onChange={handleMinChange}
          min={min}
          max={values[1]}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
        />
        <span className="text-sm text-gray-500">-</span>
        <input
          type="number"
          value={values[1]}
          onChange={handleMaxChange}
          min={values[0]}
          max={max}
          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
        />
      </div>
    </div>
  );
};

// Custom Accordion Component
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem = ({ title, children, defaultOpen = true }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 text-left flex justify-between items-center hover:bg-gray-50 px-2 rounded"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 px-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default function CategoryFilters({
  subcategories = [],
  brands = [],
  attributeGroups = [],
}: CategoryFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const toggleMulti = (key: string, value: string) => {
    const url = new URL(window.location.href);
    const values = new Set(url.searchParams.getAll(key));
    values.has(value) ? values.delete(value) : values.add(value);
    url.searchParams.delete(key);
    values.forEach((v) => url.searchParams.append(key, v));
    router.push("?" + url.searchParams.toString());
  };

  const setSingle = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    router.push("?" + url.searchParams.toString());
  };

  return (
    <aside className="mb-8 space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* ALT KATEGORİLER */}
        {subcategories.length > 0 && (
          <AccordionItem title="Alt Kategoriler">
            <div className="space-y-3">
              {subcategories.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <CustomCheckbox
                    checked={params.getAll("category").includes(c.id)}
                    onChange={() => toggleMulti("category", c.id)}
                    id={`category-${c.id}`}
                  />
                  <label htmlFor={`category-${c.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                    {c.name}
                    {c._count?.products ? (
                      <span className="text-gray-500 ml-1">({c._count.products})</span>
                    ) : ""}
                  </label>
                </div>
              ))}
            </div>
          </AccordionItem>
        )}

        {/* MARKALAR */}
        {brands.length > 0 && (
          <AccordionItem title="Markalar">
            <div className="space-y-3">
              {brands.map((b) => (
                <div key={b.slug} className="flex items-center gap-3">
                  <CustomCheckbox
                    checked={params.getAll("brand").includes(b.slug)}
                    onChange={() => toggleMulti("brand", b.slug)}
                    id={`brand-${b.slug}`}
                  />
                  <label htmlFor={`brand-${b.slug}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                    {b.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionItem>
        )}

        {/* FİYAT ARALIĞI SLIDER */}
        <AccordionItem title="Fiyat Aralığı">
          <div className="space-y-4">
            <CustomSlider
              defaultValue={[
                Number(params.get("minPrice") ?? 0),
                Number(params.get("maxPrice") ?? 10000),
              ]}
              min={0}
              max={10000}
              step={10}
              onValueCommit={(values) => {
                setSingle("minPrice", String(values[0]));
                setSingle("maxPrice", String(values[1]));
              }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{params.get("minPrice") ?? 0} TL</span>
              <span>{params.get("maxPrice") ?? 10000} TL</span>
            </div>
          </div>
        </AccordionItem>

        {/* ATTRIBUTE GRUPLARI */}
        {attributeGroups.length > 0 && (
          attributeGroups.map((g) => (
            <AccordionItem title={g.name} key={g.id}>
              <div className="space-y-3">
                {g.attributes.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <CustomCheckbox
                      checked={params.getAll("attribute").includes(a.id)}
                      onChange={() => toggleMulti("attribute", a.id)}
                      id={`attr-${a.id}`}
                    />
                    <label htmlFor={`attr-${a.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                      {a.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionItem>
          ))
        )}
      </div>

      {/* AYIRICI ÇİZGİ */}
      <hr className="border-gray-200" />

      {/* RESET BUTONU */}
      <CustomButton 
        variant="outline" 
        onClick={() => router.push(window.location.pathname)} 
        className="w-full"
      >
        Filtreleri Temizle
      </CustomButton>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          position: relative;
          z-index: 2;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </aside>
  );
}