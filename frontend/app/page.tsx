"use client";
import { useRouter } from "next/navigation";
import useAuthStore from "../store/authStore";
import useHydrated from "../hooks/useHydrated";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

export default function HomePage() {
  const hydrated = useHydrated();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  if (!hydrated) return null; // wait for client hydration

  if (!isAuthenticated()) {
    router.replace("/login"); // send to login if not authenticated
    return null;
  }

  const handleLogout = () => {
    logout(); // clear auth store + localStorage
    router.replace("/login"); // redirect to login
  };

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Notes UI */}
      <NoteForm />
      <NoteList />
    </main>
  );
}
