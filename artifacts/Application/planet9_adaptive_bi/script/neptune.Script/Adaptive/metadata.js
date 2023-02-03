const vb = {
    valueTypeFixed: "{= ${/valueType} === 'Fixed' ? true: false }",
    valueTypeLookup: "{= ${/valueType} === 'Lookup' ? true: false }",
    valueTypeRule: "{= ${/valueType} === 'Rule' ? true: false }",
    typeInput: "{= ${/type} ? false: true }",
    reportEnableClose: "{= ${appData>/settings/properties/report/enableClose} ? true:false }",
    multiSingleSelectScript:
        "{= ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectScript' ? true: false }",
    multiSingleSelectLookup:
        "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }",
    buttonTypes: [
        "Accept",
        "Attention",
        "Critical",
        "Back",
        "Default",
        "Emphasized",
        "Ghost",
        "Neutral",
        "Reject",
        "Transparent",
        "Unstyled",
        "Up",
    ],
};

const metadata = {
    properties: {
        enableForm: true,
        enableTable: true,
        titleForm: "Filter",
        titleTable: "Dimensions",
        iconForm: "/public/icons/s_b_filt.gif",
        iconTable: "/public/icons/s_wdvtlc.gif",

        report: {
            titleGeneral: { type: "Title", label: "General" },
            title: { type: "Input", label: "Title", translate: true },

            titleButtonClose: {
                type: "Title",
                label: "Button Close",
                visible: vb.reportEnableClose,
            },
            iconButtonClose: {
                type: "Icon",
                label: "Icon",
                default: "",
                visible: vb.reportEnableClose,
            },
            textButtonClose: {
                type: "Input",
                label: "Text",
                default: "Close",
                translate: true,
                visible: vb.reportEnableClose,
            },
            typeButtonClose: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.reportEnableClose,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleProperties: { type: "Title", label: "Properties" },
            enableValues: { type: "CheckBox", label: "Enable Values", default: true },
            enableLeftPanel: { type: "CheckBox", label: "Enable Selection", default: true },
            enableRightPanel: { type: "CheckBox", label: "Enable Layout", default: true },
            enableVariant: { type: "CheckBox", label: "Enable Variant", default: false },
            showLeftPanel: { type: "CheckBox", label: "Show Selection", default: true },
            showRightPanel: { type: "CheckBox", label: "Show Layout", default: false },
            enableClose: { type: "CheckBox", label: "Enable Close", default: false },
            autoRun: { type: "CheckBox", label: "Run At Start", default: false },
        },

        table: {
            titlePostProcessingScript: { type: "Title", label: "Post Processing" },
            postProcessingScript: { type: "Script", label: "Script" },
            titleTotals: { type: "Title", label: "Totals" },
            showRowTotal: { type: "CheckBox", label: "Show Row Total", default: true },
            showColTotal: { type: "CheckBox", label: "Show Col Total", default: true },
        },
    },

    fieldsSel: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Field Type",
            items: [
                { key: "", text: "Input" },
                { key: "DateRange", text: "DateRange" },
                { key: "DatePicker", text: "DatePicker" },
                { key: "CheckBox", text: "CheckBox" },
                { key: "MultiSelect", text: "MultiSelect" },
                { key: "MultiSelectLookup", text: "MultiSelect Lookup" },
                { key: "MultiSelectScript", text: "MultiSelect Script" },
                { key: "SingleSelect", text: "SingleSelect" },
                { key: "SingleSelectLookup", text: "SingleSelect Lookup" },
                { key: "SingleSelectScript", text: "SingleSelect Script" },
                { key: "Switch", text: "Switch" },
            ],
        },

        titleSelectScript: {
            type: "Title",
            label: "Data Source",
            visible: vb.multiSingleSelectScript,
        },
        scriptSelect: {
            type: "Script",
            label: "Server Script",
            visible: vb.multiSingleSelectScript,
        },

        titleDefault: { type: "Title", label: "Default Value" },
        default: { type: "Input", label: "Fixed Value" },
        sysvarValue: {
            type: "SingleSelect",
            label: "System Variable",
            items: distinctValuesToKeyText([
                ["", ""],
                ["UserName", "UserName"],
                ["TOMORROW", "DateRange: Tomorrow"],
                ["TODAY", "DateRange: Today"],
                ["YESTERDAY", "DateRange: Yesterday"],
                ["LAST_7", "DateRange: Last 7 Days"],
                ["LAST_30", "DateRange: Last 30 Days"],
                ["LAST_60", "DateRange: Last 60 Days"],
                ["LAST_90", "DateRange: Last 90 Days"],
                ["LAST_180", "DateRange: Last 180 Days"],
                ["NEXT_30", "DateRange: Next 30 Days"],
                ["NEXT_60", "DateRange: Next 60 Days"],
                ["NEXT_7", "DateRange: Next 7 Days"],
                ["NEXT_90", "DateRange: Next 90 Days"],
                ["NEXT_180", "DateRange: Next 180 Days"],
            ]),
        },
        scriptValue: { type: "Script", label: "Script Value" },

        titleLookup: { type: "Title", label: "Data Source", visible: vb.multiSingleSelectLookup },
        lookupTable: { type: "Table", label: "Table", visible: vb.multiSingleSelectLookup },
        lookupFieldKey: {
            type: "TableField",
            label: "Key Field",
            visible: vb.multiSingleSelectLookup,
        },
        lookupFieldText: {
            type: "TableField",
            label: "Text Field",
            visible: vb.multiSingleSelectLookup,
        },
        lookupFieldAdditional: {
            type: "TableField",
            label: "Additional Text Field",
            visible: vb.multiSingleSelectLookup,
        },
        lookupShowOnlyText: {
            type: "CheckBox",
            label: "Hide Key Field",
            visible: vb.multiSingleSelectLookup,
        },

        titleLayout: { type: "Title", label: "Layout" },
        columnLabel: { type: "Input", label: "Column Title" },

        fieldProps: { type: "Title", label: "Properties" },
        selEqual: { type: "CheckBox", label: "Strict Search", visible: vb.typeInput },
        required: { type: "CheckBox", label: "Required", default: false },
        visible: { type: "CheckBox", label: "Visible", default: true },
    },

    fieldsRun: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },

        // Value
        titleValue: { type: "Title", label: "Value" },
        valueType: {
            type: "SingleSelect",
            label: "Source",
            items: [
                { key: "", text: "Source Value" },
                { key: "Fixed", text: "Fixed Value" },
                { key: "Lookup", text: "Lookup" },
                { key: "Rule", text: "Rules Engine" },
                { key: "Script", text: "Script (from post processing)" },
            ],
        },
        valueFixed: { type: "Input", label: "Fixed Value", visible: vb.valueTypeFixed },
        valueLookup: { type: "Lookup", label: "Lookup", visible: vb.valueTypeLookup },
        valueRule: { type: "Rule", label: "Rules Engine", visible: vb.valueTypeRule },

        formatter: {
            type: "SingleSelect",
            label: "Formatter",
            items: [
                { key: "", text: "" },
                { key: "date00", text: "Date Browser Format" },
                { key: "date01", text: "Date (dd.mm.yyyy)" },
                { key: "date02", text: "Date (mm-dd-yyyy)" },
                { key: "date06", text: "Date (yyyy.mm.dd)" },
                { key: "date07", text: "Date (yyyy-mm-dd)" },
                { key: "date03", text: "Date (Month)" },
                { key: "date04", text: "Date (Quarter)" },
                { key: "date05", text: "Date (Year)" },
                { key: "sapdate01", text: "SAP Date (dd.mm.yyyy)" },
                { key: "sapdate02", text: "SAP Date (mm-dd-yyyy)" },
                { key: "sapdate03", text: "SAP Date (Month)" },
                { key: "zero", text: "Remove Leading Zero" },
                { key: "uppercase", text: "Upper Case" },
                { key: "lowercase", text: "Lower Case" },
            ],
        },

        fieldProps: { type: "Title", label: "Properties" },
        hidden: { type: "CheckBox", label: "Hide", default: false },
        filter: { type: "CheckBox", label: "Filter", default: true },
    },
};
