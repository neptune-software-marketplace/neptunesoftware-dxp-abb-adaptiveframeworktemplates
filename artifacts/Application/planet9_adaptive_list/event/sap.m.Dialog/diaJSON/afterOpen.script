if (textAreaJSON.getVisible()) {
    //@ts-ignore
    if (!editorData.content) editorData.content = "";

    //@ts-ignore
    const editorContent = typeof editorData.content === "object" ? JSON.stringify(editorData.content, null, 4) : editorData.content;
    textAreaJSON.setValue(editorContent);
}
