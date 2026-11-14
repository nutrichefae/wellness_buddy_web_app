"use client";

import { useMemo } from "react";
import { assignableClientCategories } from "@/lib/assignableCategories";
import { useAppSelector } from "@/providers/global/hooks";

export function useAssignableClientCategories() {
  const clubType = useAppSelector((state) => state.coach?.data?.clubType);
  const client_categories =
    useAppSelector((state) => state.coach?.data?.client_categories) || [];

  return useMemo(
    () => assignableClientCategories(client_categories, clubType),
    [client_categories, clubType]
  );
}
