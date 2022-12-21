jQuery.sap.require('sap.ui.core.util.Export');
jQuery.sap.require('sap.ui.core.util.ExportTypeCSV');

function jsonRequest({ type, url, data, success, error }) {
    return $.ajax({
        type: type || 'POST',
        contentType: 'application/json',
        url,
        data,
        success,
        error,
    });
}