import { ReportFilters as ReportFiltersType } from "@/types/report";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useCategories } from "@/hooks/useCategories";
interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFilterChange: (filters: ReportFiltersType) => void;
  onReset: () => void;
}
export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { data: categories } = useCategories();
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const handleAmountChange = (
    field: "minAmount" | "maxAmount",
    value: string
  ) => {
    const numValue = parseFloat(value);
    onFilterChange({
      ...filters,
      [field]: numValue,
    });
  };
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategoriesId = filters.categoryIds || [];
    const newCategoriesId = checked
      ? [...currentCategoriesId, categoryId]
      : currentCategoriesId.filter((id) => id !== categoryId);
    onFilterChange({
      ...filters,
      categoryIds: newCategoriesId.length > 0 ? newCategoriesId : undefined,
    });
  };

  const handleAllCategories = () => {
    onFilterChange({
      ...filters,
      categoryIds: categories?.map((cat) => cat._id),
    });
  };
  const handleClearAllCategories = () => {
    onFilterChange({
      ...filters,
      categoryIds: [],
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Report Filters</CardTitle>
        <CardDescription>
          Filter your expense data to generate specific reports
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <div className="space-y-6 md:w-1/2">
          {/* Data Range */}
          <div>
            <h4 className="text-base font-medium text-center md:text-start">
              Data Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Start Date:
                </label>
                <input
                  id="startData"
                  name="startDate"
                  type="date"
                  onChange={(e) =>
                    handleDateChange("startDate", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  End Date:
                </label>
                <input
                  id="endData"
                  name="endDate"
                  type="date"
                  onChange={(e) => handleDateChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <h4 className="text-base font-medium mb-3 text-center md:text-start">
              Data Range
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Minimum Amount:
                </label>
                <input
                  id="minAmount"
                  name="minAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.01"
                  className="p-2 w-[50%]"
                  onChange={(e) =>
                    handleAmountChange("minAmount", e.target.value)
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="text-xs text-muted-foreground mb-1 block"
                >
                  Maximum Amount:
                </label>
                <input
                  id="maxAmount"
                  name="maxAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="p-2 w-[50%]"
                  onChange={(e) =>
                    handleAmountChange("maxAmount", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:w-1/2">
          <div className="flex items-center justify-between w-full mb-4">
            <h4 className="text-base text-center lg:text-lg font-medium">
              Categoires
            </h4>

            <div className="flex flex-col md:flex-row gap-1 mx-auto">
              {/* <Button type="submit" onClick={handleSubmit}>
                Filter
              </Button> */}
              <Button
                className="text-sm lg:text-base"
                type="button"
                onClick={handleAllCategories}
              >
                Select All
              </Button>
              <Button
                className="text-sm lg:text-base"
                type="button"
                onClick={handleClearAllCategories}
              >
                Clear All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto scrollbar-w-2">
            {categories?.map((cat) => (
              <label
                htmlFor=""
                key={cat._id}
                className="flex items-center justify-start gap-2"
              >
                <Input
                  type="checkbox"
                  className="rounded w-4 h-4 border-gray-300"
                  onChange={(e) =>
                    handleCategoryChange(cat._id, e.target.checked)
                  }
                ></Input>
                <span className="">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
