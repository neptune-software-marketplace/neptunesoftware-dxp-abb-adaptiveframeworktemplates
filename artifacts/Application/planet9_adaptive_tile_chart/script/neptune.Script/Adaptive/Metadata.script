const metadata = {

    properties: {

        enableForm: true,
        formUsage: 'INPUT',
        enableTable: true,
        tableUsage: 'OUTPUT',
        titleForm: "Filter",
        titleTable: "Chart",
        iconForm: "/public/icons/s_b_filt.gif",
        iconTable: "/public/icons/s_gisbar.gif",

        report: {

            titleTable: { type: "Title", label: "Properties" },
            paginationRows: { type: "Input", label: "Max Number of Items", default: 10 },
            updateTime: { type: "Input", label: "Update Every (Min)", default: 0 },

            titleTableGroup: { type: "Title", label: "Sorting 1" },
            initialGroupField: { type: "TableFieldLocal", label: "Field" },
            initialGroupOrder: {
                type: "SingleSelect",
                label: "Order",
                items: [
                    { key: "", text: "" },
                    { key: "ASC", text: "Ascending" },
                    { key: "DESC", text: "Descending" }
                ]
            },

            titleTableSort: { type: "Title", label: "Sorting 2" },
            initialSortField: { type: "TableFieldLocal", label: "Field" },
            initialSortOrder: {
                type: "SingleSelect",
                label: "Order",
                items: [
                    { key: "", text: "" },
                    { key: "ASC", text: "Ascending" },
                    { key: "DESC", text: "Descending" }
                ]
            },


        },

        form: {

            titleSettings: { type: "Title", label: "Properties" },
            enableCompact: { type: "CheckBox", label: "Compact Mode", default: false },
            showFilter: { type: "CheckBox", label: "Show Filter", default: false },

        },

        table: {

            titleGeneral: { type: "Title", label: "General" },
            title: { type: "Input", label: "Title" },
            subTitle: { type: "Input", label: "Sub Title" },

            titleAlign: {
                type: "SingleSelect",
                label: "Align",
                default: "center",
                items: [
                    { key: "", text: "" },
                    { key: "left", text: "Left" },
                    { key: "center", text: "Center" },
                    { key: "right", text: "Right" }
                ]
            },

            chartHeight: { type: "Input", label: "Chart Height", default: 250 },

            chartType: {
                type: "SingleSelect",
                label: "Type",
                default: "column",
                items: [
                    { key: "", text: "" },
                    { key: "area", text: "Area" },
                    { key: "arearange", text: "Area Range" },
                    { key: "areaspline", text: "Area Spline" },
                    { key: "areapercent", text: "Area Percent" },
                    { key: "bar", text: "Bar" },
                    { key: "barpercent", text: "Bar Percent" },
                    { key: "barstacked", text: "Bar Stacked" },
                    { key: "column", text: "Column" },
                    { key: "columnpercent", text: "Column Percent" },
                    { key: "columnstacked", text: "Column Stacked" },
                    { key: "line", text: "Line" },
                    { key: "spline", text: "Spline" },
                    { key: "pie", text: "Pie" },
                ]
            },

            enableSorting: { type: "CheckBox", label: "Sort by Value", default: false },

            titleLayout: { type: "Title", label: "Layout" },
            chartColor: { type: "Input", label: "Custom Colors" },
            enableMonochrome: { type: "CheckBox", label: "Enable Monochrome", default: false },
            colorMonochrome: { type: "Input", label: "Monochrome Color", placeholder: "Start color for monochrome calculation" },
            brightenMonochrome: { type: "Input", label: "Brighten Factor", placeholder: "Default 0.1" },
            lineWidth: { type: "Input", label: "Plot Line Width", placeholder: "Number, default 2" },
            pieInnerSize: { type: "Input", label: "Pie Inner Size", placeholder: "The size of the inner diameter for the pie", default: 0, },

            title3D: { type: "Title", label: "3D" },
            enable3D: { type: "CheckBox", label: "Enable 3D", default: false },
            alpha3D: { type: "Input", label: "Alpha", placeholder: "One of the two rotation angles for the chart", default: 0 },
            beta3D: { type: "Input", label: "Beta", placeholder: "One of the two rotation angles for the chart", default: 0 },
            depth3D: { type: "Input", label: "Depth", placeholder: "The total depth of the chart", default: 100 },

            titleLegend: { type: "Title", label: "Legend" },
            legendEnable: { type: "CheckBox", label: "Show Legend", default: true },
            legendAlign: {
                type: "SingleSelect",
                label: "Align",
                default: "center",
                items: [
                    { key: "center", text: "Center" },
                    { key: "left", text: "Left" },
                    { key: "right", text: "Right" }
                ]
            },

            legendVerticalAlign: {
                type: "SingleSelect",
                label: "Vertical Align",
                default: "bottom",
                items: [
                    { key: "bottom", text: "Bottom" },
                    { key: "middle", text: "Middle" },
                    { key: "top", text: "Top" },
                ]
            },

            legendLayout: {
                type: "SingleSelect",
                label: "Layout",
                default: "horizontal",
                items: [
                    { key: "horizontal", text: "Horizontal" },
                    { key: "vertical", text: "Vertical" },
                    { key: "proximate", text: "Proximate" },
                ]
            },

            titleXAxis: { type: "Title", label: "xAxis" },
            xAxisTitleEnable: { type: "CheckBox", label: "Show Title", default: true },
            xAxisReversed: { type: "CheckBox", label: "Reversed", default: false },
            xAxisStartOnTick: { type: "CheckBox", label: "Start On Tick", default: true },
            xAxisGridLineWidth: { type: "Input", label: "Grid Line Width", default: 0 },
            xAxisGridLineColor: { type: "Input", label: "Grid Line Color", placeholder: "#e6e6e6" },

            titleYAxis: { type: "Title", label: "yAxis" },
            yAxisTitleEnable: { type: "CheckBox", label: "Show Title", default: true },
            yAxisReversed: { type: "CheckBox", label: "Reversed", default: false },
            yAxisStartOnTick: { type: "CheckBox", label: "Start On Tick", default: true },
            yAxisGridLineWidth: { type: "Input", label: "Grid Line Width", default: 1 },
            yAxisGridLineColor: { type: "Input", label: "Grid Line Color", placeholder: "#e6e6e6" },

            titlePostProcessingScript: { type: "Title", label: "Post Processing" },
            postProcessingScript: { type: "Script", label: "Script" },

        }

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
            ]
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
        default: { type: "Input", label: "Fixed Value" },
        sysvarValue: {
            type: 'SingleSelect', label: 'System Variable', items: [
                { key: "", text: "" },
                { key: "UserName", text: "UserName" }
            ]
        },
        scriptValue: { type: "Script", label: "Script Value" },

        titleSettings: { type: "Title", label: "Properties" },
        required: { type: "CheckBox", label: "Required", default: false },
        visible: { type: "CheckBox", label: "Visible", default: true }

    },

    fieldsRun: {

        titleGeneral: { type: "Title", label: "General" },
        text: { type: "Input", label: "Label" },
        type: {
            type: "SingleSelect",
            label: "Type",
            defaukt: "Data",
            items: [
                { key: "data", text: "Row" },
                { key: "category", text: "Column" },
                { key: "value", text: "Value" },
            ]
        },

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
            ]
        },
        valueFixed: { type: "Input", label: "Fixed Value", visible: "{= ${/valueType} === 'Fixed' ? true: false }" },
        valueLookup: { type: "Lookup", label: "Lookup", visible: "{= ${/valueType} === 'Lookup' ? true: false }" },
        valueRule: { type: "Rule", label: "Rules Engine", visible: "{= ${/valueType} === 'Rule' ? true: false }" },
        formatter: {
            type: "SingleSelect",
            label: "Formatter",
            items: [
                { key: "", text: "" },
                { key: "date00", text: "Date Browser Format" },
                { key: "date01", text: "Date (dd.mm.yyyy)" },
                { key: "date02", text: "Date (mm-dd-yyyy)" },
                { key: "date03", text: "Date (Month)" },
                { key: "date04", text: "Date (Quarter)" },
                { key: "sapdate01", text: "SAP Date (dd.mm.yyyy)" },
                { key: "sapdate02", text: "SAP Date (mm-dd-yyyy)" },
                { key: "zero", text: "Remove Leading Zero" },
                { key: "uppercase", text: "Upper Case" },
                { key: "lowercase", text: "Lower Case" },
            ]
        },

        titleSettings: { type: "Title", label: "Properties" },
        visible: { type: "CheckBox", label: "Visible", default: true }

    }
}
