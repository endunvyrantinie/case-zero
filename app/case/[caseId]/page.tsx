import { notFound } from "next/navigation";
import Game from "@/components/Game";
import { getCase } from "@/lib/cases";

export default async function CasePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const caseData = getCase(caseId);
  if (!caseData) notFound();
  return <Game caseData={caseData} />;
}
