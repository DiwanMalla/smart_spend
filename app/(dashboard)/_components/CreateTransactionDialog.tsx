"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "@/schema/transaction";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateTransaction } from "../_actions/transactions";
import { CreateCategorySchemaType } from "@/schema/categories";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });
  const [open, setOpen] = useState(false);
  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success(`Transaction created succesfully 🎉`, {
        id: "create-transaction",
      });
      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      //After creating a transaction, we need to invalidate the overview query which will refetch data in the homepage
      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });
      setOpen((prev) => !prev);
    },
  });
  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Creating transaction...", {
        id: "create-transaction",
      });

      mutate({
        ...values,
        date: DateToUTCDate(values.date), // Ensuring the date is properly formatted
      });
    },
    [mutate]
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create a new{" "}
            <span
              className={`m-1 ${
                type === "income" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {type}
            </span>
            transaction
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Transaction description </FormDescription>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction amount (requried){" "}
                  </FormDescription>
                </FormItem>
              )}
            />
            Transaction :{form.watch("category")}
            <div className="flex items-center justify-between gap-2 mt-3">
              {" "}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Select a category for this transaction{" "}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-[200px] pl-3 text-left font-normal ${
                            !field.value && `text-muted-foreground`
                          }`}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return;
                            field.onChange(value);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for this transaction{" "}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
              onClick={() => {
                form.reset();
              }}
            >
              Close
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>{" "}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
