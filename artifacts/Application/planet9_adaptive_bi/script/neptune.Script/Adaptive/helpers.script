function isCordova() {
    return window.hasOwnProperty('cordova') || typeof (cordova) === 'object';
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