//@ts-ignore
const editable = !editorData.readOnly;
//@ts-ignore
const hasMonaco = typeof monaco !== "undefined";
diaJSONSave.setVisible(editable && hasMonaco);
if (editable && !hasMonaco) {
    messageJSON.setVisible(true);
    messageJSON.setText("Monaco is missing, JSON editing is disabled. Please contact your system administrator.");
}
