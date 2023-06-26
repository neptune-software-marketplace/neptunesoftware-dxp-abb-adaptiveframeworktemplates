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

function sortObjects(objArray, properties) {
    var primers = arguments[2] || {};

    properties = properties.map(function (prop) {
        if (!(prop instanceof Array)) {
            prop = [prop, "asc"];
        }
        if (prop[1].toLowerCase() == "desc") {
            prop[1] = -1;
        } else {
            prop[1] = 1;
        }
        return prop;
    });

    function valueCmp(x, y) {
        return x > y ? 1 : x < y ? -1 : 0;
    }

    function arrayCmp(a, b) {
        var arr1 = [],
            arr2 = [];
        properties.forEach(function (prop) {
            var aValue = a[prop[0]],
                bValue = b[prop[0]];
            if (typeof primers[prop[0]] != "undefined") {
                aValue = primers[prop[0]](aValue);
                bValue = primers[prop[0]](bValue);
            }
            arr1.push(prop[1] * valueCmp(aValue, bValue));
            arr2.push(prop[1] * valueCmp(bValue, aValue));
        });
        return arr1 < arr2 ? -1 : 1;
    }

    objArray.sort(function (a, b) {
        return arrayCmp(a, b);
    });
    
}