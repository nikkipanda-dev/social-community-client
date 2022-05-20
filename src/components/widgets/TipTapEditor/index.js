import { useMemo, useRef, useEffect, useState, } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import CharacterCount from "@tiptap/extension-character-count";
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Text from "../../core/Text";

const TipTapWrapper = styled('div', {
    marginTop: '$space-5',
    '> div > div.ProseMirror': {
        transition: '$default',
        // border: '1px solid $lightGray1 !important',
        boxShadow: 'unset',
        background: '$white',
        padding: '$space-2 $space-2 $space-1',
    },
    '> div > div.ProseMirror.ProseMirror-focused:focus': {
        border: '1px solid $lightGray2 !important',
        outline: 'unset',
        boxShadow: 'unset !important',
    },
});

const EditorFooterWrapper = styled('div', {});

const MenuBarWrapper = styled('div', {
    marginBottom: '$space-3',
    'button': {
        margin: '$space-1',
    },
});

const MenuBar = ({ 
    editor, 
    className, 
    css,
}) => {
    if (!editor) {
        return null;
    }

    const handleBoldText = () => editor.chain().focus().toggleBold().run();
    const handleItalicText = () => editor.chain().focus().toggleItalic().run();
    const handleStrikeText = () => editor.chain().focus().toggleStrike().run();
    const handleCodeText = () => editor.chain().focus().toggleCode().run();
    const handleClearMarks = () => editor.chain().focus().unsetAllMarks().run();
    const handleClearNodes = () => editor.chain().focus().clearNodes().run();
    const handleParagraph = () => editor.chain().focus().setParagraph().run();
    const handleHeading = type => editor.chain().focus().toggleHeading({ level: type }).run();
    const handleBullet = () => editor.chain().focus().toggleBulletList().run();
    const handleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
    const handleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
    const handleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

    const handleHorizontalRule = () => editor.chain().focus().setHorizontalRule().run();
    const handleHardBreak = () => editor.chain().focus().setHardBreak().run();
    const handleUndo = () => editor.chain().focus().undo().run();
    const handleRedo = () => editor.chain().focus().redo().run();

    return (
        <MenuBarWrapper className={' ' + (MenuBarWrapper ? (' ' + className) : '')} {...css && { css: { ...css } }}>
            <Button 
            type="button" 
            text={<Text type="span">Bold</Text>} 
            onClick={handleBoldText}
            color={editor.isActive('bold') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', fontStyle: 'italic', }}>Italic</Text>} 
            onClick={handleItalicText}
            color={editor.isActive('italic') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text as="del" type="span" css={{ fontWeight: 'normal', }}>Strike</Text>}
            onClick={handleStrikeText}
            color={editor.isActive('strike') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Inline code</Text>}
            onClick={handleCodeText}
            color={editor.isActive('code') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Clear Marks</Text>}
            onClick={handleClearMarks} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Clear Nodes</Text>}
            onClick={handleClearNodes} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Paragraph</Text>}
            onClick={handleParagraph} 
            color={editor.isActive('paragraph') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 1</Text>}
            onClick={() => handleHeading(1)} 
            color={editor.isActive('heading', { level: 1 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 2</Text>} 
            onClick={() => handleHeading(2)} 
            color={editor.isActive('heading', { level: 2 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 3</Text>}
            onClick={() => handleHeading(3)} 
            color={editor.isActive('heading', { level: 3 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 4</Text>}
            onClick={() => handleHeading(4)} 
            color={editor.isActive('heading', { level: 4 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 5</Text>} 
            onClick={() => handleHeading(5)} 
            color={editor.isActive('heading', { level: 5 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Heading 6</Text>}
            onClick={() => handleHeading(6)} 
            color={editor.isActive('heading', { level: 6 }) ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Bulleted</Text>}
            onClick={handleBullet} 
            color={editor.isActive('bulletList') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Ordered List</Text>}
            onClick={handleOrderedList} 
            color={editor.isActive('orderedList') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Code Block</Text>}
            onClick={handleCodeBlock} 
            color={editor.isActive('codeBlock') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Blockquote</Text>}
            onClick={handleBlockquote} 
            color={editor.isActive('blockquote') ? 'brown' : ''} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Horizontal Rule</Text>}
            onClick={handleHorizontalRule} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>New Line</Text>}
            onClick={handleHardBreak} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Undo</Text>}
            onClick={handleUndo} />
            <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Redo</Text>}
            onClick={handleRedo} />
        </MenuBarWrapper>
    )
}

export const RenderHtml = ({ handleHtml, content, }) => {
    console.log('content ', content);

    const ref = useRef('');

    const output = useMemo(() => {
        return generateHTML(content, [
            StarterKit,
            // other extensions …
        ])
    }, [content]);

    return (
        <div ref={ref}>
            {output}
        </div>
    )
}

export const TipTapEditor = ({
    content, 
    limit, 
    isEditable,
    handleOutput,
}) => {
    const exportOutput = (editor, output) => {
        !(editor.isEmpty) && handleOutput(output);
    }
    
    const editor = useEditor({
        extensions: [
            StarterKit,
            CharacterCount.configure({
                limit,
            })
        ],
        onUpdate({ editor }) {
            const json = editor.getJSON()
            exportOutput(editor, json);
        },
        content: content,
    });

    editor && editor.setEditable(isEditable);
    
    return (
        editor &&
        <TipTapWrapper css={{
            '> div > div.ProseMirror': {
                transition: '$default',
                border: isEditable ? '1px solid $lightGray1 !important' : 'unset',
                boxShadow: 'unset',
                background: '$white',
                padding: '$space-2 $space-2 $space-1',
            },
            '> div > div.ProseMirror.ProseMirror-focused:focus': {
                border: '1px solid $lightGray2 !important',
                outline: 'unset',
                boxShadow: 'unset !important',
            }, }}>
        {
            isEditable && 
            <MenuBar editor={editor} />
        }
            <EditorContent editor={editor} />
        {
            isEditable && 
            <EditorFooterWrapper className="character-count">
                <Text type="span">{editor.storage.characterCount.characters()}/{limit} characters</Text>
                <br />
                {editor.storage.characterCount.words()} words
            </EditorFooterWrapper>
        }
        </TipTapWrapper>
    )
}


export default TipTapEditor;