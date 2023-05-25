var report = {
    metadata: metadata,
    childPage: null,
    groupBy: null,
    groupOrder: null,
    sortBy: null,
    sortOrder: null,
    pages: {},
    initId: null,
    filterObject: null,
    calObject: null,
    fieldStartDate: null,
    fieldEndDate: null,

    pagination: {
        take: 100,
        index: 0,
        count: 0,
    },

    events: {
        afterChildLoad: function () {
            oApp.to(report.childPage);
        },
        afterChildSave: function () {
            report.run();
        },
        onChildBack: function () {
            oApp.back();
        },
        onNavigatePage: function (page) {
            if (!report.pages[page.sId]) oApp.addPage(page);
            report.childPage = page;
            report.pages[page.sId] = true;
            oApp.to(page);
        },
        onHeaderClick: function (field, button) {
            modelpopHeader.setData(field);
            popHeader.openBy(button);
        },
        onNavigateDialog: function (dialog) {
            dialog.open();
        },
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
        if (report.initId === config.id) {
            if (!config.settings.properties.report.autoRunFocus && runtime) return;
        } else {
            report.initId = config.id;
            modelAppData.setData({});
        }

        // Layout
        if (config.settings.properties.report.hideHeader) {
            oApp.to(oPageChild);
            oPageChild.setFooter(oPageFooter);
            report.calObject = oCalendar;
            report.filterObject = panFilterChild;
        } else {
            oApp.to(oPageDynamic);
            oPageDynamic.setFooter(oPageFooter);
            report.calObject = oCalendar;
            report.filterObject = oPanFilter;
        }

        // Set Default Values
        sap.n.Adaptive.setDefaultData(config, metadata);

        // Prevent Back Button in Launchpad
        sap.n.Shell.attachBeforeBack(function (oEvent) {
            if (oApp.getCurrentPage() !== oPageDynamic && oApp.getCurrentPage() !== oPageChild) {
                oApp.back();
                oEvent.preventDefault();
            }
        });

        if (config.settings.properties.table.paginationRows) report.pagination.take = parseInt(config.settings.properties.table.paginationRows);

        if (config.settings.properties.report.avatarBackgroundColor) {
            oPageHeaderIcon.setBackgroundColor(config.settings.properties.report.avatarBackgroundColor);
        } else {
            oPageHeaderIcon.setBackgroundColor();
        }

        report.sortBy = config.settings.properties.table.initialSortField || null;
        report.sortOrder = config.settings.properties.table.initialSortOrder || "ASC";
        report.groupBy = config.settings.properties.table.initialGroupField || null;
        report.groupOrder = config.settings.properties.table.initialGroupOrder || "ASC";

        // Language
        if (runtime) {
            if (AppCache && AppCache.userInfo && AppCache.userInfo.language) config.language = AppCache.userInfo.language;
        } else {
            const language = getAdaptiveEditorPreviewLanguage();
            if (language) config.language = language;
        }

        modelAppConfig.setData(config);
        modelAppConfig.refresh();

        // Translation - Properties
        oPageHeaderTitle.setText(sap.n.Adaptive.translateProperty("report", "title", config));
        oPageHeaderSubTitle.setText(sap.n.Adaptive.translateProperty("report", "subTitle", config));
        oPageHeaderVariant.setText(sap.n.Adaptive.translateProperty("report", "subTitle", config));
        oPageCreate.setText(sap.n.Adaptive.translateProperty("report", "textButtonCreate", config));
        oPageUpdate.setText(sap.n.Adaptive.translateProperty("report", "textButtonRun", config));
        oPageClose.setText(sap.n.Adaptive.translateProperty("report", "textButtonClose", config));
        toolDataClose.setText(sap.n.Adaptive.translateProperty("report", "textButtonClose", config));
        report.calObject.setTitle(sap.n.Adaptive.translateProperty("table", "headerText", config));

        // Init
        sap.n.Adaptive.init(modelAppConfig.oData)
            .then(function (data) {
                // Open Dialog
                if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().open) {
                    oApp.getParent().getParent().open();
                }

                if (runtime) {
                    modelAppConfig.oData.settings.fieldsSel = data.fieldsSelection;
                    modelAppConfig.oData.settings.fieldsRun = data.fieldsReport;

                    if (modelAppConfig.oData.settings.fieldsSel) modelAppConfig.oData.settings.fieldsSel.sort(sort_by("fieldPos"));
                    if (modelAppConfig.oData.settings.fieldsRun) modelAppConfig.oData.settings.fieldsRun.sort(sort_by("fieldPos"));
                } else {
                    $.each(modelAppConfig.oData.settings.fieldsSel, function (i, selField) {
                        var selFieldRun = ModelData.FindFirst(data.fieldsSelection, "name", selField.name);
                        if (selFieldRun && selFieldRun.items) selField.items = selFieldRun.items;
                        if (selFieldRun && selFieldRun.default) selField.default = selFieldRun.default;
                    });
                }

                // Key Fields for GET Record
                if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.keyField && modelAppConfig.oData.settings.navigation.keyField.length) {
                    $.each(modelAppConfig.oData.settings.navigation.keyField, function (i, mapping) {
                        if (mapping.value) modelAppData.oData[mapping.fieldName] = mapping.value;
                        if (mapping.key) modelAppData.oData[mapping.fieldName] = modelAppConfig.oData.settings.data[mapping.key];
                    });
                }

                // Build Calendar
                report.buildCalendar();

                // Display Search Filter
                var showSearchField = true;
                if (modelAppConfig.oData.settings.properties.table.enablePagination) {
                    showSearchField = false;
                } else {
                    var searchFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, "enableFilter", true);
                    if (!searchFields.length) showSearchField = false;
                }

                // Show/Hide Header
                if (!showSearchField) {
                    var selFields = ModelData.Find(modelAppConfig.oData.settings.fieldsSel, "visible", true);
                    if (!selFields.length) {
                        oPageHeader.setVisible(false);
                    } else {
                        oPageHeader.setVisible(true);
                    }
                } else {
                    oPageHeader.setVisible(true);
                }

                // Build Filter
                if (oPageHeader.getVisible()) report.buildTableFilter(report.filterObject, null, modelAppConfig.oData, modelAppData.oData, false, report.run);

                // Auto Run
                if (modelAppConfig.oData.settings.properties.report.autoRun) report.run();
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
            });
    },

    buildCalendar: function () {
        report.calObject.removeAllViews();

        // Views
        if (modelAppConfig.oData.settings.properties.table.enableDayView) report.calObject.addView(new sap.m.SinglePlanningCalendarDayView({ key: "day", title: "Day" }));
        if (modelAppConfig.oData.settings.properties.table.enableWeekView) report.calObject.addView(new sap.m.SinglePlanningCalendarWeekView({ key: "week", title: "Week" }));
        // if (modelAppConfig.oData.settings.properties.table.enableWorkWeekView) report.calObject.addView(new sap.m.SinglePlanningCalendarWorkWeekView({ key: "workweek", title: "Work Week" }));
        if (modelAppConfig.oData.settings.properties.table.enableMonthView) report.calObject.addView(new sap.m.SinglePlanningCalendarMonthView({ key: "month", title: "Month" }));

        // Start Hour
        if (modelAppConfig.oData.settings.properties.table.startHour) {
            report.calObject.setStartHour(parseInt(modelAppConfig.oData.settings.properties.table.startHour));
        } else {
            report.calObject.setStartHour();
        }

        // End Hour
        if (modelAppConfig.oData.settings.properties.table.endHour) {
            report.calObject.setEndHour(parseInt(modelAppConfig.oData.settings.properties.table.endHour));
        } else {
            report.calObject.setEndHour();
        }

        // End View
        if (modelAppConfig.oData.settings.properties.table.startView) {
            const views = report.calObject.getViews();
            let selectedView;

            views.forEach(function (view) {
                if (view.mProperties.key === modelAppConfig.oData.settings.properties.table.startView) selectedView = view;
            });

            if (selectedView) {
                report.calObject.setSelectedView(selectedView);
            } else {
                report.calObject.setSelectedView();
            }
        }

        // Binding
        $.each(modelAppConfig.oData.settings.fieldsRun, function (i, runField) {
            if (runField.type) {
                let fieldName = runField.valueType ? runField.name + "_value" : runField.name;

                oCalendarAppointment.bindProperty(runField.type, fieldName);

                if (runField.type === "startDate") report.fieldStartDate = runField.name;
                if (runField.type === "endDate") report.fieldEndDate = runField.name;
            }
        });
    },

    handlePagination() {
        var maxIndex = report.pagination.count / report.pagination.take;
        maxIndex = Math.ceil(maxIndex);

        if (report.pagination.count <= report.pagination.take) maxIndex = 1;

        toolPaginationFirst.setEnabled(true);
        toolPaginationPrev.setEnabled(true);
        toolPaginationNext.setEnabled(true);
        toolPaginationLast.setEnabled(true);

        if (report.pagination.index < 0) report.pagination.index = 0;

        if (report.pagination.index === 0) {
            toolPaginationFirst.setEnabled(false);
            toolPaginationPrev.setEnabled(false);
        }

        if (report.pagination.index + 1 >= maxIndex) {
            toolPaginationNext.setEnabled(false);
            toolPaginationLast.setEnabled(false);
        }

        toolPaginationPages.destroyItems();

        var numItems = 0;
        var maxItems = 6;
        var startItem = report.pagination.index - maxItems / 2;

        if (startItem < 0) startItem = 0;

        for (i = startItem; i < maxIndex; i++) {
            if (numItems <= maxItems) toolPaginationPages.addItem(new sap.m.SegmentedButtonItem({ text: i + 1, key: i }));
            numItems++;
        }

        toolPaginationPages.setSelectedKey(report.pagination.index);
        toolPaginationTitle.setNumber(report.pagination.index + 1 + "/" + maxIndex);
    },

    sel: function () {
        sap.n.Adaptive.sel(modelAppConfig.oData).then(function (data) {
            if (data.status) {
                sap.m.MessageToast.show(data.status);
            } else {
                console.log(data);
            }
        });
    },

    run: function () {
        const filterData = JSON.parse(modelAppData.getJSON());

        // Sorting
        if (!report.sortBy && modelAppConfig.oData.settings.fieldsRun.length) report.sortBy = modelAppConfig.oData.settings.fieldsRun[0].name;

        // Pagination
        if (modelAppConfig.oData.settings.properties.table.enablePagination) {
            // Records to Get
            modelAppData.oData._pagination = {
                take: report.pagination.take,
                skip: report.pagination.take * report.pagination.index,
            };

            modelAppData.oData._order = {};
            if (report.groupBy) modelAppData.oData._order[report.groupBy] = report.groupOrder;
            if (report.sortBy) modelAppData.oData._order[report.sortBy] = report.sortOrder;
        } else {
            delete modelAppData.oData._pagination;
            delete modelAppData.oData._order;
        }

        // POST Data Formatting
        modelAppConfig.oData.settings.fieldsSel.forEach(function (selField) {
            const { type, name } = selField;

            if (["CheckBox", "Switch"].includes(type)) {
                if (!filterData[name]) delete filterData[name];
            }

            if (["MultiSelect", "MultiSelectLookup", "MultiSelectScript"].includes(type)) {
                if (filterData[name] && !filterData[name].length) delete filterData[selField.name];
            }

            if (filterData[name] === "") delete filterData[name];
        });

        sap.n.Adaptive.run(modelAppConfig.oData, filterData, "List")
            .then(function (data) {
                if (data.status && data.status === "required") {
                    sap.m.MessageToast.show("Please fill in all required fields");
                } else {
                    var dataCal = null;

                    if (data.result) {
                        dataCal = data.result;
                        oPageHeaderNumber.setNumber("(" + data.count + ")");
                        report.pagination.count = data.count;
                        report.handlePagination();
                    } else {
                        dataCal = data;
                        oPageHeaderNumber.setNumber("(" + data.length + ")");
                    }

                    $.each(dataCal, function (i, data) {
                        if (report.fieldStartDate) data[report.fieldStartDate] = new Date(data[report.fieldStartDate]);
                        if (report.fieldEndDate) data[report.fieldEndDate] = new Date(data[report.fieldEndDate]);
                    });

                    modeloCalendar.setData(dataCal);
                    modeloCalendar.refresh();
                }

                // Start Date
                if (modelAppConfig.oData.settings.properties.table.startBegData) {
                    const row = modeloCalendar.oData[0];
                    if (row) report.calObject.setStartDate(row[report.fieldEndDate]);
                }

                modelAppData.refresh(true);
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
            });
    },

    delete: function (data) {
        sap.m.MessageBox.show("Do you want to delete this entry ? ", {
            title: "Delete",
            icon: sap.m.MessageBox.Icon.ERROR,
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
            onClose: function (oAction) {
                if (oAction === "YES") {
                    sap.n.Adaptive.run(modelAppConfig.oData, { id: data.id }, "Delete").then(function (data) {
                        report.run();
                    });
                }
            },
        });
    },

    create: function () {
        // Pass mapped data
        var postData = null;

        if (modelAppConfig.oData.settings.properties.report._navigationCreate && modelAppConfig.oData.settings.properties.report._navigationCreate.keyField) {
            postData = { _defaultData: {} };

            if (!modelAppConfig.oData.settings.data) modelAppConfig.oData.settings.data = {};

            $.each(modelAppConfig.oData.settings.properties.report._navigationCreate.keyField, function (i, mapping) {
                if (mapping.value) postData._defaultData[mapping.fieldName] = mapping.value;
                if (mapping.key) postData._defaultData[mapping.fieldName] = modelAppConfig.oData.settings.data[mapping.key];
            });
        }

        sap.n.Adaptive.navigation(modelAppConfig.oData.settings.properties.report._navigationCreate, postData, report.events);
    },

    close: function () {
        const isDialog = oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().close;

        if (isDialog) {
            oApp.getParent().getParent().close();
            return;
        } else if (modelAppConfig.oData.settings.events && modelAppConfig.oData.settings.events.onChildBack) {
            modelAppConfig.oData.settings.events.onChildBack();
            return;
        } else if (AppCache && AppCache.Back) {
            AppCache.Back();
            return;
        }

        if (sap.n.Shell && sap.n.Shell.closeAllSidepanelTabs) sap.n.Shell.closeAllSidepanelTabs();

        if (!isDialog && sap.n.HashNavigation && sap.n.HashNavigation.deleteNavItem) {
            sap.n.HashNavigation.deleteNavItem();
        }
    },

    save: function (calData) {
        sap.n.Adaptive.run(modelAppConfig.oData, calData, "Save")
            .then(function (data) {
                sap.m.MessageToast.show("Saved");
                report.run();
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
            });
    },

    export: function () {
        jQuery.sap.require("sap.ui.core.util.Export");
        jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

        report.tabObject.setBusy(true);

        // Pagination
        if (modelAppConfig.oData.settings.properties.table.enablePagination) {
            delete modelAppData.oData._pagination;

            sap.n.Adaptive.run(modelAppConfig.oData, modelAppData.oData, "List")
                .then(function (data) {
                    if (data.result) {
                        modelExportData.setData(data.result);
                    } else {
                        modelExportData.setData(data);
                    }

                    report.exportDownload();
                    report.tabObject.setBusy(false);
                })
                .catch(function (data) {
                    if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
                    report.tabObject.setBusy(false);
                });
        } else {
            modelExportData.setData(report.tabObject.getModel().oData);
            report.exportDownload();
        }
    },

    buildTableFilter: function (parent, table, config, appdata, enableSearch, run) {
        try {
            parent.destroyContent();

            if (!config) return;

            var numFields = ModelData.Find(config.settings.fieldsSel, "visible", true);
            var numFilters = numFields ? numFields.length : 1;
            if (enableSearch) numFilters++;

            var columnsM = 2;
            var columnsL = 2;

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

            var form = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                editable: true,
                labelSpanL: 12,
                labelSpanM: 12,
                columnsM: columnsM,
                columnsL: columnsL,
            });

            if (config.settings.properties.form.enableCompact) {
                form.addStyleClass("sapUiSizeCompact");
            } else {
                form.removeStyleClass("sapUiSizeCompact");
            }

            // Search
            if (enableSearch) {
                form.addContent(
                    new sap.m.Label({
                        text: sap.n.Adaptive.translateProperty("report", "searchLabel", config),
                        width: "100%",
                    })
                );

                form.addContent(
                    new sap.m.SearchField({
                        placeholder: sap.n.Adaptive.translateProperty("report", "searchPlaceholder", config),
                        liveChange: function (oEvent) {
                            var searchField = this;
                            var filters = [];
                            var bindingItems = table.getBinding("items");
                            var fieldsFilter = ModelData.Find(config.settings.fieldsRun, "enableFilter", true);

                            $.each(fieldsFilter, function (i, field) {
                                if (field.valueType) {
                                    filters.push(new sap.ui.model.Filter(field.name + "_value", "Contains", searchField.getValue()));
                                } else {
                                    filters.push(new sap.ui.model.Filter(field.name, "Contains", searchField.getValue()));
                                }
                            });

                            bindingItems.filter([
                                new sap.ui.model.Filter({
                                    filters: filters,
                                    and: false,
                                }),
                            ]);
                        },
                    })
                );
            }

            $.each(config.settings.fieldsSel, function (i, field) {
                if (field.default) {
                    if (field.type === "MultiSelect" || field.type === "MultiSelectLookup" || field.type === "MultiSelectScript") {
                        if (typeof field.default === "object") {
                            appdata[field.name] = field.default;
                        } else {
                            if (field.default.indexOf("[") > -1) {
                                appdata[field.name] = JSON.parse(field.default);
                            } else {
                                appdata[field.name] = field.default;
                            }
                        }
                    } else if (field.type === "Switch" || field.type === "CheckBox") {
                        if (field.default === "true" || field.default === "1" || field.default === "X") {
                            appdata[field.name] = true;
                        } else {
                            delete appdata[field.name];
                        }
                    } else if (["DateRange"].includes(field.type)) {
                        const dateRange = field.default.split("-");
                        if (dateRange) {
                            appdata[field.name] = new Date(dateRange[0]);
                            appdata[field.name + "_end"] = new Date(dateRange[1]);
                        }
                    } else if (["ValueHelpOData"].includes(field.type)) {
                    } else {
                        appdata[field.name] = field.default;
                    }
                }

                // Values from System Variables
                if (field.sysvarValue) {
                    switch (field.sysvarValue) {
                        case "UserName":
                            if (AppCache.userInfo && AppCache.userInfo.username) {
                                appdata[field.name] = AppCache.userInfo.username;
                            } else {
                                appdata[field.name] = systemSettings.user.username;
                            }
                            break;

                        default:
                            break;
                    }

                    if (["DateRange"].includes(field.type)) {
                        let daysFrom = 0;
                        let daysTo = 0;

                        switch (field.sysvarValue) {
                            case "TOMORROW":
                                daysFrom = 1;
                                daysTo = 1;
                                break;

                            case "YESTERDAY":
                                daysFrom = -1;
                                daysTo = -1;
                                break;

                            case "LAST_7":
                                daysFrom = -7;
                                break;

                            case "LAST_30":
                                daysFrom = -30;
                                break;

                            case "LAST_60":
                                daysFrom = -60;
                                break;

                            case "LAST_90":
                                daysFrom = -90;
                                break;

                            case "LAST_180":
                                daysFrom = -180;
                                break;

                            case "NEXT_7":
                                daysTo = 7;
                                break;

                            case "NEXT_30":
                                daysTo = 30;
                                break;

                            case "NEXT_60":
                                daysTo = 60;
                                break;

                            case "NEXT_90":
                                daysTo = 90;
                                break;

                            case "NEXT_180":
                                daysTo = 180;
                                break;

                            default:
                                break;
                        }

                        appdata[field.name] = report.setDateRange(daysFrom, "from");
                        appdata[field.name + "_end"] = report.setDateRange(daysTo, "to");
                    }
                }

                if (field.required) delete appdata[field.name + "ValueState"];

                // Create Filter Fields
                switch (field.type) {
                    case "MultiSelect":
                    case "MultiSelectLookup":
                    case "MultiSelectScript":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.MultiComboBox({
                            width: "100%",
                            visible: field.visible,
                            selectedKeys: "{AppData>/" + field.name + "}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            showSecondaryValues: true,
                            showSelectAll: true,
                            selectionChange: function (oEvent) {
                                if (run) run();
                            },
                        });

                        if (field.items) field.items.sort(sort_by("text"));

                        $.each(field.items, function (i, item) {
                            selField.addItem(
                                new sap.ui.core.ListItem({
                                    key: item.key,
                                    text: item.text,
                                    additionalText: item.additionalText,
                                })
                            );
                        });

                        form.addContent(selField);
                        break;

                    case "SingleSelect":
                    case "SingleSelectLookup":
                    case "SingleSelectScript":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.ComboBox({
                            width: "100%",
                            visible: field.visible,
                            selectedKey: "{AppData>/" + field.name + "}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            showSecondaryValues: true,
                            change: function (oEvent) {
                                if (run) run();
                            },
                        });

                        selField.addItem(new sap.ui.core.Item({ key: "", text: "" }));

                        if (field.items) field.items.sort(sort_by("text"));

                        $.each(field.items, function (i, item) {
                            selField.addItem(
                                new sap.ui.core.ListItem({
                                    key: item.key,
                                    text: item.text,
                                    additionalText: item.additionalText,
                                })
                            );
                        });

                        form.addContent(selField);
                        break;

                    case "DateRange":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.DateRangeSelection({
                            width: "100%",
                            visible: field.visible,
                            dateValue: "{AppData>/" + field.name + "}",
                            secondDateValue: "{AppData>/" + field.name + "_end}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            change: function (oEvent) {
                                if (run) run();
                            },
                        });
                        form.addContent(selField);
                        break;

                    case "CheckBox":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.CheckBox({
                            width: "100%",
                            visible: field.visible,
                            useEntireWidth: true,
                            selected: "{AppData>/" + field.name + "}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            select: function (oEvent) {
                                if (run) run();
                            },
                        });
                        form.addContent(selField);
                        break;

                    case "Switch":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.Switch({
                            visible: field.visible,
                            state: "{AppData>/" + field.name + "}",
                            change: function (oEvent) {
                                if (run) run();
                            },
                        });
                        form.addContent(selField);
                        break;

                    case "ValueHelp":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.Input({
                            visible: field.visible,
                            editable: field.editable,
                            type: "Text",
                            placeholder: field.placeholder || "",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            value: "{AppData>/" + field.name + "}",
                            showValueHelp: true,
                            valueHelpRequest: function (oEvent) {
                                events = {
                                    valueRequest: true,
                                    valueRequestField: selField.sId,
                                    valueRequestKey: field.valueRequestKey,
                                };

                                sap.n.Adaptive.navigation(field._navigation, appdata, events);
                            },
                        });
                        form.addContent(selField);
                        break;

                    case "ValueHelpOData":
                        var inputFieldLabel = sap.n.Adaptive.translateFieldLabel(field, config);

                        form.addContent(
                            new sap.m.Label({
                                text: inputFieldLabel,
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.MultiInput("filter" + field.name, {
                            visible: field.visible,
                            editable: field.editable,
                            type: "Text",
                            enableMultiLineMode: true,
                            placeholder: field.placeholder || "",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            value: "{AppData>/" + field.name + "}",
                            showValueHelp: true,
                            showClearIcon: true,
                            valueHelpRequest: function (oEvent) {
                                const inputField = this;

                                const reqBody = {
                                    _valueListTarget: report.valueListTarget[field.name],
                                };

                                if (!reqBody._valueListTarget) {
                                    sap.m.MessageToast.show("Field does not have any OData ValueList reference");
                                    return;
                                }

                                sap.n.Adaptive.run(modelAppConfig.oData, reqBody, "ValueListSetup").then(function (annotations) {
                                    report.buildValueList(annotations, inputField, inputFieldLabel, field.name);
                                });
                            },
                            submit: function (oEvent) {
                                if (run) run();
                            },
                        });

                        selField.addValidator(function (args) {
                            return new sap.m.Token({ key: args.text, text: args.text });
                        });

                        // Add Tokens From Default Value
                        if (field.default) {
                            if (field.default.indexOf("[") > -1) {
                                const values = JSON.parse(field.default);
                                values.forEach(function (value) {
                                    selField.addToken(new sap.m.Token({ key: value, text: value }));
                                });
                            } else {
                                selField.addToken(new sap.m.Token({ key: field.default, text: field.default }));
                            }
                        }

                        form.addContent(selField);
                        break;

                    default:
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        var selField = new sap.m.SearchField({
                            width: "100%",
                            visible: field.visible,
                            value: "{AppData>/" + field.name + "}",
                            search: function (oEvent) {
                                if (run) run();
                            },
                        });

                        form.addContent(selField);
                        break;
                }
            });

            parent.addContent(form);
        } catch (e) {
            console.log(e);
        }
    },
};

report.start();
