import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <div className="max-w-6xl mx-auto my-8">
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}
