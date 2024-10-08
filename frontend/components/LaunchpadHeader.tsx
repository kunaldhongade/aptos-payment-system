import { Col, Grid, Row, Typography } from "antd"; // Imported Ant Design components
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

import { WalletSelector } from "@/components/WalletSelector";
import { buttonVariants } from "@/components/ui/button";

const { Title } = Typography; // Destructure Title from Typography
const { useBreakpoint } = Grid; // Antd's hook for responsive breakpoints

interface LaunchpadHeaderProps {
  title: string;
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({ title }) => {
  const location = useLocation();
  const screens = useBreakpoint(); // Get current screen size

  return (
    <Row align="middle" justify="space-between" className="py-2 px-4 mx-auto w-full max-w-screen-xl">
      <Col>
        {/* Responsive Title with Ant Design's Typography */}
        <Title level={screens.xs ? 3 : screens.sm ? 2 : 1} className="m-0">
          {title}
        </Title>
      </Col>

      <Col>
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
      </Col>
    </Row>
  );
};
