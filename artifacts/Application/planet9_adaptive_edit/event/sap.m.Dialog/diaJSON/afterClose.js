//@ts-ignore
if (typeof editorJSON !== 'undefined') {
    //@ts-ignore
    editorJSON.dispose();
}
textAreaJSON.setValue('');
messageJSON.setVisible(false);
messageJSON.setText('')