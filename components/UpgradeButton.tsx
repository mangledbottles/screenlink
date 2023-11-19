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

export function UpgradeButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Upgrade</Button>
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
            className="mt-16 bg-gradient-to-b from-slate-100"
            pricing-table-id={process.env.NEXT_PUBLIC_STRIPE_PRICING_TABLE_ID}
            publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
            // client-reference-id={clientReferenceId}
            // customer-email={email}
          ></stripe-pricing-table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
