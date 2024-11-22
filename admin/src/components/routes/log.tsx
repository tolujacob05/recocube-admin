import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const Log = () => {
  return (
    <>
      <div className="flex justify-between w-full gap-6 pt-20 md:gap-0">
        <form>
          <div className="relative flex w-full gap-2 md:gap-20">
            <Input
              type="search"
              placeholder="Search..."
              className="relative pl-3 shadow-none appearance-none w-96 bg-background"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground md:hidden" />
            <Button variant="outline" className="hidden md:flex">
              Search
            </Button>
          </div>
        </form>

        <Button variant="outline" className="">
          Create Category
        </Button>
      </div>

      <div className="w-full mt-4 overflow-x-auto md:overflow-x-visible">
        <Table className="">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className="text-[#121F3E]">
              <TableHead className="w-[100px]">S/N</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice} className="text-[#576378]">
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>

                <TableCell className="flex items-center justify-center gap-4">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <Icon
                        icon="mage:edit-pen"
                        className="w-5 h-5 font-bold text-[#121F3E]"
                      />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Inventory stock entry</DialogTitle>
                        <DialogDescription>
                          <div className="space-y-10 overflow-x-auto">
                            <label className="relative flex flex-col-reverse group">
                              <input
                                type="email"
                                name="email"
                                required
                                className="px-4 py-3 leading-9 border-2 border-[#F2F2F2] rounded-md h-10 w-full"
                              />
                              <span className="absolute leading-10 transition transform left-4 group-focus-within:-translate-y-8">
                                Product/service name
                              </span>
                              <span className="ml-auto leading-10 text-red-500">
                                * Required
                              </span>
                            </label>
                          </div>

                          <div className="flex justify-end py-8">
                            <Button variant="ghost" className="">
                              cancel
                            </Button>
                            <Button
                              variant="secondary"
                              className="bg-[#213899] text-white hover:text-[#2E2F30]"
                            >
                              Save
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>

                  <Icon
                    icon="mage:trash-3"
                    className="w-5 h-5 font-bold text-[#121F3E]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Log;
