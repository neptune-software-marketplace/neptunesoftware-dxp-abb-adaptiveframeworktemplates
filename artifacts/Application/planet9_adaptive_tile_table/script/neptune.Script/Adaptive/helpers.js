function getFieldBindingText(field) {
    const k = field.name;
    return field.valueType ? `{${k}_value}` : `{${k}}`;
}

function onFieldChangeEvent(oEvent, events) {
    const ctx = oEvent.oSource.getBindingContext();
    events.onTableChange(ctx.getObject());
}

function getFieldWrapping(field) {
    return field.wrapping || false;
}

function getFieldPlaceholder(field) {
    return field.placeholder || '';
}

function isFieldEditable(field) {
    return field.editable ? true : false;
}

function getDateFormatter(fieldName) {
    if (typeof fieldName === 'undefined' || fieldName === null) return;
    if (typeof fieldName === 'string' && fieldName.length === 13) return new Date(parseInt(fieldName));
    return new Date(fieldName);
}

const mKeyToText = {
    MultiSelectLookup: 'MultiSelect Lookup',
    MultiSelectScript: 'MultiSelect Script',
    SingleSelectLookup: 'SingleSelect Lookup',
    SingleSelectScript: 'SingleSelect Script',
};

function keyToText(k) {
    return mKeyToText[k] !== undefined ? mKeyToText[k] : k;
}

function valuesToKeyText(values) {
    return values.map(function (v) {
        if (v.includes('|')) {
            const [key, text] = v.split('|');
            return { key, text };
        }

        return { key: v, text: keyToText(v) };
    });
}

function distinctValuesToKeyText(values) {
    return values.map(function ([key, text]) {
        return { key, text };
    });
}

function getAdaptiveEditorPreviewLanguage() {
    // poSettings is the custom component popover settings introduced in 22-LTS
    if (typeof poSettings !== 'undefined' && typeof poSettings.getPreviewLanguage !== 'undefined') {
        return poSettings.getPreviewLanguage();
    }
    
    if (typeof toolMenuTranslation !== 'undefined') {
        // toolMenuTranslation was the drop inside AdaptiveDesigner which got replaced with poSettings above
        return toolMenuTranslation.getSelectedKey();
    }
    
    return false;
}