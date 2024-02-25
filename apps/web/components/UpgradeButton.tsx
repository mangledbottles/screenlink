import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LightningBoltIcon } from "@radix-ui/react-icons";

export function UpgradeButton({
  clientReferenceId,
  email,
  plan,
}: {
  clientReferenceId: string;
  email: string;
  plan: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 bg-slate-700 text-white hover:bg-slate-500 border border-transparent hover:border-slate-500">
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-dark-tremor-background opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-60"></span>
          <LightningBoltIcon className="h-4 w-4" />
          <span>Upgrade to {plan === "pro" ? "Growth" : "Pro"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-md w-screen">
        <DialogHeader>
          <DialogTitle>Upgrade your account</DialogTitle>
          <DialogDescription>
            Get access to more uploads and features!
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <stripe-pricing-table
            className="mt-16 bg-slate-800 rounded-lg"
            pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            client-reference-id={clientReferenceId}
            customer-email={email}
          ></stripe-pricing-table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
