"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { cn } from "@/lib/utils";
import {
    Bold, Italic, List, ListOrdered,
    Heading1, Heading2, Quote, Undo, Redo,
    Image as ImageIcon, Link as LinkIcon,
    Table as TableIcon
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Write something amazing...',
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        immediatelyRender: false, // Fix for SSR hydration mismatch
        content: value,

        editorProps: {
            attributes: {
                class: 'min-h-[200px] p-4 focus:outline-none prose prose-slate max-w-none',
            },
        },
        onUpdate: ({ editor }: { editor: any }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync editor content when value prop changes externally (e.g. async fetch)
    useEffect(() => {
        if (editor && value && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const ToolbarButton = ({ icon: Icon, onClick, active = false, label }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "p-2 rounded hover:bg-slate-100 transition-colors text-slate-600",
                active && "bg-slate-200 text-slate-900"
            )}
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
                <ToolbarButton
                    icon={Bold}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    label="Bold"
                />
                <ToolbarButton
                    icon={Italic}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    label="Italic"
                />
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <ToolbarButton
                    icon={Heading1}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    label="Heading 2"
                />
                <ToolbarButton
                    icon={Heading2}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    label="Heading 3"
                />
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <ToolbarButton
                    icon={List}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    label="Bullet List"
                />
                <ToolbarButton
                    icon={ListOrdered}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    label="Ordered List"
                />
                <ToolbarButton
                    icon={Quote}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    label="Blockquote"
                />
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <ToolbarButton
                    icon={TableIcon}
                    onClick={addTable}
                    label="Insert Table"
                />
                <ToolbarButton
                    icon={ImageIcon}
                    onClick={addImage}
                    label="Insert Image"
                />
                <div className="flex-1" />
                <ToolbarButton
                    icon={Undo}
                    onClick={() => editor.chain().focus().undo().run()}
                    label="Undo"
                />
                <ToolbarButton
                    icon={Redo}
                    onClick={() => editor.chain().focus().redo().run()}
                    label="Redo"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white min-h-[300px]">
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                /* Table Styles */
                .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0;
                    overflow: hidden;
                }
                .ProseMirror td, .ProseMirror th {
                    min-width: 1em;
                    border: 2px solid #e2e8f0;
                    padding: 3px 5px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                }
                .ProseMirror th {
                    font-weight: bold;
                    text-align: left;
                    background-color: #f8fafc;
                }
                .ProseMirror .selectedCell:after {
                    z-index: 2;
                    position: absolute;
                    content: "";
                    left: 0; right: 0; top: 0; bottom: 0;
                    background: rgba(200, 200, 255, 0.4);
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}
