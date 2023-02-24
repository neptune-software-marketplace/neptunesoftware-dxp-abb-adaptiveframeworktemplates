const vb = {
    buttonTypes: ["Accept", "Attention", "Critical", "Back", "Default", "Emphasized", "Ghost", "Neutral", "Reject", "Transparent", "Unstyled", "Up"],
};

const metadata = {
    properties: {
        docLink: "",
        enableForm: true,
        enableTable: true,
        titleForm: "Filter",
        titleTable: "Appointments",
        iconForm: "/public/icons/s_b_filt.gif",
        iconTable: "/public/icons/s_t_date.gif",

        report: {
            titleGeneral: { type: "Title", label: "General" },
            title: { type: "Input", label: "Title" },
            subTitle: { type: "Input", label: "Sub Title" },
            avatarIcon: { type: "Icon", label: "Icon" },
            avatarBackgroundColor: {
                type: "SingleSelect",
                label: "Icon Color",
                items: [
                    { key: "", text: "" },
                    { key: "Accent1", text: "Accent1" },
                    { key: "Accent2", text: "Accent2" },
                    { key: "Accent3", text: "Accent3" },
                    { key: "Accent4", text: "Accent4" },
                    { key: "Accent5", text: "Accent5" },
                    { key: "Accent6", text: "Accent6" },
                    { key: "Accent7", text: "Accent7" },
                    { key: "Accent8", text: "Accent8" },
                    { key: "Accent9", text: "Accent9" },
                    { key: "Accent10", text: "Accent10" },
                    { key: "Random", text: "Random" },
                ],
            },
            showIcon: { type: "CheckBox", label: "Icon Visible", default: true },

            titleNavigation: { type: "Title", label: "Event" },
            navigationCreate: { type: "Navigation", label: "Create", visible: "{= ${appData>/settings/properties/report/enableCreate} ? true:false }" },
            navigationItemPress: { type: "Navigation", label: "ItemPress" },

            titleButtonClose: { type: "Title", label: "Button Close", visible: "{= ${appData>/settings/properties/report/enableClose} ? true:false }" },
            iconButtonClose: { type: "Icon", label: "Icon", default: "", visible: "{= ${appData>/settings/properties/report/enableClose} ? true:false }" },
            textButtonClose: { type: "Input", label: "Text", default: "Close", translate: true, visible: "{= ${appData>/settings/properties/report/enableClose} ? true:false }" },
            typeButtonClose: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: "{= ${appData>/settings/properties/report/enableClose} ? true:false }",
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonCreate: { type: "Title", label: "Button Create", visible: "{= ${appData>/settings/properties/report/enableCreate} ? true:false }" },
            iconButtonCreate: { type: "Icon", label: "Icon", default: "", visible: "{= ${appData>/settings/properties/report/enableCreate} ? true:false }" },
            textButtonCreate: { type: "Input", label: "Text", default: "Create", translate: true, visible: "{= ${appData>/settings/properties/report/enableCreate} ? true:false }" },
            typeButtonCreate: {
                type: "SingleSelect",
                label: "Type",
                default: "Emphasized",
                visible: "{= ${appData>/settings/properties/report/enableCreate} ? true:false }",
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonRun: { type: "Title", label: "Button Run", visible: "{= ${appData>/settings/properties/report/enableRun} ? true:false }" },
            iconButtonRun: { type: "Icon", label: "Icon", default: "", visible: "{= ${appData>/settings/properties/report/enableRun} ? true:false }" },
            textButtonRun: { type: "Input", label: "Text", default: "Update", translate: true, visible: "{= ${appData>/settings/properties/report/enableRun} ? true:false }" },
            typeButtonRun: {
                type: "SingleSelect",
                label: "Type",
                default: "Emphasized",
                visible: "{= ${appData>/settings/properties/report/enableRun} ? true:false }",
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleProperties: { type: "Title", label: "Properties" },
            enableRun: { type: "CheckBox", label: "Enable Run", default: true },
            enableCreate: { type: "CheckBox", label: "Enable Create", default: false },
            enableClose: { type: "CheckBox", label: "Enable Close", default: false },
            hideHeader: { type: "CheckBox", label: "Hide Header", default: false },
            autoRun: { type: "CheckBox", label: "Run At Start", default: false },
            autoRunFocus: { type: "CheckBox", label: "Run At Focus", default: false },
        },

        form: {
            titleProperties: { type: "Title", label: "Properties" },
            enableCompact: { type: "CheckBox", label: "Compact Mode", default: false },
            headerExpanded: { type: "CheckBox", label: "Filter Expanded", default: true },
        },

        table: {
            titleGeneral: { type: "Title", label: "General" },
            headerText: { type: "Input", label: "Header Text", translate: true },
            startHour: { type: "Input", label: "Start Hour" },
            endHour: { type: "Input", label: "End Hour" },

            titleViews: { type: "Title", label: "Views" },
            enableWeekView: { type: "CheckBox", label: "Week", default: true },
            enableWorkWeekView: { type: "CheckBox", label: "Work Week", default: true },
            enableDayView: { type: "CheckBox", label: "Day", default: false },
            enableMonthView: { type: "CheckBox", label: "Month", default: true },

            titleProperties: { type: "Title", label: "Properties" },
            enableDnD: { type: "CheckBox", label: "Enable Drag & Drop", default: false },
            enableResize: { type: "CheckBox", label: "Enable Resize", default: false },
        },
    },

    fieldsSel: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Type",
            items: [
                { key: "", text: "Input" },
                { key: "CheckBox", text: "CheckBox" },
                { key: "DateRange", text: "DateRange" },
                { key: "MultiSelect", text: "MultiSelect" },
                { key: "MultiSelectLookup", text: "MultiSelect Lookup" },
                { key: "MultiSelectScript", text: "MultiSelect Script" },
                { key: "SingleSelect", text: "SingleSelect" },
                { key: "SingleSelectLookup", text: "SingleSelect Lookup" },
                { key: "SingleSelectScript", text: "SingleSelect Script" },
                { key: "Switch", text: "Switch" },
            ],
        },

        titleLookup: { type: "Title", label: "Data Source", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },
        lookupTable: { type: "Table", label: "Table", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },
        lookupFieldKey: { type: "TableField", label: "Key Field", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },
        lookupFieldText: { type: "TableField", label: "Text Field", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },
        lookupFieldAdditional: { type: "TableField", label: "Additional Text Field", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },
        lookupShowOnlyText: { type: "CheckBox", label: "Hide Key Field", visible: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true: false }" },

        titleSelectScript: { type: "Title", label: "Data Source", visible: "{= ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectScript' ? true: false }" },
        scriptSelect: { type: "Script", label: "Server Script", visible: "{= ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectScript' ? true: false }" },

        titleDefault: { type: "Title", label: "Default Value" },
        default: { type: "Input", label: "From Value" },
        scriptValue: { type: "Script", label: "From Script" },

        titleSettings: { type: "Title", label: "Properties" },
        required: { type: "CheckBox", label: "Required", default: false },
        visible: { type: "CheckBox", label: "Visible", default: true },
    },

    fieldsRun: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Type",
            defaukt: "Data",
            items: [
                { key: "", text: "" },
                { key: "endDate", text: "End Date" },
                { key: "startDate", text: "Start Date" },
                { key: "icon", text: "Icon" },
                { key: "color", text: "Color" },
                { key: "tentative", text: "Tentative" },
                { key: "text", text: "Text" },
                { key: "description", text: "Description" },
                { key: "title", text: "Title" },
                { key: "type", text: "Type" },
            ],
        },

        // Value
        titleValue: { type: "Title", label: "Value" },
        valueType: {
            type: "SingleSelect",
            label: "Source",
            items: distinctValuesToKeyText([
                ["", "Source Value"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
            ]),
        },
        valueFixed: { type: "Input", label: "Fixed Value", visible: "{= ${/valueType} === 'Fixed' ? true : false }" },
        valueLookup: { type: "Lookup", label: "Lookup", visible: "{= ${/valueType} === 'Lookup' ? true : false }" },
        valueRule: { type: "Rule", label: "Rules Engine", visible: "{= ${/valueType} === 'Rule' ? true : false }" },

        formatter: {
            type: "SingleSelect",
            label: "Formatter",
            visible: "{= ${/type} === 'DatePicker' || ${/type} === 'DateTimePicker' || ${/type} === 'Input' ? false : true }",
            items: distinctValuesToKeyText([
                ["", ""],
                ["date00", "Date Browser Format"],
                ["date01", "Date (dd.mm.yyyy)"],
                ["date02", "Date (mm-dd-yyyy)"],
                ["date03", "Date (Month)"],
                ["date04", "Date (Quarter)"],
                ["date05", "Time (hh:mm)"],
                ["sapdate01", "SAP Date (dd.mm.yyyy)"],
                ["sapdate02", "SAP Date (mm-dd-yyyy)"],
                ["zero", "Remove Leading Zero"],
                ["uppercase", "Upper Case"],
                ["lowercase", "Lower Case"],
                ["number00", "Number Browser Format"],
                ["number01", "Number Decimals 0"],
                ["number02", "Number Decimals 1 Comma"],
                ["number03", "Number Decimals 2 Comma"],
                ["number04", "Number Decimals 3 Comma"],
                ["number05", "Number Decimals 1 Point"],
                ["number06", "Number Decimals 2 Point"],
                ["number07", "Number Decimals 3 Point"],
                ["file", "File Size"],
            ]),
        },
    },
};
