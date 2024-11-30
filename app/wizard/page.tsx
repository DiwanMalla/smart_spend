import { CurrencyComBox } from "@/components/CurrencyComBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center gap-6 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">
          Welcome, <span>{user.firstName} 👋</span>
        </h1>
        <h2 className="mt-2 text-lg text-gray-700">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-1 text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator className="my-4" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Currency</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <CurrencyComBox />
        </CardContent>
      </Card>
      <Separator className="my-4" />
      <Button className="w-full h-12 text-lg font-medium" asChild>
        <Link href={"/"}>I&apos;m done! Take me to the dashboard</Link>
      </Button>
      <div className="mt-10">
        <Logo />
      </div>
    </div>
  );
};

export default page;
