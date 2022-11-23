var report = {

    chartId: "tileChart" + ModelData.genID(),
    chartDataCurrent: null,
    chartDataUpdate: null,
    chart: null,
    metadata: metadata,
    childPage: null,
    groupBy: null,
    groupOrder: null,
    sortBy: null,
    sortOrder: null,
    pages: {},
    initId: null,
    runtime: false,
    libLoaded: false,

    pagination: {
        take: 10,
        index: 0,
        count: 0
    },

    events: {
        afterChildLoad: function () {
            oApp.to(report.childPage);
        },
        afterChildSave: function () {
            report.run();
            oApp.back();
        },
        onChildBack: function () {
            oApp.back();
        },
        onNavigatePage: function (page) {
            if (!report.pages[page.sId]) oApp.addPage(page);
            report.childPage = page;
            report.pages[page.sId] = true;
            oApp.to(page);
        }

    },

    start: function () {

        if (!sap.n || !sap.n.Adaptive) {
            console.error("Neptune Adaptive Framework not found");
            return;
        }

        sap.n.Adaptive.initApp(this);

    },

    init: function (config, runtime) {

        // Check current config
        if (report.initId === config.id && runtime) return;

        report.initId = config.id;
        report.runtime = runtime;

        // Chart Container
        if (!chartHTML.getContent()) {
            chartHTML.setContent("<div id=" + report.chartId + " style='height:100%;width:100%' class='nepTileChart'></div>");
        }

        // Set Default Values
        sap.n.Adaptive.setDefaultData(config, metadata);

        config.settings.properties.report.enablePagination = true;
        if (config.settings.properties.report.paginationRows) report.pagination.take = parseInt(config.settings.properties.report.paginationRows);

        report.sortBy = config.settings.properties.report.initialSortField || null;
        report.sortOrder = config.settings.properties.report.initialSortOrder || "ASC";
        report.groupBy = config.settings.properties.report.initialGroupField || null;
        report.groupOrder = config.settings.properties.report.initialGroupOrder || "ASC";

        modelAppConfig.setData(config);
        modelAppConfig.refresh();

        // Draw Chart With Cached Data
        if (runtime) {

            let chartData = localStorage.getItem("p9_tile_chart_" + modelAppConfig.oData.name);

            if (chartData) {
                try {
                    chartData = JSON.parse(chartData);
                    report.drawChart(chartData.series, chartData.categories, chartData.xAxisTitle, chartData.yAxisTitle);
                } catch (e) {
                    console.log(e);
                }
            }

        }

        // Init 
        sap.n.Adaptive.init(modelAppConfig.oData).then(function (data) {

            if (runtime) {

                modelAppConfig.oData.settings.fieldsSel = data.fieldsSelection;
                modelAppConfig.oData.settings.fieldsRun = data.fieldsReport;

                if (modelAppConfig.oData.settings.fieldsSel) modelAppConfig.oData.settings.fieldsSel.sort(sort_by("fieldPos"));
                if (modelAppConfig.oData.settings.fieldsRun) modelAppConfig.oData.settings.fieldsRun.sort(sort_by("fieldPos"));

            } else {

                modelAppConfig.oData.settings.fieldsSel.forEach(function (selField) {
                    var selFieldRun = ModelData.FindFirst(data.fieldsSelection, "name", selField.name);
                    if (selFieldRun && selFieldRun.items) selField.items = selFieldRun.items;
                    if (selFieldRun && selFieldRun.default) selField.default = selFieldRun.default;
                });

                if (report.chart) report.chart = null;

            }

            modelAppConfig.oData.settings.fieldsRun.forEach(function (runField) {
                if (!runField.type) runField.type = "data";
            });

            // Key Fields for GET Record 
            if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.keyField && modelAppConfig.oData.settings.navigation.keyField.length) {
                modelAppConfig.oData.settings.navigation.keyField.forEach(function (mapping) {

                    if (mapping.value) {
                        modelAppData.oData[mapping.fieldName] = mapping.value;
                    } else {
                        modelAppData.oData[mapping.fieldName] = mapping.key;
                    }

                });
            }

            // Filter
            report.buildTableFilter(panFilter, null, modelAppConfig.oData, modelAppData.oData, false, report.run);

            // Run Report
            report.run();

        }).catch(function (data) {
            if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
        });

    },

    drawChart: function (series, categories, xAxisTitle, yAxisTitle) {

        function waitForChart() {
            const chartDiv = document.getElementById(report.chartId);
            if (chartDiv) {
                setTimeout(function () {
                    report.buildChart(series, categories, xAxisTitle, yAxisTitle);
                }, 200);
            } else {
                setTimeout(waitForChart, 10);
            }
        }

        waitForChart();

    },

    buildChart: function (series, categories, xAxisTitle, yAxisTitle) {

        // No data
        if (!series && !categories) return;

        // Any Change in Data ? 
        if (report.chartDataCurrent && report.chartDataUpdate && report.chartDataCurrent === report.chartDataUpdate && report.runtime) return;

        // Legend
        var enabledLegend = modelAppConfig.oData.settings.properties.table.legendEnable;
        var chartType = modelAppConfig.oData.settings.properties.table.chartType || "column";

        if (series.length <= 1) enabledLegend = false;

        if (chartType === "areapercent") chartType = "area";
        if (chartType === "barstacked" || chartType === "barpercent") chartType = "bar";
        if (chartType === "columnstacked" || chartType === "columnpercent") chartType = "column";

        // Options
        var options = {
            chart: {
                renderTo: report.chartId,
                type: chartType,
                style: { fontFamily: "72", fontSize: "12px" },
                height: modelAppConfig.oData.settings.properties.table.chartHeight || null,
                backgroundColor: "transparent",
                marginRight: 20,
            },
            legend: {
                itemStyle: { fontWeight: "normal" },
            },
            labels: {
                style: { fontWeight: "normal" },
            },
            title: {
                text: modelAppConfig.oData.settings.properties.table.title,
                align: modelAppConfig.oData.settings.properties.table.titleAlign
            },
            subtitle: {
                text: modelAppConfig.oData.settings.properties.table.subTitle,
                align: modelAppConfig.oData.settings.properties.table.titleAlign
            },
            xAxis: {
                title: {
                    text: xAxisTitle,
                    enabled: modelAppConfig.oData.settings.properties.table.xAxisTitleEnable,
                },
                categories: categories,
                reversed: modelAppConfig.oData.settings.properties.table.xAxisReversed,
                startOnTick: modelAppConfig.oData.settings.properties.table.xAxisStartOnTick,
                gridLineWidth: parseInt(modelAppConfig.oData.settings.properties.table.xAxisGridLineWidth || 0),
            },
            yAxis: {
                title: {
                    text: yAxisTitle,
                    enabled: modelAppConfig.oData.settings.properties.table.yAxisTitleEnable,
                },
                reversed: modelAppConfig.oData.settings.properties.table.yAxisReversed,
                startOnTick: modelAppConfig.oData.settings.properties.table.yAxisStartOnTick,
                gridLineWidth: parseInt(modelAppConfig.oData.settings.properties.table.yAxisGridLineWidth || 1),
            },
            tooltip: {
                formatter: function () {
                    return (this.key && this.key != "" ? '<span style="font-size: 10px">' + this.key + '</span><br/>' : "") +
                        '<span style="color:' + this.point.series.color + '">\u25CF</span> ' + this.series.name + ': <b>' + Highcharts.numberFormat(this.point.y, 2) + '</b><br/>'
                }
            },
            legend: {
                backgroundColor: "transparent",
                align: modelAppConfig.oData.settings.properties.table.legendAlign,
                verticalAlign: modelAppConfig.oData.settings.properties.table.legendVerticalAlign,
                layout: modelAppConfig.oData.settings.properties.table.legendLayout,
                enabled: enabledLegend,
                itemStyle: { fontSize: "11px" },
            },
            plotOptions: {
                series: {
                    lineWidth: parseInt(modelAppConfig.oData.settings.properties.table.lineWidth || 2)
                },
                pie: {
                    borderWidth: 0,
                    cursor: 'pointer',
                    innerSize: modelAppConfig.oData.settings.properties.table.pieInnerSize,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: { fontSize: "11px" },
                    }
                },
                column: {
                    borderRadius: 0,
                    borderWidth: 0
                },
                bar: {
                    borderRadius: 0,
                    borderWidth: 0
                },
                barpercent: {
                    borderWidth: 0
                },
                barstacked: {
                    borderWidth: 0
                },
                columnpercent: {
                    borderWidth: 0
                },
                columnstacked: {
                    borderWidth: 0
                }
            },
            credits: false,
            series: series
        };

        if (modelAppConfig.oData.settings.properties.table.xAxisGridLineColor) options.xAxis.gridLineColor = modelAppConfig.oData.settings.properties.table.xAxisGridLineColor;
        if (modelAppConfig.oData.settings.properties.table.yAxisGridLineColor) options.yAxis.gridLineColor = modelAppConfig.oData.settings.properties.table.yAxisGridLineColor;

        // Custom Colors 
        if (modelAppConfig.oData.settings.properties.table.chartColor) {
            try {
                options.colors = JSON.parse(modelAppConfig.oData.settings.properties.table.chartColor);
            } catch (e) { }
        }

        // 3D
        if (modelAppConfig.oData.settings.properties.table.enable3D) {

            options.chart.options3d = {
                enabled: true,
                alpha: modelAppConfig.oData.settings.properties.table.alpha3D,
                beta: modelAppConfig.oData.settings.properties.table.beta3D,
                depth: modelAppConfig.oData.settings.properties.table.depth3D
            }

            if (modelAppConfig.oData.settings.properties.table.chartType === "pie") {
                options.plotOptions.pie.depth = modelAppConfig.oData.settings.properties.table.depth3D;
            }
        }

        // Monochrome Colors 
        if (modelAppConfig.oData.settings.properties.table.enableMonochrome) {
            options.colors = (function () {
                var degree = 0;
                var brighten = 0.1;
                var colors = [];
                var base = ((modelAppConfig.oData.settings.properties.table.colorMonochrome) ? modelAppConfig.oData.settings.properties.table.colorMonochrome : Highcharts.getOptions().colors[0]);

                if (modelAppConfig.oData.settings.properties.table.brightenMonochrome) brighten = parseFloat(modelAppConfig.oData.settings.properties.table.brightenMonochrome);

                for (i = 0; i < 20; i += 1) {
                    degree = degree + brighten;
                    colors.push(Highcharts.color(base).brighten(degree).get());
                }
                return colors;
            }());
        }

        // Stacking Percent
        if (modelAppConfig.oData.settings.properties.table.chartType === "areapercent" || modelAppConfig.oData.settings.properties.table.chartType === "barpercent" || modelAppConfig.oData.settings.properties.table.chartType === "columnpercent") {
            options.plotOptions.series = { stacking: "percent" }
        }

        // Stacking Normal
        if (modelAppConfig.oData.settings.properties.table.chartType === "barstacked" || modelAppConfig.oData.settings.properties.table.chartType === "columnstacked") {
            options.plotOptions.series = { stacking: "normal" }
        }

        // Save Current Data
        report.chartDataCurrent = JSON.stringify({ series: series, categories: categories, xAxisTitle: xAxisTitle, yAxisTitle: yAxisTitle });

        // Render Chart
        report.chart = Highcharts.chart(options)

        // Auto Update
        if (report.runtime && parseInt(modelAppConfig.oData.settings.properties.report.updateTime)) {
            setTimeout(function () {
                if (!AppCache.isRestricted && !AppCache.isOffline) report.run();
            }, parseInt(modelAppConfig.oData.settings.properties.report.updateTime) * 1000 * 60);
        }

    },

    run: function (runtime) {

        // Max Rows
        modelAppData.oData._pagination = {
            take: report.pagination.take,
            skip: 0
        }

        // Sorting        
        modelAppData.oData._order = {};

        if (report.groupBy) modelAppData.oData._order[report.groupBy] = report.groupOrder;
        if (report.sortBy) modelAppData.oData._order[report.sortBy] = report.sortOrder;

        // Fetch Data
        sap.n.Adaptive.run(modelAppConfig.oData, modelAppData.oData, "List").then(function (data) {

            // Error 
            if (data.status && data.status === "ERROR") {
                return;
            }

            var chartData = data.result || data;

            var xAxisTitle = "";
            var yAxisTitle = "";
            var xAxisTitleSep = "";
            var yAxisTitleSep = "";

            var rowFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, ["type", "visible"], ["data", true]);
            var colFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, ["type", "visible"], ["category", true]);
            var valFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, ["type", "visible"], ["value", true]);

            // No Value Fields -> Auto inject counter field
            if (!valFields.length) {

                valFields.push({
                    name: "_autocounter",
                    label: "Entries"
                });

                chartData.forEach(function (data) {
                    data._autocounter = 1;
                });

            }

            // Titles - xAxis
            rowFields.forEach(function (field) {
                xAxisTitle += xAxisTitleSep + field.text;
                xAxisTitleSep = ", "
            });

            // Titles - yAxis
            colFields.forEach(function (field) {
                yAxisTitle += yAxisTitleSep + field.text;
                yAxisTitleSep = ", "
            });

            var colDataFields = {};
            var colData = {};
            var rowData = {};

            chartData.forEach(function (data) {

                var rowKeyData = [];
                var rowKeyField = [];
                var rowKeyText = "";
                var rowKeyTextSep = "";

                // Rows
                rowFields.forEach(function (field) {

                    var fieldName = (field.valueType ? field.name + "_value" : field.name);

                    if (data[fieldName] === null) return;

                    // Formatter 
                    if (field.formatter) data[fieldName] = sap.n.Adaptive.formatter(data[fieldName], field.formatter);

                    // Boolean
                    if (data[fieldName] === true) data[fieldName] = "true";
                    if (data[fieldName] === false) data[fieldName] = "false";

                    rowKeyField.push(fieldName);
                    rowKeyData.push(data[fieldName]);
                    rowKeyText += rowKeyTextSep + data[fieldName]
                    rowKeyTextSep = ", "
                });

                if (rowKeyText) rowData[rowKeyText] = ModelData.Find(chartData, rowKeyField, rowKeyData);

                var colKeyData = [];
                var colKeyField = [];
                var colKeyText = "";
                var colKeyTextSep = "";

                // Cols
                colFields.forEach(function (field) {

                    var fieldName = (field.valueType ? field.name + "_value" : field.name);

                    if (data[fieldName] === null) return;

                    // Formatter 
                    if (field.formatter) data[fieldName] = sap.n.Adaptive.formatter(data[fieldName], field.formatter);

                    // Boolean
                    if (data[fieldName] === true) data[fieldName] = "true";
                    if (data[fieldName] === false) data[fieldName] = "false";

                    colKeyField.push(fieldName);
                    colKeyData.push(data[fieldName]);
                    colKeyText += colKeyTextSep + data[fieldName]
                    colKeyTextSep = ", "
                });

                if (colKeyText) {
                    colData[colKeyText] = ModelData.Find(chartData, colKeyField, colKeyData);
                    colDataFields[colKeyText] = colKeyField[0];
                }

            });

            var colKeys = Object.keys(colData);
            var rowKeys = Object.keys(rowData);

            if (!rowKeys.length) rowKeys.push([]);
            if (!colKeys.length) colKeys.push([]);

            var _i, _j, _len, _len1;

            var series = [];
            var valField = valFields[0];

            for (_i = 0, _len = rowKeys.length; _i < _len; _i++) {

                var seriesData = [];
                var rowKey = rowKeys[_i];

                colKeys.forEach(function (colKey) {

                    var recs = [];
                    var lookupData = rowData[rowKey] || colData[colKey];

                    if (lookupData) {
                        recs = ModelData.Find(lookupData, colDataFields[colKey], colKey);
                    }

                    var values = 0;
                    recs.forEach(function (rec) {
                        values += parseFloat(rec[valField.name]);
                    });

                    if (modelAppConfig.oData.settings.properties.table.chartType === "pie") {
                        seriesData.push({ name: colKey, y: values });
                    } else {
                        seriesData.push(values);
                    }

                })

                series.push({
                    name: rowKey,
                    data: seriesData,
                    dataSorting: {
                        enabled: modelAppConfig.oData.settings.properties.table.enableSorting,
                    },
                });

            }

            // Categories
            var categories = [];
            for (_i = 0, _len = colKeys.length; _i < _len; _i++) {
                colKey = colKeys[_i];
                categories.push(colKey);
            };

            // Save Data
            report.chartDataUpdate = JSON.stringify({ series: series, categories: categories, xAxisTitle: xAxisTitle, yAxisTitle: yAxisTitle });
            localStorage.setItem("p9_tile_chart_" + modelAppConfig.oData.name, report.chartDataUpdate);

            // Draw Chart
            report.drawChart(series, categories, xAxisTitle, yAxisTitle);


        }).catch(function (data) {
            if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
        });
    },

    buildTableFilter: function (parent, table, config, appdata, enableSearch, run) {
        try {
            parent.destroyContent();
            if (!config) return;

            let numFields = ModelData.Find(config.settings.fieldsSel, 'visible', true)
            let numFilters = (numFields) ? numFields.length : 1;
            if (enableSearch) numFilters++;

            let columnsM = 2;
            let columnsL = 2;

            switch (numFilters) {
                case 3:
                case 5:
                case 6:
                case 7:
                case 8:
                    columnsL = 3;
                    break;
                default:
                    break;
            }

            let form = new sap.ui.layout.form.SimpleForm({
                layout: 'ColumnLayout',
                editable: true,
                labelSpanL: 12,
                labelSpanM: 12,
                columnsM: columnsM,
                columnsL: columnsL,
            });

            if (config.settings.properties.form.enableCompact) {
                form.addStyleClass('sapUiSizeCompact');
            } else {
                form.removeStyleClass('sapUiSizeCompact');
            }

            // Search
            if (enableSearch) {

                form.addContent(new sap.m.Label({
                    text: sap.n.Adaptive.translateProperty('report', 'searchLabel', config),
                    width: '100%'
                }));

                form.addContent(new sap.m.SearchField({
                    placeholder: sap.n.Adaptive.translateProperty('report', 'searchPlaceholder', config),
                    liveChange: function (oEvent) {
                        let searchField = this;
                        let filters = [];
                        let bindingItems = table.getBinding('items');
                        let fieldsFilter = ModelData.Find(config.settings.fieldsRun, 'enableFilter', true);

                        fieldsFilter.forEach(function ({ name, valueType }) {
                            filters.push(
                                new sap.ui.model.Filter(valueType ? `${name}_value` : name, 'Contains', searchField.getValue()),
                            );
                        });

                        bindingItems.filter([new sap.ui.model.Filter({
                            filters: filters,
                            and: false
                        })]);

                    }

                }));

            }

            config.settings.fieldsSel.forEach(function (field) {
                const { name, type } = field;
                if (field.default) {
                    if (['MultiSelect', 'MultiSelectLookup', 'MultiSelectScript'].includes(type)) {
                        if (typeof field.default === 'object') {
                            appdata[name] = field.default;
                        } else {
                            if (field.default.indexOf('[') > -1) {
                                appdata[name] = JSON.parse(field.default);
                            } else {
                                appdata[name] = field.default;
                            }
                        }

                    } else if (['Switch', 'CheckBox'].includes(type)) {
                        if (field.default === 'true' || field.default === '1' || field.default === 'X') {
                            appdata[name] = true;
                        } else {
                            delete appdata[name];
                        }

                    } else if (['DateRange'].includes(type)) {

                        const dateRange = field.default.split("-");

                        if (dateRange) {
                            appdata[name] = new Date(dateRange[0]);
                            appdata[name + "_end"] = new Date(dateRange[1]);
                        }

                    } else {
                        appdata[name] = field.default;
                    }
                }

                // Values from System Variables
                if (field.sysvarValue) {

                    switch (field.sysvarValue) {

                        case 'UserName':
                            if (AppCache.userInfo && AppCache.userInfo.username) {
                                appdata[field.name] = AppCache.userInfo.username;
                            } else {
                                appdata[field.name] = systemSettings.user.username;
                            }
                            break;

                        default:
                            break;

                    }

                }

                if (field.required) delete appdata[`${name}ValueState`];

                const fieldValue = `{AppData>/${name}}`;
                const fieldValueState = `{AppData>/${name}ValueState}`;

                function onChange(_oEvent) {
                    if (run) run();
                }

                switch (type) {
                    case 'MultiSelect':
                    case 'MultiSelectLookup':
                    case 'MultiSelectScript':
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));

                        let multiField = new sap.m.MultiComboBox({
                            width: '100%',
                            visible: field.visible,
                            selectedKeys: fieldValue,
                            valueState: fieldValueState,
                            showSecondaryValues: true,
                            selectionChange: onChange,
                        });

                        if (field.items) {
                            field.items.sort(sort_by('text'));
                            field.items.forEach(function ({ key, text, additionalText }) {
                                multiField.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                            });
                        }

                        form.addContent(multiField);
                        break;

                    case 'SingleSelect':
                    case 'SingleSelectLookup':
                    case 'SingleSelectScript':
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));

                        let singleField = new sap.m.ComboBox({
                            width: '100%',
                            visible: field.visible,
                            selectedKey: fieldValue,
                            valueState: fieldValueState,
                            showSecondaryValues: true,
                            change: onChange,
                        });
                        singleField.addItem(new sap.ui.core.Item({ key: '', text: '', }));

                        if (field.items) {
                            field.items.sort(sort_by('text'));
                            field.items.forEach(function ({ key, text, additionalText }) {
                                singleField.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                            });
                        }

                        form.addContent(singleField);
                        break;

                    case 'DateRange':
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));
                        form.addContent(new sap.m.DateRangeSelection({
                            width: '100%',
                            visible: field.visible,
                            dateValue: fieldValue,
                            secondDateValue: `{AppData>/${name}_end}`,
                            valueState: fieldValueState,
                            change: onChange,
                        }));
                        break;

                    case 'CheckBox':
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));
                        form.addContent(
                            new sap.m.CheckBox({
                                width: '100%',
                                visible: field.visible,
                                useEntireWidth: true,
                                selected: fieldValue,
                                valueState: fieldValueState,
                                select: onChange,
                            })
                        );
                        break;

                    case 'Switch':
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));
                        form.addContent(
                            new sap.m.Switch({
                                visible: field.visible,
                                state: fieldValue,
                                change: onChange,
                            })
                        );
                        break;

                    default:
                        form.addContent(new sap.m.Label({ text: sap.n.Adaptive.translateFieldLabel(field, config), required: field.required }));
                        form.addContent(
                            new sap.m.SearchField({
                                width: '100%',
                                visible: field.visible,
                                value: fieldValue,
                                // valueState: fieldValueState,
                                search: onChange,
                            })
                        );
                        break;
                }
            });

            parent.addContent(form);
        } catch (e) {
            console.log(e);
        }
    },

    loadLibrary: function (library) {

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

}

report.start();