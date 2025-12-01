"use client";
import { CategoryFormData } from "@/types/category";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { validateCategoreis } from "@/lib/validation";
import { Textarea } from "../ui/textarea";
const colorOptions = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
  { value: "#10b981", label: "Green" },
  { value: "#f59e0b", label: "Yellow" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
  { value: "#06b6d4", label: "Cyan" },
  { value: "#f97316", label: "Orange" },
  { value: "#64748b", label: "Gray" },
  { value: "#84cc16", label: "Lime" },
];

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  isEdit?: boolean;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  isEdit,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: "",
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: CategoryFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  //submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validateErrors = validateCategoreis(formData);

    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors);
    }
    //only run submit if no errors
    if (Object.keys(validateErrors).length === 0) {
      try {
        await onSubmit(formData);
      } catch (error: any) {
        setErrors({
          submit:
            error.response?.data?.message ||
            "Failed To Create Category. Please Try Againg!",
        });
      }
    }
  };

  return (
    <>
      {isLoading && <></>}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">
            {!isEdit ? "Create Category" : "Edit Category"}
          </CardTitle>
          <CardDescription>
            {!isEdit
              ? "Create a new category for your expenses"
              : "Edit category for your expense"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name*
              </label>
              <Input
                id="categoryName"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g., Food, Transportation, etc."
              />
              {errors.name && (
                <p className="text-sm text-destructive w-full">{errors.name}</p>
              )}
            </div>
            {/* color */}
            <div className="space-y-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color*
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <Button
                    key={color.label}
                    type="button"
                    value={formData.color || ""}
                    className={`text-black transition-all ${
                      formData.color === color.value
                        ? "border-foreground scale-90"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ background: color.value }}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                  >
                    {color.label}
                  </Button>
                ))}
              </div>
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="c_name" className="text-sm font-medium">
                Description*
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                placeholder="add a description for this category (optional)"
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="space-x-2">
              <Button type="submit" className="cursor-pointer">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEdit ? "Updating..." : "Adding..."}
                  </>
                ) : isEdit ? (
                  "Update Category"
                ) : (
                  "Creae Category"
                )}
              </Button>
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="sm:order-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};
