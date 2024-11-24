import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Button } from "../ui/button";

type CategoryDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  formState: { category: string; errors: { category: string } };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  dialogOpen,
  setDialogOpen,
  formState,
  handleInputChange,
  handleSave,
  onKeyPress,
}) => (
  <>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Button variant="outline" onClick={() => setDialogOpen(true)}>
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="dark:text-[#F4F6FF]">
            Create a new category
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-10 overflow-x-auto">
              <div className="space-y-2">
                <label className="relative flex flex-col-reverse group">
                  <input
                    type="text"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    onKeyDown={onKeyPress}
                    required
                    className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                  />
                  <span
                    className={`absolute leading-10 transition transform left-4 ${
                      formState.category ? "-translate-y-8 text-gray-500" : ""
                    } group-focus-within:-translate-y-8 group-focus-within:text-gray-500`}
                  >
                    Category Name
                  </span>
                </label>
                {formState.errors.category && (
                  <p className="mt-1 text-sm text-red-500">
                    {formState.errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 right-0 flex justify-end px-8 py-8">
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                className="bg-[#213899] text-white hover:text-[#47505B]"
              >
                Save
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </>
);

export default CategoryDialog;
