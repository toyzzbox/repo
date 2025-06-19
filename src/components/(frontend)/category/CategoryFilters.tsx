"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface AttributeGroup {
  id: string;
  name: string;
  attributes: {
    id: string;
    name: string;
  }[];
}

interface Props {
  groups: AttributeGroup[];
}

export default function CategoryFilters({ groups }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentParams = new URLSearchParams(searchParams.toString());
  const selectedAttributes = searchParams.getAll("attribute");

  const toggleAttribute = (groupName: string, attrName: string) => {
    const key = `${groupName}:${attrName}`;
    const newParams = new URLSearchParams(currentParams.toString());

    const values = newParams.getAll("attribute").filter((a) => a !== key);
    const alreadySelected = selectedAttributes.includes(key);
    if (!alreadySelected) values.push(key);

    newParams.delete("attribute");
    values.forEach((v) => newParams.append("attribute", v));

    startTransition(() => {
      router.push("?" + newParams.toString());
    });
  };

  return (
    <aside className="space-y-6">
      {groups.map((group) => (
        <div key={group.id}>
          <h3 className="font-semibold mb-2">{group.name}</h3>
          <div className="space-y-1">
            {group.attributes.map((attr) => {
              const key = `${group.name}:${attr.name}`;
              const isChecked = selectedAttributes.includes(key);
              return (
                <label key={attr.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAttribute(group.name, attr.name)}
                  />
                  <span>{attr.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </aside>
  );
}
