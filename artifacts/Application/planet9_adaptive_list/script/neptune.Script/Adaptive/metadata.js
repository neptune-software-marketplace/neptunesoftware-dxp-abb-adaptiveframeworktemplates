// Visibility Bindings
const vb = {
    reportEnableCreate: "{= ${appData>/settings/properties/report/enableCreate} ? true : false }",
    reportEnableMultiSelect: "{= ${appData>/settings/properties/report/enableMultiSelect} ? true : false }",
    reportEnableClose: "{= ${appData>/settings/properties/report/enableClose} ? true : false }",
    reportEnableExport: "{= ${appData>/settings/properties/report/enableExport} ? true : false }",
    reportEnableImport: "{= ${appData>/settings/properties/report/enableImport} ? true : false }",
    reportEnableRun: "{= ${appData>/settings/properties/report/enableRun} ? true : false }",

    tableEnableAction1: "{= ${appData>/settings/properties/table/enableAction1} ? true : false }",
    tableEnableAction2: "{= ${appData>/settings/properties/table/enableAction2} ? true : false }",
    tableEnableAction3: "{= ${appData>/settings/properties/table/enableAction3} ? true : false }",
    tableEnableAction4: "{= ${appData>/settings/properties/table/enableAction4} ? true : false }",
    tableEnableAction5: "{= ${appData>/settings/properties/table/enableAction5} ? true : false }",

    typeMultiOrSingleSelectLookup: "{= ${/type} === 'MultiSelectLookup' || ${/type} === 'SingleSelectLookup' ? true : false }",
    typeMultiOrSingleSelectScript: "{= ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectScript' ? true : false }",
    typeLink: "{= ${/type} === 'Link' ? true : false }",
    typeButton: "{= ${/type} === 'Button' ? true : false }",

    typeEvents: "{= ${/type} === 'Link' || ${/type} === 'Button'? true : false }",

    buttonTypes: ["Accept", "Attention", "Critical", "Back", "Default", "Emphasized", "Ghost", "Neutral", "Reject", "Transparent", "Unstyled", "Up"],

    typeFixed: "{= ${/valueType} === 'Fixed' ? true : false }",
    typeLookup: "{= ${/valueType} === 'Lookup' ? true : false }",
    typeRule: "{= ${/valueType} === 'Rule' ? true : false }",

    typeObjectAllowIcon: "{= ${/type} === 'ObjectStatus' || ${/type} === 'Button'? true : false }",
    typeObjectStatus: "{= ${/type} === 'ObjectStatus' ? true : false }",
    typeObjectNumber: "{= ${/type} === 'ObjectNumber' ? true : false }",
    typeDateTimePicker: "{= ${/type} === 'DateTimePicker' ? true : false }",
    typeDateOrDateTimePicker: "{= ${/type} === 'DatePicker' || ${/type} === 'DateTimePicker' ? true : false }",

    typeValueHelp: "{= ${/type} === 'ValueHelp'  ? true : false }",

    typeLinkFixed: "{= ${/type} === 'Link' && ${/linkHrefType} === 'Fixed' ? true : false }",
    typeLinkRule: "{= ${/type} === 'Link' && ${/linkHrefType} === 'Rule' ? true : false }",
    typeLinkBinding: "{= ${/type} === 'Link' && ${/linkHrefType} === 'Binding' ? true : false }",
    typeLinkLookup: "{= ${/type} === 'Link' && ${/linkHrefType} === 'Lookup'  ? true : false }",

    typeObjectStatusIconTypeFixed: "{= (${/type} === 'ObjectStatus' || ${/type} === 'Button') && ${/statusIconType} === 'Fixed' ? true : false }",
    typeObjectStatusIconTypeRule: "{= (${/type} === 'ObjectStatus' || ${/type} === 'Button') && ${/statusIconType} === 'Rule' ? true : false }",
    typeObjectStatusIconTypeBinding: "{= (${/type} === 'ObjectStatus' || ${/type} === 'Button') && ${/statusIconType} === 'Binding' ? true : false }",
    typeObjectStatusIconTypeLookup: "{= (${/type} === 'ObjectStatus' || ${/type} === 'Button') && ${/statusIconType} === 'Lookup'  ? true : false }",

    typeObjectStatusTitleTypeFixed: "{= ${/type} === 'ObjectStatus' && ${/statusTitleType} === 'Fixed'? true : false }",
    typeObjectStatusTitleTypeRule: "{= ${/type} === 'ObjectStatus' && ${/statusTitleType} === 'Rule'? true : false }",
    typeObjectStatusTitleTypeBinding: "{= ${/type} === 'ObjectStatus' && ${/statusTitleType} === 'Binding'? true : false }",
    typeObjectStatusTitleTypeLookup: "{= ${/type} === 'ObjectStatus' && ${/statusTitleType} === 'Lookup'? true : false }",

    typeObjectStatusStateTypeFixed: "{= ${/type} === 'ObjectStatus' && ${/statusStateType} === 'Fixed' ? true : false }",
    typeObjectStatusStateTypeRule: "{= ${/type} === 'ObjectStatus' && ${/statusStateType} === 'Rule'? true : false }",
    typeObjectStatusStateTypeBinding: "{= ${/type} === 'ObjectStatus' && ${/statusStateType} === 'Binding'? true : false }",
    typeObjectStatusStateTypeLookup: "{= ${/type} === 'ObjectStatus' && ${/statusStateType} === 'Lookup'? true : false }",

    typeObjectStatusNumberUnitTypeFixed: "{= ${/type} === 'ObjectNumber' && ${/numberUnitType} === 'Fixed'? true : false }",
    typeObjectStatusNumberUnitTypeRule: "{= ${/type} === 'ObjectNumber' && ${/numberUnitType} === 'Rule'? true : false }",
    typeObjectStatusNumberUnitTypeBinding: "{= ${/type} === 'ObjectNumber' && ${/numberUnitType} === 'Binding'? true : false }",
    typeObjectStatusNumberUnitTypeLookup: "{= ${/type} === 'ObjectNumber' && ${/numberUnitType} === 'Lookup'? true : false }",

    typeObjectStatusNumberStateTypeFixed: "{= ${/type} === 'ObjectNumber' && ${/numberStateType} === 'Fixed'? true : false }",
    typeObjectStatusNumberStateTypeRule: "{= ${/type} === 'ObjectNumber' && ${/numberStateType} === 'Rule'? true : false }",
    typeObjectStatusNumberStateTypeBinding: "{= ${/type} === 'ObjectNumber' && ${/numberStateType} === 'Binding'? true : false }",
    typeObjectStatusNumberStateTypeLookup: "{= ${/type} === 'ObjectNumber' && ${/numberStateType} === 'Lookup'? true : false }",

    placeholder:
        "{= ${/type} === 'DatePicker' || ${/type} === 'DateTimePicker' || ${/type} === 'Input' || ${/type} === 'MultiSelectLookup' || ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectLookup' || ${/type} === 'SingleSelectScript'  ? true : false }",
    editable:
        "{= ${/type} === 'CheckBox' || ${/type} === 'DatePicker' || ${/type} === 'Input' || ${/type} === 'MultiSelectLookup' || ${/type} === 'MultiSelectScript' || ${/type} === 'SingleSelectLookup' || ${/type} === 'SingleSelectScript' || ${/type} === 'Switch' ? true : false}",
};

