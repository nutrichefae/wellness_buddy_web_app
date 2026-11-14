import FormControl from "@/components/FormControl";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { sendData } from "@/lib/api";
import { isSystemLeaderClubType } from "@/lib/assignableCategories";
import { useAssignableClientCategories } from "@/hooks/useAssignableClientCategories";
import { useAppSelector } from "@/providers/global/hooks";
import { Pen } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function ClientUpdateCategories({
  clientData,
  open,
  onClose,
  children
}) {
  const clubType = useAppSelector((state) => state.coach?.data?.clubType);
  const assignable = useAssignableClientCategories();
  const isSystemLeader = isSystemLeaderClubType(clubType);

  const { categories: clientCategories } = clientData;
  const set = new Set((clientCategories || []).map(String));

  const categories = useMemo(() => {
    const map = new Map();
    for (const category of assignable) {
      map.set(String(category._id), category.name);
    }
    return map;
  }, [assignable]);

  const notSelectedCategories = Array.from(categories)
    .filter(([categoryId]) => !set.has(categoryId));
  const selectedCategories = Array.from(categories)
    .filter(([categoryId]) => set.has(categoryId));

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientIds: [clientData._id],
    categoryIds: selectedCategories.map(category => category[0]),
    removeCategoryIds: []
  });

  const q = query.trim().toLowerCase();
  const visibleSelected = selectedCategories.filter(([, name]) =>
    !q || String(name).toLowerCase().includes(q)
  );
  const visibleUnselected = notSelectedCategories.filter(([, name]) =>
    !q || String(name).toLowerCase().includes(q)
  );
  const hasAny = categories.size > 0;
  const hasVisible = visibleSelected.length + visibleUnselected.length > 0;

  async function udpateCategories() {
    try {
      setLoading(true);
      const response = await sendData("app/categories/client", formData);
      if (response.status_code !== 200) throw new Error(response.message);
      toast.success(response.message);
      location.reload()
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  function selectClientId(id) {
    setFormData(prev => !formData.categoryIds.includes(id)
      ? ({
        ...prev,
        categoryIds: [...prev.categoryIds, id],
        removeCategoryIds: prev.removeCategoryIds.filter(item => item !== id)
      })
      : {
        ...prev,
        categoryIds: prev.categoryIds.filter(item => item !== id),
        removeCategoryIds: [...prev.removeCategoryIds, id]
      })
  }

  return <Dialog defaultOpen={open} onOpenChange={onClose}>
    {children}
    {!children && <DialogTrigger>
      <Pen className="w-[16px] h-[16px]" />
    </DialogTrigger>}
    <DialogContent className="gap-0 p-0">
      <DialogTitle className="p-4 border-b-1">Categories</DialogTitle>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-3">
          {isSystemLeader
            ? "You can assign membership and club-rank categories."
            : "Club ranks (System Leader, Club Leader, …) can only be assigned by a System Leader."}
        </p>
        {hasAny && (
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories"
            aria-label="Search categories"
            className="mb-3 h-11 bg-white"
          />
        )}
        {!hasAny && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No categories you can assign. Ask a System Leader if you need a membership tag added.
          </p>
        )}
        {hasAny && !hasVisible && (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No matches for “{query.trim()}”.
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </p>
        )}
        {visibleSelected.length > 0 && <>
          {visibleSelected.map(([categoryId, categoryName]) => <label
            key={categoryId}
            className="mb-2 min-h-11 flex items-center gap-4 cursor-pointer"
          >
            <p>{categoryName}</p>
            <FormControl
              className="ml-auto"
              type="checkbox"
              checked={formData.categoryIds.includes(categoryId)}
              onChange={() => selectClientId(categoryId)}
            />
          </label>)}
        </>}
        {visibleUnselected.length > 0 && <>
          {visibleUnselected.map(([categoryId, categoryName]) => <label
            key={categoryId}
            className="mb-2 min-h-11 flex items-center gap-4 cursor-pointer"
          >
            <p>{categoryName}</p>
            <FormControl
              className="ml-auto"
              type="checkbox"
              checked={formData.categoryIds.includes(categoryId)}
              onChange={() => selectClientId(categoryId)}
            />
          </label>)}
        </>}
        <Button
          variant="wz"
          className="mt-4 block mx-auto min-h-11"
          disabled={loading || !hasAny}
          onClick={udpateCategories}
        >
          Save
        </Button>
      </div>
    </DialogContent>
  </Dialog>
}
