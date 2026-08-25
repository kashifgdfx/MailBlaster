"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

export default function EditContactPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "active",
  });

  useEffect(() => {
    const fetchContact = async () => {
      const res = await fetch(`/api/contacts`);
      const data = await res.json();

      const contact = data.find((c: any) => c._id === id);

      if (contact) {
        setFormData({
          name: contact.name,
          email: contact.email,
          status: contact.status || "active",
        });
      }

      setLoading(false);
    };

    fetchContact();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Contact updated successfully");

    router.push("/contacts");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200">
        <h1 className="text-xl font-bold mb-6">
          Edit Contact
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-2"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <Button type="submit">
            Update Contact
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}