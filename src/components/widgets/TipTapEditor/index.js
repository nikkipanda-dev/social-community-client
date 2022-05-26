import { useEditor, EditorContent } from '@tiptap/react';
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from '@tiptap/starter-kit';
import { styled } from "../../../stitches.config";

import Button from "../../core/Button";
import Text from "../../core/Text";

const TipTapWrapper = styled('div', {
    marginTop: '30px',
    '> div > div.ProseMirror': {
        transition: '$default',
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

const EditorFooterWrapper = styled('div', {
    marginTop: '$space-3',
});

const MenuBarWrapper = styled('div', {
    background: '$lightGray',
    padding: '$space-2',
    borderRadius: '$default',
    marginBottom: '$space-3',
    'button': {
        margin: '$space-1',
    },
});

const MenuBarWrapperTypeWrapper = styled('div', {});

const MenuBarWrapperHelpersWrapper = styled('div', {});

const MenuBarWrapperStyleWrapper = styled('div', {});

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
            <MenuBarWrapperTypeWrapper className="d-flex flex-column">
                <MenuBarWrapperStyleWrapper>
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H1</Text>}
                    onClick={() => handleHeading(1)}
                    color={editor.isActive('heading', { level: 1 }) ? 'brown' : 'white'} />
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H2</Text>}
                    onClick={() => handleHeading(2)}
                    color={editor.isActive('heading', { level: 2 }) ? 'brown' : 'white'} />
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H3</Text>}
                    onClick={() => handleHeading(3)}
                    color={editor.isActive('heading', { level: 3 }) ? 'brown' : 'white'} />
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H4</Text>}
                    onClick={() => handleHeading(4)}
                    color={editor.isActive('heading', { level: 4 }) ? 'brown' : 'white'} />
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H5</Text>}
                    onClick={() => handleHeading(5)}
                    color={editor.isActive('heading', { level: 5 }) ? 'brown' : 'white'} />
                    <Button
                    type="button"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>H6</Text>}
                    onClick={() => handleHeading(6)}
                    color={editor.isActive('heading', { level: 6 }) ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Bulleted</Text>}
                    onClick={handleBullet} 
                    color={editor.isActive('bulletList') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Ordered List</Text>}
                    onClick={handleOrderedList} 
                    color={editor.isActive('orderedList') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span">B</Text>} 
                    onClick={handleBoldText}
                    color={editor.isActive('bold') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span" css={{ fontWeight: 'normal', fontStyle: 'italic', }}>i</Text>} 
                    onClick={handleItalicText}
                    color={editor.isActive('italic') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text as="del" type="span" css={{ fontWeight: 'normal', }}>S</Text>}
                    onClick={handleStrikeText}
                    color={editor.isActive('strike') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Code Block</Text>}
                    onClick={handleCodeBlock} 
                    color={editor.isActive('codeBlock') ? 'brown' : 'white'} />
                    <Button 
                    type="button" 
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Blockquote</Text>}
                    onClick={handleBlockquote} 
                    color={editor.isActive('blockquote') ? 'brown' : 'white'} />
                </MenuBarWrapperStyleWrapper>
                <hr />
                <MenuBarWrapperHelpersWrapper>
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Clear Mark Style</Text>}
                    onClick={handleClearMarks} />
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Clear Heading & List Style</Text>}
                    onClick={handleClearNodes} />
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Horizontal Rule</Text>}
                    onClick={handleHorizontalRule} />
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>New Line</Text>}
                    onClick={handleHardBreak} />
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Undo</Text>}
                    onClick={handleUndo} />
                    <Button 
                    type="button" 
                    color="white"
                    text={<Text type="span" css={{ fontWeight: 'normal', }}>Redo</Text>}
                    onClick={handleRedo} />
                </MenuBarWrapperHelpersWrapper>
            </MenuBarWrapperTypeWrapper>

            {/* <Button 
            type="button" 
            text={<Text type="span" css={{ fontWeight: 'normal', }}>Paragraph</Text>}
            onClick={handleParagraph} 
            color={editor.isActive('paragraph') ? 'brown' : ''} /> */}
        </MenuBarWrapper>
    )
}

export const TipTapEditor = ({
    content, 
    limit, 
    isEditable,
    handleOutput,
    css,
}) => {    
    const exportOutput = (editor, output) => {
        (!(editor.isEmpty) && {...handleOutput}) && handleOutput(output);
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
            ...css,
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
            <EditorFooterWrapper className="character-count d-flex flex-column">
                <Text type="span">{editor.storage.characterCount.characters()}/{limit} characters</Text>
                <Text type="span">{editor.storage.characterCount.words()} word{(editor.storage.characterCount.words() > 1) && 's' }</Text>
            </EditorFooterWrapper>
        }
        </TipTapWrapper>
    )
}


export default TipTapEditor;