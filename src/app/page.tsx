import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, FileCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-balance">
          Decentralized Digital Certificate Verification
        </h1>
        <p className="text-xl text-muted-foreground text-balance">
          Issue, verify, and revoke digital certificates securely using Soroban smart contracts on the Stellar network.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/app" className={buttonVariants({ size: "lg" })}>
          Go to App
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg" })}>
          View Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl">
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <ShieldCheck className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Tamper-Proof</h3>
          <p className="text-muted-foreground">
            All certificates are permanently recorded on the Stellar blockchain, ensuring authenticity.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <FileCheck className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Instant Verification</h3>
          <p className="text-muted-foreground">
            Verify any certificate instantly using its unique cryptographic hash without third-party reliance.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-card rounded-xl border shadow-sm">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Admin Control</h3>
          <p className="text-muted-foreground">
            Authorized admins can easily issue new certificates and revoke invalid ones securely.
          </p>
        </div>
      </div>
    </div>
  );
}
