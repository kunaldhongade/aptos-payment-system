import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import { WalletSelector } from "@/components/WalletSelector";
import { buttonVariants } from "@/components/ui/button";

interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between py-2 px-4 mx-auto w-full max-w-screen-xl flex-wrap">
      <h2 className="display">{title}</h2>

      <div className="flex gap-2 items-center">
        <Link className={buttonVariants({ variant: "link" })} to={"/"}>
          Home
        </Link>
        {location.pathname === "/view-payments" ? (
          <Link className={buttonVariants({ variant: "link" })} to={"/make-payments"}>
            Make Payments
          </Link>
        ) : (
          <Link className={buttonVariants({ variant: "link" })} to={"/view-payments"}>
            View
          </Link>
        )}

        <WalletSelector />
      </div>
    </div>
  );
};
