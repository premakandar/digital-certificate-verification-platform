"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { issueCertificate, revokeCertificate, verifyCertificate } from "@/lib/contract";
import { Loader2, ShieldCheck, ShieldAlert, FileSearch } from "lucide-react";
import { useWalletStore } from "@/store/wallet";

export default function AppPage() {
  const { address } = useWalletStore();
  const [loading, setLoading] = useState(false);

  // Issue State
  const [issueHash, setIssueHash] = useState("");
  const [issueRecipient, setIssueRecipient] = useState("");

  // Revoke State
  const [revokeHash, setRevokeHash] = useState("");

  // Verify State
  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const handleIssue = async () => {
    if (!address) return toast.error("Please connect wallet first");
    if (!issueHash || !issueRecipient) return toast.error("Fill in all fields");

    setLoading(true);
    try {
      const txHash = await issueCertificate(issueHash, issueRecipient);
      toast.success("Certificate issued successfully!", {
        description: `Tx: ${txHash.slice(0, 8)}...${txHash.slice(-8)}`,
      });
      setIssueHash("");
      setIssueRecipient("");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to issue certificate", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!address) return toast.error("Please connect wallet first");
    if (!revokeHash) return toast.error("Please provide certificate hash");

    setLoading(true);
    try {
      const txHash = await revokeCertificate(revokeHash);
      toast.success("Certificate revoked successfully!", {
        description: `Tx: ${txHash.slice(0, 8)}...${txHash.slice(-8)}`,
      });
      setRevokeHash("");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to revoke certificate", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyHash) return toast.error("Please provide certificate hash");

    setLoading(true);
    setVerificationResult(null);
    try {
      const isValid = await verifyCertificate(verifyHash);
      setVerificationResult(isValid);
      if (isValid) {
        toast.success("Certificate is valid!");
      } else {
        toast.error("Certificate is invalid or does not exist.");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Verification error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section min-h-[80vh] rounded-[16px] md:rounded-[32px] border-4 border-border-default shadow-sticker mb-8 md:mb-20 mt-3 md:mt-6">
      <div className="section-content max-w-2xl mx-auto space-y-8 p-4 md:p-8 py-8 md:py-12">
        <div className="space-y-4 text-center">
          <h1 className="text-[36px] md:text-[44px] font-heading font-extrabold tracking-tight">Certificate Management</h1>
          <p className="text-[18px] text-body-subtle">Issue, verify, and revoke digital certificates securely.</p>
        </div>

        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="flex w-full bg-panel border-2 border-border-default shadow-sticker-sm rounded-xl p-1.5 gap-1 mb-8">
            <TabsTrigger value="verify" className="flex-1">Verify</TabsTrigger>
            <TabsTrigger value="issue" className="flex-1">Issue (Authorized)</TabsTrigger>
            <TabsTrigger value="revoke" className="flex-1">Revoke (Issuer)</TabsTrigger>
          </TabsList>

          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verify Certificate</CardTitle>
                <CardDescription>Check if a digital certificate is authentic and valid.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verifyHash">Certificate Hash</Label>
                  <Input 
                    id="verifyHash" 
                    placeholder="e.g. 0xabcdef..." 
                    value={verifyHash}
                    onChange={(e) => setVerifyHash(e.target.value)}
                  />
                </div>

                {verificationResult !== null && !loading && (
                  <div className={`p-4 rounded-lg flex items-center gap-4 border ${verificationResult ? 'bg-success-soft border-success/50 text-success' : 'bg-danger-soft border-danger/50 text-danger'}`}>
                    {verificationResult ? <ShieldCheck className="h-6 w-6 shrink-0" /> : <ShieldAlert className="h-6 w-6 shrink-0" />}
                    <div>
                      <p className="font-semibold">{verificationResult ? 'Valid Certificate' : 'Invalid Certificate'}</p>
                      <p className="text-sm opacity-90">
                        {verificationResult 
                          ? 'This certificate is authentic and has not been revoked.' 
                          : 'This certificate does not exist or has been revoked by the issuer.'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleVerify} disabled={loading || !verifyHash} className="w-full">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSearch className="mr-2 h-4 w-4" />}
                  Verify Now
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="issue">
            <Card>
              <CardHeader>
                <CardTitle>Issue Certificate</CardTitle>
                <CardDescription>Issue a new digital certificate to a recipient. Requires Admin privileges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueHash">Certificate Hash</Label>
                  <Input 
                    id="issueHash" 
                    placeholder="e.g. 0xabcdef..." 
                    value={issueHash}
                    onChange={(e) => setIssueHash(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueRecipient">Recipient Address</Label>
                  <Input 
                    id="issueRecipient" 
                    placeholder="G..." 
                    value={issueRecipient}
                    onChange={(e) => setIssueRecipient(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleIssue} disabled={loading || !issueHash || !issueRecipient || !address} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Issue Certificate
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="revoke">
            <Card>
              <CardHeader>
                <CardTitle>Revoke Certificate</CardTitle>
                <CardDescription>Revoke an existing digital certificate. Requires Admin privileges.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revokeHash">Certificate Hash</Label>
                  <Input 
                    id="revokeHash" 
                    placeholder="e.g. 0xabcdef..." 
                    value={revokeHash}
                    onChange={(e) => setRevokeHash(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={handleRevoke} disabled={loading || !revokeHash || !address} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Revoke Certificate
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

