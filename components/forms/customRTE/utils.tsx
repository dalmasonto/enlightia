import { LANGUAGES } from "@/config/languages";
import { Modal, Button, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconPhotoPlus, IconVideoPlus, IconCodeAsterix, IconCode } from "@tabler/icons-react";




export function ImageControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure()

    const form = useForm({
        initialValues: {
            src: ''
        },
        validate: {
            src: val => val === '' ? ' image url' : null
        }
    })

    const Image = () => {
        const src = form.values.src
        if (src !== '') {
            editor?.chain().focus().setImage({ src }).run()
            close()
        }
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={() => open()}
                aria-label=" Image"
                title=" Image"
            >
                <IconPhotoPlus stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal title="Add Image" opened={opened} onClose={close} zIndex={2100}>
                <form onSubmit={form.onSubmit(() => Image())}>
                    <Stack>
                        <TextInput label="Image URL" radius={'md'} {...form.getInputProps('src')} />
                        <Button size='sm' onClick={Image}>Insert</Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}

export function YoutubeControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure()

    const form = useForm({
        initialValues: {
            src: ''
        },
        validate: {
            src: val => val === '' ? ' image url' : null
        }
    })

    const Video = () => {
        const src = form.values.src
        if (src !== '') {
            editor?.commands.setYoutubeVideo({
                src: src
            })
            close()
        }
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={() => open()}
                aria-label=" Video"
                title=" Video"
            >
                <IconVideoPlus stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
            <Modal title="Add Image" opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(() => Video())}>
                    <Stack>
                        <TextInput label="Youtube Video URL" radius={'md'} {...form.getInputProps('src')}  />
                        <Button size='sm' onClick={Video}>Insert</Button>
                    </Stack>
                </form>
            </Modal>
        </>
    );
}


export function CodeBlockControl() {
    const { editor } = useRichTextEditorContext();
    const [opened, { open, close }] = useDisclosure()
    
    const form = useForm({
        initialValues: {
            language: 'plaintext'
        },
        validate: {
            language: val => (val === '' ||  !val) ? 'Select Language to Use' : null
        }
    })

    const codeBlock = () => {
        editor?.commands.setCodeBlock({
            language: form.values.language
        })
        close()
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={open}
                aria-label=" codeblock"
                title="Set Codeblock"
            >
                <IconCodeAsterix stroke={1.5} size="1rem" />
            </RichTextEditor.Control>

            <Modal title="Insert Code Block" opened={opened} onClose={close}>
                {/* <form id="code-block" onSubmit={form.onSubmit(() => CodeBlock())}> */}
                    <Stack>
                        <Select label="Select Language" radius={'md'} {...form.getInputProps('language')} searchable clearable data={LANGUAGES} />
                        <Button size='sm' onClick={codeBlock}>Insert</Button>
                    </Stack>
                {/* </form> */}
            </Modal>
        </>
    );
}

export function CodeControl() {
    const { editor } = useRichTextEditorContext();
    const Code = () => {
        editor?.commands.setCode()
    }


    return (
        <>
            <RichTextEditor.Control
                onClick={Code}
                aria-label=" code"
                title=" code"
            >
                <IconCode stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
        </>
    );
}