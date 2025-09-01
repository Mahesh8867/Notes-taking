"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function NoteList() {
  const queryClient = useQueryClient();
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isClient, setIsClient] = useState(false);

  // prevent SSR hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch Notes
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await api.get("/notes/");
      return res.data;
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (note_id) => api.delete(`/notes/${note_id}/`),
    onSuccess: () => queryClient.invalidateQueries(["notes"]),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedNote }) => api.put(`/notes/${id}/`, updatedNote),
    onSuccess: () => {
      queryClient.invalidateQueries(["notes"]);
      setEditingNote(null);
    },
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note.note_id);
    setEditTitle(note.note_title);
    // Preload editor content for this note
    editor?.commands.setContent(note.note_content || "<p></p>");
  };

  // Rich Text Editor for editing
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    immediatelyRender: false,
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: editingNote,
      updatedNote: {
        note_title: editTitle,
        note_content: editor?.getHTML() || "",
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching notes</p>;
  if (!isClient) return null;

  return (
    <ul>
      {data.map((note) => (
        <li key={note.note_id} className="border p-2 my-2 rounded">
          {editingNote === note.note_id ? (
            <form onSubmit={handleUpdate} className="mb-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border p-2 w-full mb-2"
              />

              <div className="border p-2 rounded mb-2">
                <EditorContent editor={editor} />
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-1 mr-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2 className="font-bold">{note.note_title}</h2>
              {/* Render saved HTML content safely */}
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: note.note_content }}
              />
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.note_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
