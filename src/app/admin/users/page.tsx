import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      createdAt: true,
      email: true,
      emailVerified: true,
      id: true,
      marketingOptIn: true,
      name: true,
      role: true,
    },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#2B2B2B]">Customers</h1>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#F0D3DA] bg-white shadow-sm">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#F0D3DA] bg-[#FDF2F5]/80 text-xs font-semibold uppercase tracking-wider text-[#6E6E6E]">
              <th className="whitespace-nowrap px-4 py-3">Name</th>
              <th className="whitespace-nowrap px-4 py-3">Email</th>
              <th className="whitespace-nowrap px-4 py-3">Role</th>
              <th className="whitespace-nowrap px-4 py-3">Verified</th>
              <th className="whitespace-nowrap px-4 py-3">Marketing</th>
              <th className="whitespace-nowrap px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0D3DA]">
            {users.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-[#6E6E6E]" colSpan={6}>
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr className="hover:bg-[#FDF2F5]/40" key={user.id}>
                  <td className="max-w-[180px] truncate px-4 py-3 font-medium text-[#2B2B2B]">
                    {user.name ?? "—"}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3 text-[#57534e]">{user.email ?? "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-[#FDF2F5] px-2.5 py-1 text-xs font-semibold text-[#2B2B2B] ring-1 ring-[#F0D3DA]">
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#57534e]">
                    {user.emailVerified ? "Yes" : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#57534e]">{user.marketingOptIn ? "Yes" : "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[#57534e]">
                    {user.createdAt.toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
