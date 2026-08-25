import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  await connectDB();

  const contact = await Contact.findById(id).lean();

  if (!contact) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/contacts"
            className="px-3 py-2 border rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">
              {contact.name}
            </h1>

            <p className="text-slate-500">
              {contact.email}
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-semibold mb-4">
            Contact Details
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Name:</strong> {contact.name}
            </p>

            <p>
              <strong>Email:</strong> {contact.email}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {contact.status}
            </p>

            <p>
              <strong>Created:</strong>{" "}
              {new Date(
                contact.createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}