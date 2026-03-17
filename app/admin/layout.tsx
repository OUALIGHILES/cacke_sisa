import AdminSidebar from "@/components/admin-sidebar"

export const metadata = {
  title: "Admin Dashboard | SISA_Cake",
  description: "Manage your bakery website",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
