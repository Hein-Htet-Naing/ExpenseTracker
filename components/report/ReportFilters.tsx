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
import { CategoriesResponse } from "@/types/category";
interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFilterChange: (filters: ReportFiltersType) => void;
  reportType?: "all" | "income" | "expenses";
  onReportTypeChange?: (type: "all" | "income" | "expenses") => void;
  onReset: () => void;
}
export const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const { data: categories } = useCategories<CategoriesResponse>();
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
  const handleIncomeCategory = (IcategoryId: string, checked: boolean) => {
    const currentCatgId = filters.IcategoryIds || [];
    const newCatgId = checked
      ? [...currentCatgId, IcategoryId]
      : currentCatgId.filter((id) => id !== IcategoryId);
    onFilterChange({
      ...filters,
      IcategoryIds: newCatgId.length > 0 ? newCatgId : undefined,
    });
  };

  const handleAllCategories = () => {
    onFilterChange({
      ...filters,
      categoryIds: categories?.expenseCategories?.map((cat) => cat._id),
      IcategoryIds: categories?.incomeCategories?.map((cat) => cat._id),
    });
  };
  const handleClearAllCategories = () => {
    onFilterChange({
      ...filters,
      categoryIds: [],
      IcategoryIds: [],
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Report Filters</CardTitle>
        <CardDescription>
          Filter your financial data to generate specific reports
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4">
        <div className="space-y-6 md:w-1/3">
          {/* Date Range */}
          <div>
            <h4 className="text-base font-medium text-center md:text-start">
              Date Range
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
              Amount Range
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

        <div className="space-y-6 md:w-2/3">
          <div className="flex items-center justify-between w-full mb-4">
            <h4 className="text-base text-center lg:text-lg font-medium">
              Categoires
            </h4>

            <div className="flex flex-col md:flex-row gap-1 mx-auto">
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
          <div className="space-x-8 flex flex-col w-full lg:flex-row">
            <div>
              <h4 className="text-base font-medium mb-3">Expense Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto scrollbar-w-2">
                {categories?.expenseCategories?.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center justify-start gap-2"
                  >
                    <Input
                      type="checkbox"
                      className="rounded w-4 h-4 border-gray-300"
                      checked={filters.categoryIds?.includes(cat._id) || false}
                      onChange={(e) =>
                        handleCategoryChange(cat._id, e.target.checked)
                      }
                    ></Input>
                    <span className="">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base font-medium mb-3">Income Category</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto scrollbar-w-2">
                {categories?.incomeCategories?.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center justify-start gap-2"
                  >
                    <Input
                      type="checkbox"
                      className="rounded w-4 h-4 border-gray-300"
                      checked={filters.IcategoryIds?.includes(cat._id) || false}
                      onChange={(e) =>
                        handleIncomeCategory(cat._id, e.target.checked)
                      }
                    ></Input>
                    <span className="">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
