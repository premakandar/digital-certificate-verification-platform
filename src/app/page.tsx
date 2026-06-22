import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, FileCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="section min-h-[80vh] flex flex-col items-center justify-center py-12 md:py-20 rounded-[16px] md:rounded-[32px] border-4 border-border-default shadow-sticker mb-8 md:mb-20 mt-3 md:mt-6">
      <div className="section-content flex flex-col items-center text-center space-y-8 md:space-y-12 w-full px-4 md:px-8">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-[36px] sm:text-[52px] md:text-[72px] font-extrabold tracking-tight text-balance leading-none">
            Decentralized Digital Certificate Verification
          </h1>
          <p className="text-[18px] md:text-[22px] text-body-subtle text-balance max-w-[70ch] mx-auto leading-relaxed">
            Issue, verify, and revoke digital certificates securely using Soroban smart contracts on the Stellar network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/app" className={buttonVariants({ size: "lg" })}>
            Go to App
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            View Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 md:mt-16 max-w-6xl w-full">
          <div className="card-stack bg-panel border-4 border-border-default p-8 aspect-[4/3] flex flex-col items-center justify-center">
            <div className="card-stack-layer-1"></div>
            <div className="card-stack-layer-2"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <ShieldCheck className="h-16 w-16 text-brand mb-6" />
              <h3 className="text-[28px] font-heading font-medium mb-3">Tamper-Proof</h3>
              <p className="text-body-subtle text-[16px]">
                All certificates are permanently recorded on the Stellar blockchain, ensuring authenticity.
              </p>
            </div>
          </div>

          <div className="card-stack bg-panel border-4 border-border-default p-8 aspect-[4/3] flex flex-col items-center justify-center">
            <div className="card-stack-layer-1"></div>
            <div className="card-stack-layer-2"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <FileCheck className="h-16 w-16 text-brand mb-6" />
              <h3 className="text-[28px] font-heading font-medium mb-3">Instant Verification</h3>
              <p className="text-body-subtle text-[16px]">
                Verify any certificate instantly using its unique cryptographic hash without third-party reliance.
              </p>
            </div>
          </div>

          <div className="card-stack bg-panel border-4 border-border-default p-8 aspect-[4/3] flex flex-col items-center justify-center">
            <div className="card-stack-layer-1"></div>
            <div className="card-stack-layer-2"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <Users className="h-16 w-16 text-brand mb-6" />
              <h3 className="text-[28px] font-heading font-medium mb-3">Admin Control</h3>
              <p className="text-body-subtle text-[16px]">
                Authorized admins can easily issue new certificates and revoke invalid ones securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
