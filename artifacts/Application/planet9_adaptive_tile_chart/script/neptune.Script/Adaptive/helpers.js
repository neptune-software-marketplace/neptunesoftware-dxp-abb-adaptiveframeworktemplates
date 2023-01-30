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
