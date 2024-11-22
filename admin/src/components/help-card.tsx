import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const HelpCard: React.FC = () => {
  return (
    <div className="mt-auto">
      <Card className="flex flex-col items-center justify-center w-full">
        <CardHeader className="flex flex-col items-center w-full justify-normal">
          <Icon
            icon="material-symbols:help-outline"
            width="30"
            height="30"
            className="text-center text-primary"
          />
          <CardTitle className="text-lg text-center bg-gradient-text text-gradient-text bg-clip-text">
            Need Help ?
          </CardTitle>
          <CardDescription className="text-center">
            We’re readily available to provide help{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="https://www.infineon.com/cms/en/about-infineon/company/contacts/"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="lg" className="" variant={"outline"}>
              Get help
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCard;
