"use client";
import { CurrencyComBox } from "@/components/CurrencyComBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrendingDown, TrendingUp } from "lucide-react";

import React from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const page = () => {
  return (
    <>
      {/*header*/}
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 p-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>
      {/*END HEADER*/}
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default page;
const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;
  return (
    <div>
      {type}
      <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {type === "expense" ? (
                  <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
                ) : (
                  <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 text-emerald-500" />
                )}
                <div>
                  {type === "income" ? "Incomes" : "Expenses"} categories{" "}
                  <div className="text-sm text-muted-foreground">
                    Sorted by name
                  </div>
                </div>
              </div>

              <CreateCategoryDialog
                type={type}
                successCallback={() => categoriesQuery.refetch()}
                trigger={
                  <Button className="gap-2 text-sm">
                    <PlusSquare className="h-4 w-4" />
                    Create category
                  </Button>
                }
              />
            </CardTitle>
          </CardHeader>
          <Separator />
          {!dataAvailable && (
            <div className="flex h-40 w-full flex-col items-center">
              <p>
                No{" "}
                <span
                  className={`m-1 ${
                    type === "income" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {type}
                </span>{" "}
                categories yet
              </p>
            </div>
          )}
          {dataAvailable && <div>Yes</div>}
        </Card>
      </SkeletonWrapper>
    </div>
  );
};
