import { Input } from "@mantine/core"
import { Link, RichTextEditor as MantineRichTextEditor } from "@mantine/tiptap"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import type { ComponentProps } from "react"
import { useEffect } from "react"

export interface RichTextEditorProps extends Omit<
  ComponentProps<typeof Input.Wrapper>,
  "children" | "onChange"
> {
  /** Form input props from form.getInputProps() */
  value?: string
  defaultValue?: string
  /** Callback fired when editor content changes */
  onChange?: (value: string) => void
  /** Callback fired when editor loses focus */
  onBlur?: () => void
  /** Placeholder text for the editor.
   * For better placeholder support, install @tiptap/extension-placeholder and update the component to use it.
   */
  placeholder?: string
  /** Whether to show the toolbar */
  withToolbar?: boolean
  /** Custom toolbar controls */
  toolbarControls?: React.ReactNode
  /** Minimum height of the editor content area */
  minHeight?: number | string
  /** Variant of the rich text editor */
  variant?: "default" | "subtle"
  /** Whether to show typography styles */
  withTypographyStyles?: boolean
}

/**
 * Rich text editor component that integrates with Mantine forms.
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: { content: '' },
 * })
 *
 * <RichTextEditor
 *   label="Content"
 *   placeholder="Enter your content here..."
 *   {...form.getInputProps('content')}
 * />
 * ```
 */

export default function RichTextEditor({
  value,
  defaultValue = "",
  onChange,
  onBlur,
  error,
  label,
  description,
  required,
  placeholder,
  withToolbar = true,
  toolbarControls,
  minHeight = 200,
  size = "md",
  className,
  classNames: inputWrapperClassNames,
  variant,
  withTypographyStyles,
}: RichTextEditorProps) {
  "use no memo"
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Link is added separately via @mantine/tiptap Link
      }),
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || defaultValue,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    onBlur: () => {
      onBlur?.()
    },
    shouldRerenderOnTransaction: true,
  })

  // Sync editor content when value prop changes (for controlled mode)
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML()
      if (currentContent !== value) {
        editor.commands.setContent(value ?? "")
      }
    }
  }, [value, editor])

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  const defaultToolbar = (
    <MantineRichTextEditor.Toolbar sticky stickyOffset={60} variant="subtle">
      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.Bold />
        <MantineRichTextEditor.Italic />
        <MantineRichTextEditor.Underline />
        <MantineRichTextEditor.Strikethrough />
        <MantineRichTextEditor.ClearFormatting />
        <MantineRichTextEditor.Code />
      </MantineRichTextEditor.ControlsGroup>

      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.H1 />
        <MantineRichTextEditor.H2 />
        <MantineRichTextEditor.H3 />
        <MantineRichTextEditor.H4 />
      </MantineRichTextEditor.ControlsGroup>

      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.Blockquote />
        <MantineRichTextEditor.Hr />
        <MantineRichTextEditor.BulletList />
        <MantineRichTextEditor.OrderedList />
      </MantineRichTextEditor.ControlsGroup>

      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.AlignLeft />
        <MantineRichTextEditor.AlignCenter />
        <MantineRichTextEditor.AlignRight />
        <MantineRichTextEditor.AlignJustify />
      </MantineRichTextEditor.ControlsGroup>

      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.Link />
        <MantineRichTextEditor.Unlink />
      </MantineRichTextEditor.ControlsGroup>

      <MantineRichTextEditor.ControlsGroup>
        <MantineRichTextEditor.Undo />
        <MantineRichTextEditor.Redo />
      </MantineRichTextEditor.ControlsGroup>
    </MantineRichTextEditor.Toolbar>
  )

  if (!editor) {
    return null
  }

  return (
    <div>
      <Input.Wrapper
        label={label}
        description={description}
        error={error}
        required={required}
        size={size}
        className={className}
        classNames={inputWrapperClassNames}>
        <MantineRichTextEditor
          editor={editor}
          variant={variant}
          withTypographyStyles={withTypographyStyles}
          style={{
            ...(error && {
              borderColor: "var(--mantine-color-error)",
            }),
          }}>
          {withToolbar && (toolbarControls || defaultToolbar)}
          <MantineRichTextEditor.Content
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl prose-headings:font-semibold prose-p:my-2 prose-ul:my-2 prose-ol:my-2 max-w-none min-w-full focus:outline-none"
            style={{
              minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight,
            }}
          />
        </MantineRichTextEditor>
        {placeholder && (
          <style>{`
          .mantine-RichTextEditor-content .ProseMirror p.is-editor-empty:first-child::before {
            content: "${placeholder}";
            float: left;
            color: var(--mantine-color-dimmed);
            pointer-events: none;
            height: 0;
          }
        `}</style>
        )}
      </Input.Wrapper>
    </div>
  )
}
