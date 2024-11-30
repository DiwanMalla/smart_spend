import { ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonWrapper = ({
  children,
  isLoading,
  fullWidth = true,
}: {
  children: ReactNode;
  isLoading: boolean;
  fullWidth?: boolean;
}) => {
  if (!isLoading) return children;

  return (
    <Skeleton className={fullWidth ? "w-full" : ""}>
      <div className="opacity-10">{children}</div>
    </Skeleton>
  );
};

export default SkeletonWrapper;
