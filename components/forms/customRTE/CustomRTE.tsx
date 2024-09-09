import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { ScrollArea, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Code from '@tiptap/extension-code';
import { createLowlight, all } from 'lowlight';
import Placeholder from '@tiptap/extension-placeholder';
import { CodeBlockControl, ImageControl, YoutubeControl } from './utils';
import { isDarkMode } from '@/config/config';



interface ICustomRTE {
    updateForm?: any
    content: any
    readonly: boolean
    height?: string
    padding?: string
}

function CustomRTE(props: ICustomRTE) {
    const { updateForm, content, readonly, height, padding } = props

    const theme = useMantineTheme()
    const { colorScheme } = useMantineColorScheme()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            Image,
            Youtube.configure({
                width: 640
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            CodeBlockLowlight.configure({
                lowlight: createLowlight(all)
            }),
            Code,
            Placeholder.configure({
                placeholder: "Write something here..."
            })
        ],
        editable: !readonly,
        onUpdate: ({ editor }) => {
            const value = editor.getHTML()
            updateForm(value)
        },
        content,
    });

    return (
        <RichTextEditor spellCheck={false} p={padding} editor={editor} style={{
            height: readonly ? 'fit-content' : height ?? 'calc(100dvh - 150px)',
            borderRadius: '10px', borderStyle: readonly ? 'none' : 'solid',
            padding: 0
        }}
            component={ScrollArea}
        >
            {
                !readonly ? (
                    <RichTextEditor.Toolbar sticky={true} stickyOffset={0} bg={isDarkMode(colorScheme) ? theme.colors.dark[8] : theme.colors.gray[1]}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                            {/* <RichTextEditor.CodeBlock /> */}
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <ImageControl />
                            <YoutubeControl />
                            <CodeBlockControl />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                ) : null
            }
            <RichTextEditor.Content p={0} />
        </RichTextEditor>
    );
}

export default CustomRTE