// $.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-sortable');

jQuery.sap.require('sap.ui.core.format.DateFormat')
jQuery.sap.require('sap.ui.core.format.NumberFormat');

function jsonRequest({ type, url, data, success, error, dataType, cache }) {
  return $.ajax({
    type: type || 'POST',
    contentType: 'application/json',
    url,
    data,
    success,
    error,
    dataType,
    cache,
  });
}