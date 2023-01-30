const pivotGrid = {
    id: ModelData.genID(),
    data: [],
    report: null,
    variantID: null,
    lastConfig: {},
    currentConfig: {},
    initialized: false,

    // first initialize pivot HTML object, as it's delay in rendering
    // is forcing us to use setTimeout to unpredictably initialize the pivot grid
    initPivotHTMLObject: function () {
        pivotHTMLObject.setContent(`<div id="${pivotGridId}" style='width:100%; height:100%;'></div>`);
    },

    init: function () {

        if (pivotGrid.initialized) {
            pivotGrid.afterInit();
            return;
        }

        pivotGrid.initialized = true;

        inSetupType.setTooltip('Presentation Type');
        inSetupCalc.setTooltip('Calculation Type');
        inSetupSortCol.setTooltip('Sort Columns');
        inSetupSortRow.setTooltip('Sort Rows');

        modelinSetupType.setData(pivotGrid.dataType);
        modelinSetupCalc.setData(pivotGrid.dataCalc);
        modelDataVariant.setDefaultBindingMode('OneWay');
        modelDataPivot.setDefaultBindingMode('OneWay');

        tabFilter
            .getBinding('rows')
            .sort(new sap.ui.model.Sorter('value', false, false));

        const el = getPivotGridEl();

        $(el).pivotUI([], {
            renderers: $.extend(
                $.pivotUtilities.renderers,
                $.pivotUtilities.highchart_renderers,
            ),
            table: {
                clickCallback: function (oEvent) {
                    console.log("CALLING FROM HERE");
                },
                rowTotals: false,
                colTotals: false
            }
        });

        inGridToolsCount.setNumber(0);
        pivotGrid.afterInit();
    },

    afterInit: function () {
        const n = modelappData.oData.navigation;

        // Key Fields for GET Record 
        if (n && n.keyField && n.keyField.length) {
            n.keyField.forEach(function ({ fieldName, key, value }) {
                if (value) modelpanSelection.oData[fieldName] = value;
                if (key) modelpanSelection.oData[fieldName] = modelappData.oData.data[key];
            });
        }

        // Auto Run
        if (modelappData.oData.properties.report.autoRun) pivotGrid.runReport();
    },

    loadLibrary: function (library) {
        return new Promise(function (resolve) {
            jsonRequest({
                type: 'GET',
                url: library,
                success: function (data) {
                    resolve('OK');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    resolve('ERROR');
                },
                dataType: 'script',
                cache: true,
            })
        });
    },

    buildSelectionScreen: function (dataSettings) {

        // Delete Hidden Fields
        ModelData.Delete(dataSettings.fieldsReport, 'hidden', true);

        dataSettings.fieldsReport = dataSettings.fieldsReport.sort(sort_by('text'));

        modelDataSettings.setData(dataSettings);

        // Override if no selection field is present
        const visibleFields = ModelData.Find(dataSettings.fieldsSelection, 'visible', true);
        formSelection.setVisible(visibleFields && visibleFields.length > 0);

        const { showLeftPanel, showRightPanel, enableValues } = modelappData.oData.properties.report;

        layoutSel.setResizable(showLeftPanel);
        layoutSel.setSize(showLeftPanel ? '300px' : '0px');

        layoutSetup.setResizable(showRightPanel);
        layoutSetup.setSize(showRightPanel ? '300px' : '0px');

        // Build Selection Screen Fields
        formSelection.destroyContent();

        // Show values
        tabVal.setVisible(enableValues);
        inSetupCalc.setVisible(enableValues);

        // Fields Sorting
        if (dataSettings.fieldsSelection) dataSettings.fieldsSelection.sort(sort_by('fieldPos'));

        modelpanSelection.setData({});

        // Key Fields for GET Record 
        if (modelappData.oData.navigation && modelappData.oData.navigation.keyField && modelappData.oData.navigation.keyField.length) {
            modelappData.oData.navigation.keyField.forEach(function (mapping) {
                if (mapping.value) modelpanSelection.oData[mapping.fieldName] = mapping.value;
                if (mapping.key) modelpanSelection.oData[mapping.fieldName] = modelappData.oData.data[mapping.key];
            });
        }

        dataSettings.fieldsSelection.forEach(function (field) {

            if (field.columnLabel) formSelection.addContent(new sap.ui.core.Title({ text: field.columnLabel }));

            const { type, required, name, visible } = field;
            const fieldName = `{/${name}}`;
            const fieldNameEnd = `{/${name}_end}`;

            if (field.default) {

                if (field.type === "MultiSelect" || field.type === "MultiSelectLookup" || field.type === "MultiSelectScript") {
                    if (typeof field.default === "object") {
                        modelpanSelection.oData[field.name] = field.default;
                    } else {
                        if (field.default.indexOf("[") > -1) {
                            modelpanSelection.oData[field.name] = JSON.parse(field.default);
                        } else {
                            modelpanSelection.oData[field.name] = field.default;
                        }
                    }

                } else if (field.type === "Switch" || field.type === "CheckBox") {
                    if (field.default === "true" || field.default === "1" || field.default === "X") {
                        modelpanSelection.oData[field.name] = true;
                    } else {
                        delete modelpanSelection.oData[field.name];
                    }

                } else {
                    modelpanSelection.oData[field.name] = field.default;
                }

            }

            // Values from System Variables
            if (field.sysvarValue) {

                switch (field.sysvarValue) {

                    case 'UserName':
                        if (AppCache.userInfo && AppCache.userInfo.username) {
                            modelpanSelection.oData[field.name] = AppCache.userInfo.username;
                        } else {
                            modelpanSelection.oData[field.name] = systemSettings.user.username;
                        }
                        break;

                    default:
                        break;

                }

            }

            if (field.required) delete modelpanSelection.oData[field.name + "ValueState"];

            formSelection.addContent(
                new sap.m.Label({
                    required,
                    text: report.translateFieldLabel(field, modelappData.oData),
                })
            );

            if (['MultiSelect', 'MultiSelectLookup', 'MultiSelectScript'].includes(type)) {
                const f = new sap.m.MultiComboBox(name, {
                    visible,
                    width: '100%',
                    selectedKeys: fieldName,
                    showSecondaryValues: true
                });

                field.items.sort(sort_by('text'));

                field.items.forEach(function ({ key, text, additionalText }) {
                    f.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                });

                formSelection.addContent(f);


            } else if (['SingleSelect', 'SingleSelectLookup', 'SingleSelectScript'].includes(type)) {
                const f = new sap.m.ComboBox(name, {
                    width: '100%',
                    visible,
                    selectedKey: fieldName,
                    showSecondaryValues: true
                });

                f.addItem(new sap.ui.core.Item({ key: '', text: '', }));

                field.items.sort(sort_by('text'));

                field.items.forEach(function ({ key, text, additionalText }) {
                    f.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                });

                formSelection.addContent(f);

            } else if (type === 'DateRange') {
                const f = new sap.m.DateRangeSelection(name, {
                    width: '100%',
                    visible,
                    dateValue: fieldName,
                    secondDateValue: fieldNameEnd,
                });

                formSelection.addContent(f);

            } else if (type === 'DatePicker') {
                const f = new sap.m.DatePicker(name, {
                    width: '100%',
                    visible,
                    valueFormat: "yyyyMMdd",
                    value: fieldName
                });

                formSelection.addContent(f);

            } else if (type === 'CheckBox') {
                const f = new sap.m.CheckBox(name, {
                    visible,
                    selected: fieldName
                });

                formSelection.addContent(f);

            } else if (type === 'Switch') {
                const f = new sap.m.Switch(name, {
                    visible,
                    state: fieldName
                });

                formSelection.addContent(f);

            } else {
                const f = new sap.m.Input(name, { width: '100%', visible, value: fieldName });
                formSelection.addContent(f);

            }

        });

        // Check Variant Data
        if (modelappControl.oData.enableEdit) pivotGrid.checkVariant(modelappData.oData.settings.defaultVariant);

        // Default Variant 
        modelDataVariant.setData(modelappData.oData.defaultVariant);
        pivotGrid.updateConfig(modelDataVariant.oData);
        pivotGrid.applyFieldFilter();

        // Open Dialog
        if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().open) {
            oApp.getParent().getParent().open();
            // toolGridClose.setVisible(true);
        } else {
            // toolGridClose.setVisible(false);
        }

    },

    checkVariant: function (variant) {
        // Update Fields Label
        modelDataSettings.oData.fieldsReport.forEach(function (pivotField) {
            let col = ModelData.FindFirst(variant.column, 'name', pivotField.name);
            if (col) col.text = pivotField.text;

            let row = ModelData.FindFirst(variant.row, 'name', pivotField.name);
            if (row) row.text = pivotField.text;

            let val = ModelData.FindFirst(variant.val, 'name', pivotField.name);
            if (val) val.text = pivotField.text;

        });

        // Delete Fields - Column
        variant.column.forEach(function (field) {
            let pivotField = ModelData.FindFirst(modelDataSettings.oData.fieldsReport, 'name', field.name);
            if (!pivotField) field.delete = true;
        });

        // Delete Fields - Rows
        variant.row.forEach(function (field) {
            let pivotField = ModelData.FindFirst(modelDataSettings.oData.fieldsReport, 'name', field.name);
            if (!pivotField) field.delete = true;
        });

        // Delete Fields - Value
        variant.val.forEach(function (field) {
            let pivotField = ModelData.FindFirst(modelDataSettings.oData.fieldsReport, 'name', field.name);
            if (!pivotField) field.delete = true;
        });

        ModelData.Delete(variant.column, 'delete', true);
        ModelData.Delete(variant.row, 'delete', true);
        ModelData.Delete(variant.val, 'delete', true);
    },

    isRunReportValid: function () {
        let valid = true;
        modelDataSettings.oData.fieldsSelection.forEach(function ({ type, name, required }) {

            if (!required) return;

            let ref = sap.ui.getCore().byId(name);
            if (!ref.setValueState) return;

            ref.setValueState();

            const v = modelpanSelection.oData[name];
            if (!v) {
                ref.setValueState('Error');
                valid = false;
            }

            if (type === 'MultiSelect' && v && !v.length) {
                ref.setValueState('Error');
                valid = false;
            }
        });

        return valid;
    },

    runReport: function () {
        if (!pivotGrid.isRunReportValid()) return;

        let busy = true;
        setTimeout(function () {
            if (busy) oBusyRun.open();
        }, 500);

        // Script Startparameter
        const p = modelappData.oData.properties;
        if (p && p.report.scriptparam) modelpanSelection.oData._startparam = p.report.scriptparam;

        const url = `${AppCache.Url}/api/functions/Adaptive/RunReport?report=${modelappData.oData.id}&method=List`;
        jsonRequest({
            url,
            data: JSON.stringify(modelpanSelection.oData),
            success: function (data, status, request) {

                // Error - Message from Server Script
                if (data.message && data.message.text) {
                    if (data.message.type) {
                        sap.m.MessageBox[data.message.type](data.message.text);
                    } else {
                        sap.m.MessageBox.information(data.message.text);
                    }
                    return;
                }

                // Error 
                if (data.status && data.status === "ERROR") {
                    console.log(data);
                    sap.m.MessageBox.information("Error fetching data. Please see console.log for further information");
                    return;
                }

                let dataFormatted = null;

                if (data.hasOwnProperty('result')) {
                    inGridToolsCount.setNumber(data.count);
                    dataFormatted = pivotGrid.formatter(data.result);
                } else {
                    inGridToolsCount.setNumber(data.length);
                    dataFormatted = pivotGrid.formatter(data);
                }

                modelDataPivot.setData(dataFormatted);
                pivotGrid.buildData(modelDataPivot.oData);
                pivotGrid.updateConfig(modelDataVariant.oData);

            }
        }).always(function () {
            busy = false;
            oBusyRun.close();
        });
    },

    formatter: function (data) {
        const runFields = ModelData.Find(modelappData.oData.fieldsRun, 'formatter', '', 'NE');
        if (runFields.length === 0) {
            return data;
        }

        const formatDate00 = sap.ui.core.format.DateFormat.getDateTimeInstance();
        const formatDate01 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'dd.MM.yyyy' });
        const formatDate02 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'mm-dd-yyyy' });
        const formatDate03 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'yyyy MMM' });
        const formatDate04 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'yyyy QQ' });
        const formatDate05 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'yyyy' });
        const formatDate06 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'yyyy.MM.dd' });
        const formatDate07 = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: 'yyyy-MM-dd' });

        // Formatters
        try {
            data.forEach(function (raw) {
                runFields.forEach(function ({ name, formatter }) {
                    if (['date00', 'date01', 'date02', 'date03', 'date04', 'date05', 'date06', 'date07'].includes(formatter)) {

                        // Only when string and number
                        if (typeof raw[name] === 'string' && raw[name].indexOf(":") === -1) raw[name] = parseInt(raw[name]);

                        const d = new Date(raw[name]);
                        if (formatter === 'date00') formatDate00.format(d);
                        else if (formatter === 'date01') raw[name] = formatDate01.format(d);
                        else if (formatter === 'date02') raw[name] = formatDate02.format(d);
                        else if (formatter === 'date03') raw[name] = formatDate03.format(d);
                        else if (formatter === 'date04') raw[name] = formatDate04.format(d);
                        else if (formatter === 'date05') raw[name] = formatDate05.format(d);
                        else if (formatter === 'date06') raw[name] = formatDate06.format(d);
                        else if (formatter === 'date07') raw[name] = formatDate07.format(d);
                    } else if (formatter === 'sapdate01') {
                        raw[name] = raw[name].substr(6, 2) + '.' + raw[name].substr(4, 2) + '.' + raw[name].substr(0, 4);
                    } else if (formatter === 'sapdate02') {
                        raw[name] = raw[name].substr(4, 2) + '-' + raw[name].substr(6, 2) + '-' + raw[name].substr(0, 4);
                    } else if (formatter === 'sapdate03') {
                        raw[name] = raw[name].substr(0, 4) + '.' + raw[name].substr(4, 2);
                    } else if (formatter === 'zero') {
                        raw[name] = raw[name].replace(/^0+/, '');
                    } else if (formatter === 'uppercase') {
                        raw[name] = raw[name].toUpperCase();
                    } else if (formatter === 'lowercase') {
                        raw[name] = raw[name].toLowerCase();
                    } else {
                        // Boolean 
                        if (raw[name] === true) raw[name] = 'true';
                        if (raw[name] === false) raw[name] = 'false';

                        // Number
                        if (typeof raw[name] === 'number') raw[name] = raw[name].toString();
                    }
                });
            });
        } catch (e) {
            console.log(e);
        }

        return data;
    },

    buildPivot: function () {
        pivotGrid.currentConfig.onRefresh = function (config) {
            const currentConfig = JSON.parse(JSON.stringify(config));
            delete currentConfig['aggregators'];
            delete currentConfig['renderers'];
            delete currentConfig['rendererOptions'];
            delete currentConfig['localeStrings'];
            pivotGrid.currentConfig = currentConfig;
        }

        if (pivotGrid.initialized) {

            const el = getPivotGridEl();

            pivotGrid.currentConfig.rendererOptions = {
                table: {
                    colTotals: modelappData.oData.properties.table.showColTotal,
                    rowTotals: modelappData.oData.properties.table.showRowTotal
                }
            }

            $(el).pivotUI(pivotGrid.data, pivotGrid.currentConfig, true)

        }
    },

    buildData: function (dataExternal) {
        const pivotData = [];

        if (dataExternal && dataExternal.length) {

            dataExternal.forEach(function (data) {
                let keys = Object.keys(data);
                let rec = {};
                keys.forEach(function (k) {
                    let field = ModelData.FindFirst(modelDataSettings.oData.fieldsReport, 'name', k);
                    if (field) {
                        rec[field.text] = (field.valueType ? data[`${k}_value`] : data[k]);
                    } else {
                        rec[k] = data[k];
                    }
                });
                pivotData.push(rec);
            });

        }

        pivotGrid.data = pivotData;
        pivotGrid.buildPivot();
    },

    updateConfig: function (dataVariant) {
        pivotGrid.currentConfig.cols = [];
        pivotGrid.currentConfig.rows = [];
        pivotGrid.currentConfig.vals = [];

        // Columns 
        dataVariant.column.forEach(function (column) {
            pivotGrid.currentConfig.cols.push(column.text);
        });

        // Rows 
        dataVariant.row.forEach(function (row) {
            pivotGrid.currentConfig.rows.push(row.text);
        });

        // Value 
        dataVariant.val.forEach(function (row) {
            pivotGrid.currentConfig.vals.push(row.text);
        });

        pivotGrid.currentConfig.exclusions = dataVariant.exclusions;
        pivotGrid.currentConfig.inclusions = dataVariant.inclusions;

        pivotGrid.currentConfig.colOrder = dataVariant.colOrder || 'key_a_to_z';
        pivotGrid.currentConfig.rowOrder = dataVariant.rowOrder || 'key_a_to_z';

        pivotGrid.currentConfig.rendererName = dataVariant.rendererName || 'Table';
        pivotGrid.currentConfig.aggregatorName = dataVariant.aggregatorName || 'Count';

        if (!window._pivotGrid) window._pivotGrid = {};

        window._pivotGrid[pivotGridId] = {
            exclusions: dataVariant.exclusions,
            inclusions: dataVariant.inclusions,
            table: {
                clickCallback: function (oEvent) {
                    
                },
                rowTotals: false,
                colTotals: false
            }
        }

        pivotGrid.buildPivot();

    },

    variantAfterDnD: function (oDraggedControl, oDraggedData) {
        if (oDraggedControl) {
            const parent = oDraggedControl.getParent();
            const { name } = oDraggedData;
            const { column, row, val } = modelDataVariant.oData;
            const { fieldsReport } = modelDataSettings.oData;

            const k = 'name';
            const v = name;

            if (parent === tabColumn) ModelData.Delete(column, k, v);
            if (parent === tabRow) ModelData.Delete(row, k, v);
            if (parent === tabVal) ModelData.Delete(val, k, v);
            if (parent === tabFields) ModelData.UpdateField(fieldsReport, k, v, 'visible', false);
        }

        [tabFields, tabColumn, tabRow, tabVal].forEach(function (t) {
            t.rerender();
        });

        pivotGrid.applyFieldFilter();

        [modelDataVariant, modelDataSettings, modelDataPivot].forEach(function (m) {
            m.refresh();
        });

        pivotGrid.updateConfig(modelDataVariant.oData);
    },

    fieldsAfterDnD: function (oDraggedControl, oDraggedData) {
        [tabTableFields, tabFieldsSel, tabFieldsRun].forEach(function (t) {
            t.rerender();
        });

        modelappData.refresh();
    },

    applyFieldFilter: function () {
        // Field Catalog
        const { fieldsReport } = modelDataSettings.oData;
        fieldsReport.forEach(function (field) {
            const { column, row, val, exclusions } = modelDataVariant.oData;

            field.visible = true;

            let fieldName = field.name;
            let fieldColumn = ModelData.FindFirst(column, 'name', fieldName);

            if (fieldColumn) {
                field.visible = false;
                fieldColumn.filter = field.filter;
                fieldColumn.text = field.text;

                fieldColumn.filterType = exclusions && exclusions[field.text] ? 'Accept' : 'Transparent';
            }

            let fieldRow = ModelData.FindFirst(row, 'name', fieldName);
            if (fieldRow) {
                field.visible = false;
                fieldRow.filter = field.filter;
                fieldRow.text = field.text;

                fieldRow.filterType = exclusions && exclusions[field.text] ? 'Accept' : 'Transparent';
            }

            let fieldVal = ModelData.FindFirst(val, 'name', fieldName);
            if (fieldVal) {
                field.visible = false;
                fieldVal.filter = field.filter;
                fieldVal.text = field.text;

                fieldVal.filterType = exclusions && exclusions[field.text] ? 'Accept' : 'Transparent';
            }

            field.filterType = 'Transparent';
            if (exclusions && exclusions[field.text]) field.filterType = 'Accept';
        });

        const { column, row, val } = modelDataVariant.oData;
        column.forEach(function (field) {
            let catalog = ModelData.FindFirst(fieldsReport, 'name', field.name);
            if (!catalog) field.delete = true;
        })

        row.forEach(function (field) {
            let catalog = ModelData.FindFirst(fieldsReport, 'name', field.name);
            if (!catalog) field.delete = true;
        })

        val.forEach(function (field) {
            let catalog = ModelData.FindFirst(fieldsReport, 'name', field.name);
            if (!catalog) field.delete = true;
        })

        ModelData.Delete(modelDataVariant.oData.column, 'delete', true);
        ModelData.Delete(modelDataVariant.oData.row, 'delete', true);
        ModelData.Delete(modelDataVariant.oData.val, 'delete', true);

        tabFields.getBinding('items').filter(new sap.ui.model.Filter('visible', 'EQ', true));

        modelDataPivot.refresh();
        modelDataVariant.refresh();
        modelDataSettings.refresh();
    },

    filterBuild: function (name) {
        let dataTree = [];
        let keys = {};

        pivotGrid.data.forEach(function (data) {
            let value = data[name];
            if (!keys[value]) {
                keys[value] = {
                    value,
                    counter: 1
                }
                return;
            }

            keys[value] = {
                value,
                counter: keys[value].counter + 1
            }
        });

        for (let key in keys) {
            let selected = true;
            const x = modelDataVariant.oData.exclusions;

            if (x && x[name] && x[name].includes(keys[key].value)) selected = false;

            const { value, counter } = keys[key];
            dataTree.push({ value, counter, selected });
        }

        diaFilter.setTitle("Filter (" + dataTree.length + ") - " + name);
        modeltabFilter.setData(dataTree);

        tabFilter.getBinding("rows").sort([new sap.ui.model.Sorter("selected", true, false), new sap.ui.model.Sorter("value", false, false)]);

    },

    close: function () {
        const p = oApp.getParent();
        const evts = modelAppConfig.oData.settings.events;
        const shell = sap.n.Shell;
        const lp = sap.n.Launchpad;

        if (p && p.getParent() && p.getParent().close) {
            p.getParent().close();
        } else if (evts && evts.onChildBack) {
            evts.onChildBack();
        } else if (
            shell && shell.closeTile &&
            lp && lp.currentTile && lp.currentTile.id
        ) {
            shell.closeTile(lp.currentTile);
        }
    },

    arrayMove: function (arr, fromPos, toPos) {
        while (fromPos < 0) {
            fromPos += arr.length;
        }
        while (toPos < 0) {
            toPos += arr.length;
        }
        if (toPos >= arr.length) {
            var k = toPos - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(toPos, 0, arr.splice(fromPos, 1)[0]);
    },

    dataType: [
        { name: 'Table' },
        { name: 'Table Barchart' },
        { name: 'Area Chart' },
        { name: 'Area Spline Chart' },
        { name: 'Area Percent Chart' },
        { name: 'Bar Chart' },
        { name: 'Bar Percent Chart' },
        { name: 'Column Chart' },
        { name: 'Column Percent Chart' },
        { name: 'Line Chart' },
        { name: 'Pie Chart' },
        { name: 'Spline Chart' },
        { name: 'Stacked Bar Chart' },
        { name: 'Stacked Column Chart' },
        { name: 'TreeMap Chart' },       
        // { name: 'Heatmap' },
        // { name: 'Row Heatmap' },
        // { name: 'Col Heatmap' },
    ],

    dataCalc: [
        { name: 'Count' },
        { name: 'Average' },
        { name: 'Count Unique Values' },
        { name: 'First' },
        { name: 'Last' },
        { name: 'List Unique Values' },
        { name: 'Integer Sum' },
        { name: 'Median' },
        { name: 'Minimum' },
        { name: 'Maximum' },
        { name: 'Sum' },
        { name: 'Sum over Sum' },
        { name: 'Sum as Fraction of Total' },
        { name: 'Sum as Fraction of Rows' },
        { name: 'Sum as Fraction of Columns' },
        { name: 'Count as Fraction of Total' },
        { name: 'Count as Fraction of Rows' },
        { name: 'Count as Fraction of Columns' },
        { name: 'Sample Variance' },
        { name: 'Sample Standard Deviation' }
    ]
};