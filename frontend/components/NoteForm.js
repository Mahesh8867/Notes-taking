"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NoteForm() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your note here...</p>",
    immediatelyRender: false, // ✅ Fix hydration mismatch
  });

  const mutation = useMutation({
    mutationFn: (newNote) => api.post("/notes/", newNote),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      setTitle("");
      editor?.commands.setContent("<p></p>");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      note_title: title,
      note_content: editor?.getHTML() || "",
    });
  };

  if (!isClient) return null; // Don’t render until client-side

  return (
    <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="border p-2 w-full mb-2"
      />

      <div className="border p-2 rounded mb-2">
        <EditorContent editor={editor} />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
