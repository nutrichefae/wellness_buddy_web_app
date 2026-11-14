"use client";

import { useMemo } from "react";
import { checkArray } from "@/lib/formatter";
import { availabilityOptionValue } from "@/lib/availability";
import { useAssignableClientCategories } from "@/hooks/useAssignableClientCategories";

export function useAvailabilityOptions() {
  const client_categories = useAssignableClientCategories();

  return useMemo(
    () => [
      { id: 1, name: "All Client", value: "client" },
      { id: 2, name: "Coach / App Coach", value: "coach" },
      ...checkArray(client_categories).map((category, index) => ({
        id: index + 3,
        name: category.name,
        value: availabilityOptionValue(category.name),
      })),
    ],
    [client_categories]
  );
}