const metadata = {
    properties: {
        docLink: "https://community.neptune-software.com/documentation/adaptive-template-list",
        enableForm: true,
        formUsage: "INPUT",
        enableTable: true,
        tableUsage: "OUTPUT",
        titleForm: "Filter",
        titleTable: "Table",
        iconForm: "/public/icons/s_b_filt.gif",
        iconTable: "/public/icons/s_wdvtlc.gif",

        report: {
            titleGeneral: { type: "Title", label: "General" },
            title: { type: "Input", label: "Title", translate: true },
            subTitle: { type: "Input", label: "Sub Title", translate: true },

            avatarIcon: { type: "Icon", label: "Icon" },
            avatarBackgroundColor: {
                type: "SingleSelect",
                label: "Icon Color",
                items: valuesToKeyText(["", "Accent1", "Accent2", "Accent3", "Accent4", "Accent5", "Accent6", "Accent7", "Accent8", "Accent9", "Accent10", "Random"]),
            },
            showIcon: { type: "CheckBox", label: "Icon Visible", default: true },
            actionButtonLeft: { type: "CheckBox", label: "Action Button Left", default: false },

            titleNavigation: { type: "Title", label: "Event" },
            navigationCreate: {
                type: "Navigation",
                label: "Create",
                visible: vb.reportEnableCreate,
            },
            navigationItemPress: { type: "Navigation", label: "ItemPress" },
            navigationMultiSelect: {
                type: "Navigation",
                label: "MultiSelect",
                visible: vb.reportEnableMultiSelect,
            },

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

            titleButtonCreate: {
                type: "Title",
                label: "Button Create",
                visible: vb.reportEnableCreate,
            },
            iconButtonCreate: {
                type: "Icon",
                label: "Icon",
                default: "",
                visible: vb.reportEnableCreate,
            },
            textButtonCreate: {
                type: "Input",
                label: "Text",
                default: "Create",
                translate: true,
                visible: vb.reportEnableCreate,
            },
            typeButtonCreate: {
                type: "SingleSelect",
                label: "Type",
                default: "Emphasized",
                visible: vb.reportEnableCreate,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonExport: {
                type: "Title",
                label: "Button Export",
                visible: vb.reportEnableExport,
            },
            iconButtonExport: {
                type: "Icon",
                label: "Icon",
                default: "sap-icon://excel-attachment",
                visible: vb.reportEnableExport,
            },
            textButtonExport: {
                type: "Input",
                label: "Text",
                default: "",
                translate: true,
                visible: vb.reportEnableExport,
            },
            typeButtonExport: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.reportEnableExport,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonImport: {
                type: "Title",
                label: "Button Import",
                visible: vb.reportEnableImport,
            },
            iconButtonImport: {
                type: "Icon",
                label: "Icon",
                default: "sap-icon://fa-solid/file-import",
                visible: vb.reportEnableImport,
            },
            textButtonImport: {
                type: "Input",
                label: "Text",
                default: "",
                translate: true,
                visible: vb.reportEnableImport,
            },
            typeButtonImport: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.reportEnableImport,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonMultiSelect: {
                type: "Title",
                label: "Button MultiSelect",
                visible: vb.reportEnableMultiSelect,
            },
            iconButtonMultiSelect: {
                type: "Icon",
                label: "Icon",
                default: "",
                visible: vb.reportEnableMultiSelect,
            },
            textButtonMultiSelect: {
                type: "Input",
                label: "Text",
                default: "MultiSelect",
                translate: true,
                visible: vb.reportEnableMultiSelect,
            },
            typeButtonMultiSelect: {
                type: "SingleSelect",
                label: "Type",
                default: "Emphasized",
                visible: vb.reportEnableMultiSelect,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleButtonRun: { type: "Title", label: "Button Run", visible: vb.reportEnableRun },
            iconButtonRun: {
                type: "Icon",
                label: "Icon",
                default: "",
                visible: vb.reportEnableRun,
            },
            textButtonRun: {
                type: "Input",
                label: "Text",
                default: "Update",
                translate: true,
                visible: vb.reportEnableRun,
            },
            typeButtonRun: {
                type: "SingleSelect",
                label: "Type",
                default: "Emphasized",
                visible: vb.reportEnableRun,
                items: valuesToKeyText(vb.buttonTypes),
            },

            titleProperties: { type: "Title", label: "Properties" },
            enableRun: { type: "CheckBox", label: "Enable Run", default: true },
            enableCreate: { type: "CheckBox", label: "Enable Create", default: false },
            enableClose: { type: "CheckBox", label: "Enable Close", default: false },
            enableDelete: { type: "CheckBox", label: "Enable Delete", default: false },
            enableExport: { type: "CheckBox", label: "Enable Export", default: false },
            enableImport: { type: "CheckBox", label: "Enable Import", default: false },
            enableMultiSelect: { type: "CheckBox", label: "Enable MultiSelect", default: false },
            enableVariant: { type: "CheckBox", label: "Enable Variant", default: false },
            // hideHeader: { type: "CheckBox", label: "Hide Header", default: false },
            autoRun: { type: "CheckBox", label: "Run At Start", default: false },
            autoRunFocus: { type: "CheckBox", label: "Run At Focus", default: false },

            // Translation Fields
            searchLabel: {
                type: "Input",
                label: "Search Label",
                default: "Search",
                visible: false,
                translate: true,
            },
            searchPlaceholder: {
                type: "Input",
                label: "Search Placeholder",
                default: "",
                visible: false,
                translate: true,
            },
        },

        form: {
            titleProperties: { type: "Title", label: "Properties" },
            enableCompact: { type: "CheckBox", label: "Compact Mode", default: false },
            headerExpanded: { type: "CheckBox", label: "Filter Expanded", default: true },
            headerPreserveState: { type: "CheckBox", label: "Preserve Header", default: false },
        },

        table: {
            titleGeneral: { type: "Title", label: "General" },
            headerText: { type: "Input", label: "Header Text", translate: true },
            footerText: { type: "Input", label: "Footer Text", translate: true },
            noDataText: { type: "Input", label: "No Data Text", translate: true },

            titleTableGroup: { type: "Title", label: "Initial Grouping" },
            initialGroupField: { type: "TableFieldLocal", label: "Field" },
            initialGroupOrder: {
                type: "SingleSelect",
                label: "Order",
                items: distinctValuesToKeyText([
                    ["", ""],
                    ["ASC", "Ascending"],
                    ["DESC", "Descending"],
                ]),
            },

            titleTableSort: { type: "Title", label: "Initial Sorting" },
            initialSortField: { type: "TableFieldLocal", label: "Field" },
            initialSortOrder: {
                type: "SingleSelect",
                label: "Order",
                items: distinctValuesToKeyText([
                    ["", ""],
                    ["ASC", "Ascending"],
                    ["DESC", "Descending"],
                ]),
            },

            titlePagination: { type: "Title", label: "Pagination" },
            enablePagination: { type: "CheckBox", label: "Enable Pagination", default: false },
            paginationShowSelection: {
                type: "CheckBox",
                label: "Show items per page",
                default: false,
            },
            paginationRows: { type: "Input", label: "Default number of items", default: 25 },

            titlePostProcessingScript: { type: "Title", label: "Post Processing" },
            postProcessingScript: { type: "Script", label: "Script" },

            // Properties
            titleTable: { type: "Title", label: "Properties" },
            showSeparators: {
                type: "SingleSelect",
                label: "Show Separators",
                default: "All",
                items: valuesToKeyText(["All", "Inner", "None"]),
            },
            alternateRowColors: { type: "CheckBox", label: "Alternate Row Colors", default: false },
            fixedLayout: { type: "CheckBox", label: "Fixed Layout", default: false },
            inset: { type: "CheckBox", label: "Inset", default: false },
            enableCompact: { type: "CheckBox", label: "Compact Mode", default: false },
            enableAction1: { type: "CheckBox", label: "Enable Row Action 1", default: false },
            enableAction2: { type: "CheckBox", label: "Enable Row Action 2", default: false },
            enableAction3: { type: "CheckBox", label: "Enable Row Action 3", default: false },
            enableAction4: { type: "CheckBox", label: "Enable Row Action 4", default: false },
            enableAction5: { type: "CheckBox", label: "Enable Row Action 5", default: false },

            // Row Action 1
            titleAction1: { type: "Title", label: "Row Action 1", visible: vb.tableEnableAction1 },
            action1Text: {
                type: "Input",
                label: "Text",
                default: "",
                visible: vb.tableEnableAction1,
            },
            action1Icon: { type: "Icon", label: "Icon", visible: vb.tableEnableAction1 },
            action1Width: {
                type: "Input",
                label: "Width",
                placeholder: "Example 100px or 50%",
                visible: vb.tableEnableAction1,
            },
            action1Type: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.tableEnableAction1,
                items: valuesToKeyText(vb.buttonTypes),
            },
            action1Nav: { type: "Navigation", label: "Press", visible: vb.tableEnableAction1 },

            action1VisibleCond: {
                type: "Title",
                label: "Row Action 1 - Conditional Visibility",
                visible: vb.tableEnableAction1,
            },
            action1VisibleFieldName: {
                type: "TableFieldLocal",
                label: "Field",
                visible: vb.tableEnableAction1,
            },
            action1VisibleCondition: {
                type: "SingleSelect",
                label: "Operator",
                items: [
                    { key: "", text: "" },
                    { key: "===", text: "Equal" },
                    { key: "!==", text: "Not Equal" },
                    { key: ">=", text: "Greater and Equal to" },
                    { key: "<=", text: "Lesser and Equal to" },
                    { key: ">", text: "Greater than" },
                    { key: "<", text: "Lesser than" },
                    { key: "empty", text: "No data" },
                ],
                visible: vb.tableEnableAction1,
            },
            action1VisibleFixedValue: {
                type: "Input",
                label: "Fixed Value",
                visible: "{= ${appData>/settings/properties/table/enableAction1} && ${appData>/settings/properties/table/action1VisibleCondition} !== 'empty' ? true : false }",
            },
            action1VisibleSystemValue: {
                type: "SingleSelect",
                label: "System Variable",
                items: distinctValuesToKeyText([
                    ["", ""],
                    ["UserName", "UserName"],
                ]),
                visible: "{= ${appData>/settings/properties/table/enableAction1} && ${appData>/settings/properties/table/action1VisibleCondition} !== 'empty' ? true : false }",
            },
            action1VisibleInverse: {
                type: "CheckBox",
                label: "Hide instead of show",
                visible: vb.tableEnableAction1,
            },

            // Row Action 2
            titleAction2: { type: "Title", label: "Row Action 2", visible: vb.tableEnableAction2 },
            action2Text: {
                type: "Input",
                label: "Text",
                default: "",
                visible: vb.tableEnableAction2,
            },
            action2Icon: { type: "Icon", label: "Icon", visible: vb.tableEnableAction2 },
            action2Width: {
                type: "Input",
                label: "Width",
                placeholder: "Example 100px or 50%",
                visible: vb.tableEnableAction2,
            },
            action2Type: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.tableEnableAction2,
                items: valuesToKeyText(vb.buttonTypes),
            },
            action2Nav: { type: "Navigation", label: "Press", visible: vb.tableEnableAction2 },

            action2VisibleCond: {
                type: "Title",
                label: "Row Action 2 - Conditional Visibility",
                visible: vb.tableEnableAction2,
            },
            action2VisibleFieldName: {
                type: "TableFieldLocal",
                label: "Field",
                visible: vb.tableEnableAction2,
            },
            action2VisibleCondition: {
                type: "SingleSelect",
                label: "Operator",
                items: [
                    { key: "", text: "" },
                    { key: "===", text: "Equal" },
                    { key: "!==", text: "Not Equal" },
                    { key: ">=", text: "Greater and Equal to" },
                    { key: "<=", text: "Lesser and Equal to" },
                    { key: ">", text: "Greater than" },
                    { key: "<", text: "Lesser than" },
                    { key: "empty", text: "No data" },
                ],
                visible: vb.tableEnableAction2,
            },
            action2VisibleFixedValue: {
                type: "Input",
                label: "Fixed Value",
                visible: "{= ${appData>/settings/properties/table/enableAction2} && ${appData>/settings/properties/table/action2VisibleCondition} !== 'empty' ? true : false }",
            },
            action2VisibleSystemValue: {
                type: "SingleSelect",
                label: "System Variable",
                items: valuesToKeyText(["", "UserName"]),
                visible: "{= ${appData>/settings/properties/table/enableAction2} && ${appData>/settings/properties/table/action2VisibleCondition} !== 'empty' ? true : false }",
            },
            action2VisibleInverse: {
                type: "CheckBox",
                label: "Hide instead of show",
                visible: vb.tableEnableAction2,
            },

            // Row Action 3
            titleAction3: { type: "Title", label: "Row Action 3", visible: vb.tableEnableAction3 },
            action3Text: {
                type: "Input",
                label: "Text",
                default: "",
                visible: vb.tableEnableAction3,
            },
            action3Icon: { type: "Icon", label: "Icon", visible: vb.tableEnableAction3 },
            action3Width: {
                type: "Input",
                label: "Width",
                placeholder: "Example 100px or 50%",
                visible: vb.tableEnableAction3,
            },
            action3Type: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.tableEnableAction3,
                items: valuesToKeyText(vb.buttonTypes),
            },
            action3Nav: { type: "Navigation", label: "Press", visible: vb.tableEnableAction3 },

            action3VisibleCond: {
                type: "Title",
                label: "Row Action 3 - Conditional Visibility",
                visible: vb.tableEnableAction3,
            },
            action3VisibleFieldName: {
                type: "TableFieldLocal",
                label: "Field",
                visible: vb.tableEnableAction3,
            },
            action3VisibleCondition: {
                type: "SingleSelect",
                label: "Operator",
                items: [
                    { key: "", text: "" },
                    { key: "===", text: "Equal" },
                    { key: "!==", text: "Not Equal" },
                    { key: ">=", text: "Greater and Equal to" },
                    { key: "<=", text: "Lesser and Equal to" },
                    { key: ">", text: "Greater than" },
                    { key: "<", text: "Lesser than" },
                    { key: "empty", text: "No data" },
                ],
                visible: vb.tableEnableAction3,
            },
            action3VisibleFixedValue: {
                type: "Input",
                label: "Fixed Value",
                visible: "{= ${appData>/settings/properties/table/enableAction3} && ${appData>/settings/properties/table/action3VisibleCondition} !== 'empty' ? true : false }",
            },
            action3VisibleSystemValue: {
                type: "SingleSelect",
                label: "System Variable",
                items: valuesToKeyText(["", "UserName"]),
                visible: "{= ${appData>/settings/properties/table/enableAction3} && ${appData>/settings/properties/table/action3VisibleCondition} !== 'empty' ? true : false }",
            },
            action3VisibleInverse: {
                type: "CheckBox",
                label: "Hide instead of show",
                visible: vb.tableEnableAction3,
            },

            // Row Action 4
            titleAction4: { type: "Title", label: "Row Action 4", visible: vb.tableEnableAction4 },
            action4Text: {
                type: "Input",
                label: "Text",
                default: "",
                visible: vb.tableEnableAction4,
            },
            action4Icon: { type: "Icon", label: "Icon", visible: vb.tableEnableAction4 },
            action4Width: {
                type: "Input",
                label: "Width",
                placeholder: "Example 100px or 50%",
                visible: vb.tableEnableAction4,
            },
            action4Type: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.tableEnableAction4,
                items: valuesToKeyText(vb.buttonTypes),
            },
            action4Nav: { type: "Navigation", label: "Press", visible: vb.tableEnableAction4 },

            action4VisibleCond: {
                type: "Title",
                label: "Row Action 4 - Conditional Visibility",
                visible: vb.tableEnableAction4,
            },
            action4VisibleFieldName: {
                type: "TableFieldLocal",
                label: "Field",
                visible: vb.tableEnableAction4,
            },
            action4VisibleCondition: {
                type: "SingleSelect",
                label: "Operator",
                items: [
                    { key: "", text: "" },
                    { key: "===", text: "Equal" },
                    { key: "!==", text: "Not Equal" },
                    { key: ">=", text: "Greater and Equal to" },
                    { key: "<=", text: "Lesser and Equal to" },
                    { key: ">", text: "Greater than" },
                    { key: "<", text: "Lesser than" },
                    { key: "empty", text: "No data" },
                ],
                visible: vb.tableEnableAction4,
            },
            action4VisibleFixedValue: {
                type: "Input",
                label: "Fixed Value",
                visible: "{= ${appData>/settings/properties/table/enableAction4} && ${appData>/settings/properties/table/action4VisibleCondition} !== 'empty' ? true : false }",
            },
            action4VisibleSystemValue: {
                type: "SingleSelect",
                label: "System Variable",
                items: valuesToKeyText(["", "UserName"]),
                visible: "{= ${appData>/settings/properties/table/enableAction4} && ${appData>/settings/properties/table/action4VisibleCondition} !== 'empty' ? true : false }",
            },
            action4VisibleInverse: {
                type: "CheckBox",
                label: "Hide instead of show",
                visible: vb.tableEnableAction4,
            },

            // Row Action 5
            titleAction5: { type: "Title", label: "Row Action 5", visible: vb.tableEnableAction5 },
            action5Text: {
                type: "Input",
                label: "Text",
                default: "",
                visible: vb.tableEnableAction5,
            },
            action5Icon: { type: "Icon", label: "Icon", visible: vb.tableEnableAction5 },
            action5Width: {
                type: "Input",
                label: "Width",
                placeholder: "Example 100px or 50%",
                visible: vb.tableEnableAction5,
            },
            action5Type: {
                type: "SingleSelect",
                label: "Type",
                default: "Transparent",
                visible: vb.tableEnableAction5,
                items: valuesToKeyText(vb.buttonTypes),
            },
            action5Nav: { type: "Navigation", label: "Press", visible: vb.tableEnableAction5 },

            action5VisibleCond: {
                type: "Title",
                label: "Row Action 5 - Conditional Visibility",
                visible: vb.tableEnableAction5,
            },
            action5VisibleFieldName: {
                type: "TableFieldLocal",
                label: "Field",
                visible: vb.tableEnableAction5,
            },
            action5VisibleCondition: {
                type: "SingleSelect",
                label: "Operator",
                items: [
                    { key: "", text: "" },
                    { key: "===", text: "Equal" },
                    { key: "!==", text: "Not Equal" },
                    { key: ">=", text: "Greater and Equal to" },
                    { key: "<=", text: "Lesser and Equal to" },
                    { key: ">", text: "Greater than" },
                    { key: "<", text: "Lesser than" },
                    { key: "empty", text: "No data" },
                ],
                visible: vb.tableEnableAction5,
            },
            action5VisibleFixedValue: {
                type: "Input",
                label: "Fixed Value",
                visible: "{= ${appData>/settings/properties/table/enableAction5} && ${appData>/settings/properties/table/action5VisibleCondition} !== 'empty' ? true : false }",
            },
            action5VisibleSystemValue: {
                type: "SingleSelect",
                label: "System Variable",
                items: valuesToKeyText(["", "UserName"]),
                visible: "{= ${appData>/settings/properties/table/enableAction5} && ${appData>/settings/properties/table/action5VisibleCondition} !== 'empty' ? true : false }",
            },
            action5VisibleInverse: {
                type: "CheckBox",
                label: "Inverse Logic",
                visible: vb.tableEnableAction5,
            },
        },
    },

    fieldsSel: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Type",
            items: valuesToKeyText([
                "Input",
                "CheckBox",
                "DateRange",
                "MultiSelect",
                "MultiSelectLookup",
                "MultiSelectScript",
                "SingleSelect",
                "SingleSelectLookup",
                "SingleSelectScript",
                "Switch",
                "ValueHelp",
                "ValueHelpOData",
            ]),
        },

        titleLookup: {
            type: "Title",
            label: "Data Source",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupTable: { type: "Table", label: "Table", visible: vb.typeMultiOrSingleSelectLookup },
        lookupFieldKey: {
            type: "TableField",
            label: "Key Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupFieldText: {
            type: "TableField",
            label: "Text Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupFieldAdditional: {
            type: "TableField",
            label: "Additional Text Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupShowOnlyText: {
            type: "CheckBox",
            label: "Hide Key Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },

        titleValueHelp: { type: "Title", label: "ValueHelp Source", visible: vb.typeValueHelp },
        valueRequestKey: { type: "Input", label: "Field to Return", visible: vb.typeValueHelp },
        navigation: { type: "Navigation", label: "Open", visible: vb.typeValueHelp },

        titleSelectScript: {
            type: "Title",
            label: "Data Source",
            visible: vb.typeMultiOrSingleSelectScript,
        },
        scriptSelect: {
            type: "Script",
            label: "Server Script",
            visible: vb.typeMultiOrSingleSelectScript,
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

        titleSettings: { type: "Title", label: "Properties" },
        selEqual: { type: "CheckBox", label: "Strict Search", visible: "{= ${/type} === 'Input' || ! ${/type} || ${/type} === 'ValueHelp' ? true : false }" },
        required: { type: "CheckBox", label: "Required", default: false },
        visible: { type: "CheckBox", label: "Visible", default: true },
    },

    fieldsRun: {
        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Type",
            items: valuesToKeyText([
                "|Text",
                "Button",
                "CheckBox",
                "DatePicker",
                "DateTimePicker",
                "ExpandableText",
                "Icon",
                "Input",
                "Image",
                "Link",
                "MultiSelectLookup",
                "MultiSelectScript",
                "ObjectNumber",
                "ObjectStatus",
                "SingleSelectLookup",
                "SingleSelectScript",
                "Switch",
                "StepInput",
            ]),
        },

        inputType: {
            type: "SingleSelect",
            label: "Input Type",
            visible: "{= ${/type} === 'Input' ? true : false }",
            items: valuesToKeyText(["", "Email", "Number", "Password", "Tel", "Text", "Url"]),
        },

        expandableTextPopover: {
            type: "CheckBox",
            label: "Show text in popover",
            visible: "{= ${/type} === 'ExpandableText' ? true : false }",
        },

        statusInverted: { type: "CheckBox", label: "Inverted", visible: "{= ${/type} === 'ObjectStatus' || ${/type} === 'ObjectNumber' ? true : false }" },

        stepInputTextAlign: {
            type: "SingleSelect",
            label: "TextAlign",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
            items: valuesToKeyText(["", "Begin", "Center", "End", "Initial", "Left", "Right"]),
        },

        buttonType: {
            type: "SingleSelect",
            label: "Button Type",
            default: "Transparent",
            visible: vb.typeButton,
            items: valuesToKeyText(vb.buttonTypes),
        },

        titleNavigation: { type: "Title", label: "Event", visible: vb.typeEvents },
        navigation: { type: "Navigation", label: "Press", visible: vb.typeEvents },

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
                ["Script", "Script (from post processing)"],
            ]),
        },
        valueFixed: { type: "Input", label: "Fixed Value", visible: vb.typeFixed },
        valueLookup: { type: "Lookup", label: "Lookup", visible: vb.typeLookup },
        valueRule: { type: "Rule", label: "Rules Engine", visible: vb.typeRule },

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

        displayFormat: {
            type: "Input",
            label: "Date Format",
            visible: vb.typeDateOrDateTimePicker,
        },

        titleLookup: {
            type: "Title",
            label: "Data Source",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupTable: { type: "Table", label: "Table", visible: vb.typeMultiOrSingleSelectLookup },
        lookupFieldKey: {
            type: "TableField",
            label: "Key Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupFieldText: {
            type: "TableField",
            label: "Text Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupFieldAdditional: {
            type: "TableField",
            label: "Additional Text Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },
        lookupShowOnlyText: {
            type: "CheckBox",
            label: "Hide Key Field",
            visible: vb.typeMultiOrSingleSelectLookup,
        },

        titleSelectScript: {
            type: "Title",
            label: "Data Source",
            visible: vb.typeMultiOrSingleSelectScript,
        },
        scriptSelect: {
            type: "Script",
            label: "Server Script",
            visible: vb.typeMultiOrSingleSelectScript,
        },

        // StepInput - Min
        titleStepInputMin: {
            type: "Title",
            label: "Min",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
        },

        stepInputMinType: {
            type: "SingleSelect",
            label: "Source",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
            ]),
        },

        stepInputMinFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMinType} === 'Fixed' ? true : false }",
        },

        stepInputMinRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMinType} === 'Rule' ? true : false }",
        },

        stepInputMinBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMinType} === 'Binding' ? true : false }",
        },

        stepInputMinLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMinType} === 'Lookup' ? true : false }",
        },

        // StepInput - Max
        titleStepInputMax: {
            type: "Title",
            label: "Max",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
        },

        stepInputMaxType: {
            type: "SingleSelect",
            label: "Source",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
            ]),
        },

        stepInputMaxFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMaxType} === 'Fixed' ? true : false }",
        },

        stepInputMaxRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMaxType} === 'Rule' ? true : false }",
        },

        stepInputMaxBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMaxType} === 'Binding' ? true : false }",
        },

        stepInputMaxLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputMaxType} === 'Lookup' ? true : false }",
        },

        // StepInput - Step
        titleStepInputStep: {
            type: "Title",
            label: "Step",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
        },

        stepInputStepType: {
            type: "SingleSelect",
            label: "Source",
            visible: "{= ${/type} === 'StepInput' ? true : false }",
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
            ]),
        },

        stepInputStepFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputStepType} === 'Fixed' ? true : false }",
        },

        stepInputStepRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputStepType} === 'Rule' ? true : false }",
        },

        stepInputStepBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputStepType} === 'Binding' ? true : false }",
        },

        stepInputStepLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: "{= ${/type} === 'StepInput'  && ${/stepInputStepType} === 'Lookup' ? true : false }",
        },

        // Link - Href
        titleLinkHref: { type: "Title", label: "Value: URL", visible: vb.typeLink },
        linkHrefType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeLink,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        linkHrefFixed: { type: "Input", label: "Fixed Value", visible: vb.typeLinkFixed },
        linkHrefRule: { type: "Rule", label: "Rules Engine", visible: vb.typeLinkRule },
        linkHrefBinding: { type: "TableFieldLocal", label: "Binding", visible: vb.typeLinkBinding },
        linkHrefLookup: { type: "Lookup", label: "Lookup Value", visible: vb.typeLinkLookup },

        // ObjectStatus - Icon
        titleStatusIcon: { type: "Title", label: "Value: Icon", visible: vb.typeObjectAllowIcon },
        statusIconType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeObjectAllowIcon,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        statusIconFixed: {
            type: "Icon",
            label: "Fixed Value",
            visible: vb.typeObjectStatusIconTypeFixed,
        },
        statusIconRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: vb.typeObjectStatusIconTypeRule,
        },
        statusIconBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: vb.typeObjectStatusIconTypeBinding,
        },
        statusIconLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: vb.typeObjectStatusIconTypeLookup,
        },

        // ObjectStatus - Title
        titleStatusTitle: { type: "Title", label: "Value: Title", visible: vb.typeObjectStatus },
        statusTitleType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeObjectStatus,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        statusTitleFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: vb.typeObjectStatusTitleTypeFixed,
        },
        statusTitleRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: vb.typeObjectStatusTitleTypeRule,
        },
        statusTitleBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: vb.typeObjectStatusTitleTypeBinding,
        },
        statusTitleLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: vb.typeObjectStatusTitleTypeLookup,
        },
        statusTitleFormatter: {
            type: "SingleSelect",
            label: "Formatter",
            visible: vb.typeObjectStatus,
            items: distinctValuesToKeyText([
                ["", ""],
                ["date00", "Date Browser Format"],
                ["date01", "Date (dd.mm.yyyy)"],
                ["date02", "Date (mm-dd-yyyy)"],
                ["date03", "Date (Month)"],
                ["date04", "Date (Quarter)"],
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

        // ObjectStatus - State
        titleStatusState: { type: "Title", label: "Value: State", visible: vb.typeObjectStatus },
        statusStateType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeObjectStatus,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        statusStateFixed: {
            type: "SingleSelect",
            label: "Fixed Value",
            visible: vb.typeObjectStatusStateTypeFixed,
            items: valuesToKeyText([
                "",
                "None",
                "Error",
                "Warning",
                "Success",
                "Information",
                "Indication01",
                "Indication02",
                "Indication03",
                "Indication04",
                "Indication05",
                "Indication06",
                "Indication07",
                "Indication08",
            ]),
        },
        statusStateRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: vb.typeObjectStatusStateTypeRule,
        },
        statusStateBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: vb.typeObjectStatusStateTypeBinding,
        },
        statusStateLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: vb.typeObjectStatusStateTypeLookup,
        },

        // ObjectNumber - Unit
        titleNumberUnit: { type: "Title", label: "Value: Unit", visible: vb.typeObjectNumber },
        numberUnitType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeObjectNumber,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        numberUnitFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: vb.typeObjectStatusNumberUnitTypeFixed,
        },
        numberUnitRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: vb.typeObjectStatusNumberUnitTypeRule,
        },
        numberUnitBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: vb.typeObjectStatusNumberUnitTypeBinding,
        },
        numberUnitLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: vb.typeObjectStatusNumberUnitTypeLookup,
        },
        numberUnitFormatter: {
            type: "SingleSelect",
            label: "Formatter",
            visible: vb.typeObjectNumber,
            items: distinctValuesToKeyText([
                ["", ""],
                ["date00", "Date Browser Format"],
                ["date01", "Date (dd.mm.yyyy)"],
                ["date02", "Date (mm-dd-yyyy)"],
                ["date03", "Date (Month)"],
                ["date04", "Date (Quarter)"],
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

        // ObjectNumber - State
        titleNumberState: { type: "Title", label: "Value: State", visible: vb.typeObjectNumber },
        numberStateType: {
            type: "SingleSelect",
            label: "Source",
            visible: vb.typeObjectNumber,
            items: distinctValuesToKeyText([
                ["", ""],
                ["Binding", "Binding"],
                ["Fixed", "Fixed Value"],
                ["Lookup", "Lookup"],
                ["Rule", "Rules Engine"],
                ["Script", "Script (from post processing)"],
            ]),
        },
        numberStateFixed: {
            type: "Input",
            label: "Fixed Value",
            visible: vb.typeObjectStatusNumberStateTypeFixed,
        },
        numberStateRule: {
            type: "Rule",
            label: "Rules Engine",
            visible: vb.typeObjectStatusNumberStateTypeRule,
        },
        numberStateBinding: {
            type: "TableFieldLocal",
            label: "Binding",
            visible: vb.typeObjectStatusNumberStateTypeBinding,
        },
        numberStateLookup: {
            type: "Lookup",
            label: "Lookup Value",
            visible: vb.typeObjectStatusNumberStateTypeLookup,
        },

        // Layout
        titleLayout: { type: "Title", label: "Layout" },
        hAlign: {
            type: "SingleSelect",
            label: "Horizontal Align",
            items: valuesToKeyText(["", "Begin", "Center", "End", "Initial", "Left", "Right"]),
        },
        vAlign: {
            type: "SingleSelect",
            label: "Vertical Align",
            items: valuesToKeyText(["", "Bottom", "Inherit", "Middle", "Top"]),
        },
        minScreenWidth: {
            type: "SingleSelect",
            label: "MinScreenSize",
            items: [
                { key: "", text: "" },
                { key: "2560px", text: "2560px" },
                { key: "2240px", text: "2240px" },
                { key: "1920px", text: "1920px" },
                { key: "1680px", text: "1680px" },
                { key: "1536px", text: "1536px" },
                { key: "1440px", text: "1440px" },
                { key: "1280px", text: "1280px" },
                { key: "XXLarge", text: "1120px" },
                { key: "Desktop", text: "1024px" },
                { key: "XLarge", text: "960px" },
                { key: "Tablet", text: "600px" },
                { key: "Medium", text: "560px" },
                { key: "Small", text: "480px" },
                { key: "XSmall", text: "320px" },
                { key: "Phone", text: "240px" },
                { key: "XXSmall", text: "240px" },
            ],
        },

        demandPopin: { type: "CheckBox", label: "Demand Popin" },
        popinDisplay: {
            type: "SingleSelect",
            label: "Popin Display",
            default: "Block",
            items: [
                { key: "Block", text: "Block" },
                { key: "Inline", text: "Inline" },
            ],
        },

        placeholder: { type: "Input", label: "Placeholder", visible: vb.placeholder },
        dateTimePickerMinutesStep: {
            type: "Input",
            label: "Step Minutes",
            visible: vb.typeDateTimePicker,
        },
        dateTimePickerSecondsStep: {
            type: "Input",
            label: "Step Seconds",
            visible: vb.typeDateTimePicker,
        },
        width: { type: "Input", label: "Width", placeholder: "Example 100px or 50%" },
        wrapping: { type: "CheckBox", label: "Wrapping", default: false },

        titleSettings: { type: "Title", label: "Properties" },
        editable: { type: "CheckBox", label: "Editable", default: false, visible: vb.editable },
        enableGroup: { type: "CheckBox", label: "Grouping", default: false },
        enableFilter: { type: "CheckBox", label: "Search", default: true },
        enableSort: { type: "CheckBox", label: "Sorting", default: true },
        enableSum: { type: "CheckBox", label: "Sum", default: false, visible: vb.typeObjectNumber },
        visible: { type: "CheckBox", label: "Visible", default: true },
    },
};
