"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { UserPlus, Upload, Search, Mail } from "lucide-react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();

      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      alert("Contact deleted successfully");

      fetchContacts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(
        filteredContacts.map((contact) => contact._id)
      );
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (
    id: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedContacts((prev) => [...prev, id]);
    } else {
      setSelectedContacts((prev) =>
        prev.filter((contactId) => contactId !== id)
      );
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedContacts.length) return;

    const confirmed = window.confirm(
      `Delete ${selectedContacts.length} contacts?`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(
        "/api/contacts/bulk-delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedContacts,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSelectedContacts([]);
      fetchContacts();
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Contacts Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your subscriber lists and audience segments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/contacts/import">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import CSV
              </Button>
            </Link>

            <Link href="/contacts/create">
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add Contact
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 w-full max-w-md text-sm">
            <Search className="w-4 h-4 text-slate-400" />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="text-sm text-slate-500">
            Total Contacts: {contacts.length}
          </div>
        </div>

        {selectedContacts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              {selectedContacts.length} contacts selected
            </span>

            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredContacts.length > 0 &&
                      selectedContacts.length ===
                        filteredContacts.length
                    }
                    onChange={(e) =>
                      handleSelectAll(e.target.checked)
                    }
                  />
                </th>
                <th className="py-3.5 px-6">Contact Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date Added</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {loading && (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    Loading contacts...
                  </td>
                </tr>
              )}

              {!loading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No contacts found.
                  </td>
                </tr>
              )}

              {!loading &&
                filteredContacts.map((contact: any) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(
                          contact._id
                        )}
                        onChange={(e) =>
                          handleSelectContact(
                            contact._id,
                            e.target.checked
                          )
                        }
                      />
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">
                        {contact.name}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {contact.email}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        Active
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {contact.createdAt
                        ? new Date(contact.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/contacts/${contact._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-lg"
                        >
                          View
                        </Link>

                        <Link
                          href={`/contacts/edit/${contact._id}`}
                          className="text-amber-600 hover:text-amber-800 font-medium text-xs bg-amber-50 px-3 py-1.5 rounded-lg"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-3 py-1.5 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}