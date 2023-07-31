var report = {
    metadata: metadata,
    childPage: null,
    groupBy: null,
    groupOrder: null,
    sortBy: null,
    sortOrder: null,
    colHeaders: null,
    pages: {},
    initId: null,

    pagination: {
        take: 10,
        index: 0,
        count: 0,
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
            // if (!config.settings.properties.report.autoRunFocus && runtime) return;
        } else {
            report.initId = config.id;
            modelAppData.setData({});
        }

        report.initId = config.id;

        // Set Default Values
        sap.n.Adaptive.setDefaultData(config, metadata);

        config.settings.properties.report.enablePagination = true;
        if (config.settings.properties.report.paginationRows) report.pagination.take = parseInt(config.settings.properties.report.paginationRows);

        if (config.settings.properties.report.enableDelete) {
            tabData.setMode("Delete");
        } else {
            tabData.setMode("None");
        }

        report.sortBy = config.settings.properties.table.initialSortField || null;
        report.sortOrder = config.settings.properties.table.initialSortOrder || "ASC";
        report.groupBy = config.settings.properties.table.initialGroupField || null;
        report.groupOrder = config.settings.properties.table.initialGroupOrder || "ASC";

        modeltabData.setData();

        modelAppConfig.setData(config);
        modelAppConfig.refresh();

        sap.n.Adaptive.init(modelAppConfig.oData)
            .then(function (data) {
                if (runtime) {
                    modelAppConfig.oData.settings.fieldsSel = data.fieldsSelection;
                    modelAppConfig.oData.settings.fieldsRun = data.fieldsReport;

                    if (modelAppConfig.oData.settings.fieldsSel) modelAppConfig.oData.settings.fieldsSel.sort(sort_by("fieldPos"));
                    if (modelAppConfig.oData.settings.fieldsRun) modelAppConfig.oData.settings.fieldsRun.sort(sort_by("fieldPos"));
                } else {
                    modelAppConfig.oData.settings.fieldsSel.forEach(function (selField) {
                        let selFieldRun = ModelData.FindFirst(data.fieldsSelection, "name", selField.name);
                        if (selFieldRun && selFieldRun.items) selField.items = selFieldRun.items;
                        if (selFieldRun && selFieldRun.default) selField.default = selFieldRun.default;
                    });
                }

                // Key Fields for GET Record
                if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.keyField && modelAppConfig.oData.settings.navigation.keyField.length) {
                    modelAppConfig.oData.settings.navigation.keyField.forEach(function (mapping) {
                        modelAppData.oData[mapping.fieldName] = modelAppConfig.oData.settings.data[mapping.key];
                    });
                }

                // Display Search Filter
                var showSearchField = true;
                if (modelAppConfig.oData.settings.properties.table.enablePagination) {
                    showSearchField = false;
                } else {
                    var searchFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, "enableFilter", true);
                    if (!searchFields.length) showSearchField = false;
                }

                if (tabData.setAutoPopinMode) {
                    if (modelAppConfig.oData.settings.properties.table.enableAutoPopin) {
                        tabData.setAutoPopinMode(true);
                    } else {
                        tabData.setAutoPopinMode(false);
                    }
                }

                // Parent Padding
                if (panMain.getParent().getParent().getParent().getParent().getApplyContentPadding) {
                    const padding = panMain.getParent().getParent().getParent().getParent().getApplyContentPadding();
                    if (!padding) panMain.addStyleClass("nepNoRadius");
                }

                report.buildTableColumns(tabData, modelAppConfig.oData, report.events);
                report.buildTableFilter(panFilter, tabData, modelAppConfig.oData, modelAppData.oData, showSearchField, report.run);

                report.run(runtime);
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
        let postData = null;
        const s = modelAppConfig.oData.settings;

        if (s.properties.report._navigationCreate && s.properties.report._navigationCreate.keyField) {
            postData = { _defaultData: {} };

            s.properties.report._navigationCreate.keyField.forEach(function (mapping) {
                if (mapping.value) postData._defaultData[mapping.fieldName] = mapping.value;

                if (mapping.key) {
                    if (modelAppConfig.oData.settings && modelAppConfig.oData.settings.data && modelAppConfig.oData.settings.data[mapping.key]) {
                        postData._defaultData[mapping.fieldName] = modelAppConfig.oData.settings.data[mapping.key];
                    } else {
                        postData._defaultData[mapping.fieldName] = modelAppData.oData[mapping.key];
                    }
                }
            });
        }

        sap.n.Adaptive.navigation(modelAppConfig.oData.settings.properties.report._navigationCreate, postData, report.events);
    },

    run: function () {
        let reqMethod = "List";
        let reqData = null;

        // Max Rows
        modelAppData.oData._pagination = {
            take: report.pagination.take,
            skip: 0,
        };

        // Sorting
        if (!report.sortBy && modelAppConfig.oData.settings.fieldsRun.length) report.sortBy = modelAppConfig.oData.settings.fieldsRun[0].name;

        modelAppData.oData._order = {};
        if (report.groupBy) modelAppData.oData._order[report.groupBy] = report.groupOrder;
        if (report.sortBy) modelAppData.oData._order[report.sortBy] = report.sortOrder;

        // POST Data Formatting
        modelAppConfig.oData.settings.fieldsSel.forEach(function (selField) {
            if (["CheckBox", "Switch"].includes(selField.type)) {
                if (!modelAppData.oData[selField.name]) delete modelAppData.oData[selField.name];
            }

            if (["MultiSelect", "MultiSelectLookup", "MultiSelectScript"].includes(selField.type)) {
                if (modelAppData.oData[selField.name] && !modelAppData.oData[selField.name].length) delete modelAppData.oData[selField.name];
            }

            if (modelAppData.oData[selField.name] === "") delete modelAppData.oData[selField.name];
        });

        sap.n.Adaptive.run(modelAppConfig.oData, modelAppData.oData, "List")
            .then(function (data) {
                if (data.hasOwnProperty("result")) {
                    modeltabData.setData(data.result);
                } else {
                    modeltabData.setData(data);
                }

                // Handle Group & Sorting
                if (report.groupBy) {
                    var sorters = [];
                    var binding = tabData.getBinding("items");

                    var ui5SortOrder = null;
                    var ui5GroupOrder = null;

                    if (report.sortOrder === "ASC" || report.sortOrder === "DESC") {
                        ui5SortOrder = report.sortOrder === "ASC" ? false : true;
                    } else {
                        ui5SortOrder = report.sortOrder;
                    }

                    if (report.groupOrder === "ASC" || report.groupOrder === "DESC") {
                        ui5GroupOrder = report.groupOrder === "ASC" ? false : true;
                    } else {
                        ui5GroupOrder = report.groupOrder;
                    }

                    sorters.push(
                        new sap.ui.model.Sorter(report.groupBy, ui5GroupOrder, function (oContext) {
                            return sap.n.Adaptive.grouping(modelAppConfig.oData, report.groupBy, oContext);
                        })
                    );
                    if (report.sortBy && !modelAppConfig.oData.settings.properties.table.enablePagination) sorters.push(new sap.ui.model.Sorter(report.sortBy, ui5SortOrder, false));

                    binding.sort(sorters);
                }

                // IconTabBarFilter Counter - Used as Child
                let tabFilter = panMain.getParent().getParent();

                if (tabFilter && tabFilter.getMetadata()._sClassName === "sap.m.IconTabFilter" && data) {
                    if (data.result) {
                        tabFilter.setCount(data.count);
                    } else {
                        tabFilter.setCount(data.length);
                    }
                }

                modelAppData.refresh(true);

                // Auto Update
                if (runtime && parseInt(modelAppConfig.oData.settings.properties.report.updateTime)) {
                    setTimeout(function () {
                        if (!AppCache.isRestricted && !AppCache.isOffline) report.run();
                    }, parseInt(modelAppConfig.oData.settings.properties.report.updateTime) * 1000 * 60);
                }
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
            });
    },

    buildTableFilter: function (parent, table, config, appdata, enableSearch, run) {
        try {
            parent.destroyContent();
            if (!config) return;

            let numFields = ModelData.Find(config.settings.fieldsSel, "visible", true);

            if (!numFields.length && !enableSearch) return;

            let numFilters = numFields ? numFields.length : 1;
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
                            let searchField = this;
                            let filters = [];
                            let bindingItems = table.getBinding("items");
                            let fieldsFilter = ModelData.Find(config.settings.fieldsRun, "enableFilter", true);

                            fieldsFilter.forEach(function ({ name, valueType }) {
                                filters.push(new sap.ui.model.Filter(valueType ? `${name}_value` : name, "Contains", searchField.getValue()));
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

            config.settings.fieldsSel.forEach(function (field) {
                const { name, type } = field;
                if (field.default) {
                    if (["MultiSelect", "MultiSelectLookup", "MultiSelectScript"].includes(type)) {
                        if (typeof field.default === "object") {
                            appdata[name] = field.default;
                        } else {
                            if (field.default.indexOf("[") > -1) {
                                appdata[name] = JSON.parse(field.default);
                            } else {
                                appdata[name] = field.default;
                            }
                        }
                    } else if (["Switch", "CheckBox"].includes(type)) {
                        if (field.default === "true" || field.default === "1" || field.default === "X") {
                            appdata[name] = true;
                        } else {
                            delete appdata[name];
                        }
                    } else if (["DateRange"].includes(type)) {
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
                }

                if (field.required) delete appdata[`${name}ValueState`];

                const fieldValue = `{AppData>/${name}}`;
                const fieldValueState = `{AppData>/${name}ValueState}`;

                function onChange(_oEvent) {
                    if (run) run();
                }

                switch (type) {
                    case "MultiSelect":
                    case "MultiSelectLookup":
                    case "MultiSelectScript":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );

                        let multiField = new sap.m.MultiComboBox({
                            width: "100%",
                            visible: field.visible,
                            selectedKeys: fieldValue,
                            valueState: fieldValueState,
                            showSecondaryValues: true,
                            selectionChange: onChange,
                        });

                        if (field.items) {
                            field.items.sort(sort_by("text"));
                            field.items.forEach(function ({ key, text, additionalText }) {
                                multiField.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                            });
                        }

                        form.addContent(multiField);
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

                        let singleField = new sap.m.ComboBox({
                            width: "100%",
                            visible: field.visible,
                            selectedKey: fieldValue,
                            valueState: fieldValueState,
                            showSecondaryValues: true,
                            change: onChange,
                        });
                        singleField.addItem(new sap.ui.core.Item({ key: "", text: "" }));

                        if (field.items) {
                            field.items.sort(sort_by("text"));
                            field.items.forEach(function ({ key, text, additionalText }) {
                                singleField.addItem(new sap.ui.core.ListItem({ key, text, additionalText }));
                            });
                        }

                        form.addContent(singleField);
                        break;

                    case "DateRange":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );
                        form.addContent(
                            new sap.m.DateRangeSelection({
                                width: "100%",
                                visible: field.visible,
                                dateValue: fieldValue,
                                secondDateValue: `{AppData>/${name}_end}`,
                                valueState: fieldValueState,
                                change: onChange,
                            })
                        );
                        break;

                    case "CheckBox":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );
                        form.addContent(
                            new sap.m.CheckBox({
                                width: "100%",
                                visible: field.visible,
                                useEntireWidth: true,
                                selected: fieldValue,
                                valueState: fieldValueState,
                                select: onChange,
                            })
                        );
                        break;

                    case "Switch":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );
                        form.addContent(
                            new sap.m.Switch({
                                visible: field.visible,
                                state: fieldValue,
                                change: onChange,
                            })
                        );
                        break;

                    default:
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                            })
                        );
                        form.addContent(
                            new sap.m.SearchField({
                                width: "100%",
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

    buildTableColumns: function (table, config, events) {
        try {
            report.colHeaders = {};
            const props = config.settings.properties;
            if (props.table.enableCompact) {
                table.addStyleClass("sapUiSizeCompact");
            } else {
                table.removeStyleClass("sapUiSizeCompact");
            }

            try {
                table.destroyColumns();
            } catch (e) {}

            let col = new sap.m.ColumnListItem({ selected: "{_sel}" });

            // Handle Item Press
            if (config.settings.events && config.settings.events.valueRequest) {
                col.setType("Active");
                col.attachPress(function (evt) {
                    let ctx = evt.oSource.getBindingContext();
                    let colData = ctx.getObject();

                    let fieldValue = colData[config.settings.events.valueRequestKey] || colData["id"];
                    let fieldComp = sap.ui.getCore().byId(config.settings.events.valueRequestField);
                    if (fieldValue && fieldComp) fieldComp.setValue(fieldValue);

                    report.close();
                });
            } else {
                const nav = props.report._navigationItemPress;
                if (nav) {
                    col.setType("Active");
                    col.attachPress(function (evt) {
                        let ctx = evt.oSource.getBindingContext();
                        let colData = ctx.getObject();

                        if (nav.dialogTitleField) {
                            nav.dialogTitleFieldText = colData[nav.dialogTitleField + "_value"] || colData[nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(nav, colData, events, table.sId);
                    });
                }
            }

            function onChange(oEvent) {
                onFieldChangeEvent(oEvent, events);
            }

            // Build Columns
            config.settings.fieldsRun.forEach(function (f) {
                if (!f.visible) return;

                let ColumnHeader = new sap.m.Column({
                    width: f.width,
                    minScreenWidth: f.minScreenWidth,
                });

                if (f.hAlign) ColumnHeader.setHAlign(f.hAlign);
                if (f.vAlign) ColumnHeader.setVAlign(f.vAlign);
                if (f.demandPopin) ColumnHeader.setDemandPopin(f.demandPopin);
                if (f.popinDisplay) ColumnHeader.setPopinDisplay(f.popinDisplay);

                // Sorting
                if (f.enableSort || f.enableGroup) {
                    var _column_delegate = {
                        onclick: function (e) {
                            if (events.onHeaderClick) events.onHeaderClick(f, ColumnHeader);
                        },
                    };
                    ColumnHeader.addEventDelegate(_column_delegate);

                    ColumnHeader.exit = function () {
                        ColumnHeader.removeEventDelegate(_column_delegate);
                    };

                    ColumnHeader.setStyleClass("nepMTableSortCell");

                    report.colHeaders[f.name] = ColumnHeader;
                }

                // Enable Sum
                if (f.enableSum && f.type === "ObjectNumber") {
                    const prefix = "AppConfig>/settings/properties/table/_sum/";
                    let sumField = new sap.m.ObjectNumber({
                        number: `{${prefix}${f.name}}`,
                        unit: `{${prefix}${f.name}_unit}`,
                    });
                    ColumnHeader.setFooter(sumField);
                }

                const HBox = new sap.m.HBox();
                HBox.addItem(
                    new sap.m.Label({
                        text: sap.n.Adaptive.translateFieldLabel(f, config),
                        wrapping: true,
                    })
                );

                ColumnHeader.setHeader(HBox);
                table.addColumn(ColumnHeader);

                let newField = null;
                let formatterProp = f.type === "ObjectNumber" ? "number" : "text";
                let opts;

                switch (f.type) {
                    case "Link":
                        opts = {
                            text: getFieldBindingText(f),
                            wrapping: getFieldWrapping(f),
                            press: function (oEvent) {
                                if (!f._navigation) return;

                                const ctx = oEvent.oSource.getBindingContext();
                                const colData = ctx.getObject();

                                // Sidepanel Lookup Text
                                if (f?._navigation?.openAs === "S") {
                                    const k = f._navigation.dialogTitleField;
                                    const { valueType } = ModelData.FindFirst(config.settings.fieldsRun, "name", k);
                                    f._navigation.dialogTitleFieldText = colData[valueType ? `${k}_value` : k];
                                }

                                // Add pressed fieldname
                                events.objectPressed = f.name;

                                sap.n.Adaptive.navigation(f._navigation, colData, events, newField.sId);
                            },
                        };

                        if (f.linkHrefType) {
                            opts.href = `{${f.name}_href}`;
                            opts.target = "_blank";
                        }

                        newField = new sap.m.Link(opts);
                        break;

                    case "ObjectNumber":
                        opts = {
                            number: getFieldBindingText(f),
                        };

                        if (f.numberUnitType) opts.unit = `{${f.name}_unit}`;
                        if (f.numberStateType) opts.state = `{${f.name}_state}`;

                        newField = new sap.m.ObjectNumber(opts);

                        if (f.numberUnitType && f.numberUnitFormatter) {
                            newField.bindProperty("unit", {
                                parts: [`${f.name}_unit`],
                                formatter: function (fieldName) {
                                    if (typeof fieldName === "undefined" || fieldName === null) return;
                                    return sap.n.Adaptive.formatter(fieldName, f.numberUnitFormatter);
                                },
                            });
                        }
                        break;

                    case "ObjectStatus":
                        const k = f.name;
                        opts = {
                            text: getFieldBindingText(f),
                        };

                        if (f.statusInverted) opts.inverted = true;
                        if (f.statusTitleType) opts.title = `{${k}_title}`;
                        if (f.statusIconType) opts.icon = `{${k}_icon}`;
                        if (f.statusStateType) opts.state = `{${k}_state}`;

                        newField = new sap.m.ObjectStatus(opts);

                        if (f.statusTitleType && f.statusTitleFormatter) {
                            newField.bindProperty("title", {
                                parts: [`${f.name}_title`],
                                formatter: function (name) {
                                    if (typeof name === "undefined" || name === null) return;
                                    return sap.n.Adaptive.formatter(name, f.statusTitleFormatter);
                                },
                            });
                        }
                        break;

                    case "CheckBox":
                        newField = new sap.m.CheckBox({
                            selected: getFieldBindingText(f),
                            editable: isFieldEditable(f),
                            wrapping: getFieldWrapping(f),
                            select: onChange,
                        });
                        break;

                    case "Switch":
                        newField = new sap.m.Switch({
                            state: getFieldBindingText(f),
                            enabled: isFieldEditable(f),
                            change: onChange,
                        });
                        break;

                    case "Image":
                        newField = new sap.m.Image({
                            src: getFieldBindingText(f),
                            height: "32px",
                        });
                        break;

                    case "Icon":
                        newField = new sap.ui.core.Icon({
                            src: getFieldBindingText(f),
                        });
                        break;

                    case "Input":
                        newField = new sap.m.Input({
                            value: getFieldBindingText(f),
                            editable: isFieldEditable(f),
                            placeholder: getFieldPlaceholder(f),
                            textAlign: f.hAlign,
                            change: onChange,
                        });
                        break;

                    case "DatePicker":
                        newField = new sap.m.DatePicker({
                            visible: f.visible,
                            editable: isFieldEditable(f),
                            placeholder: getFieldPlaceholder(f),
                            displayFormat: f.displayFormat,
                            dateValue: getFieldBindingText(f),
                            change: onChange,
                        });

                        newField.bindProperty("dateValue", {
                            parts: [f.name],
                            formatter: getDateFormatter(f.name),
                        });
                        break;

                    case "DateTimePicker":
                        newField = new sap.m.DateTimePicker({
                            visible: f.visible,
                            editable: isFieldEditable(f),
                            placeholder: getFieldPlaceholder(f),
                            secondsStep: parseInt(f.dateTimePickerSecondsStep) || 1,
                            minutesStep: parseInt(f.dateTimePickerMinutesStep) || 1,
                            dateValue: getFieldBindingText(f),
                            change: onChange,
                        });

                        newField.bindProperty("dateValue", {
                            parts: [f.name],
                            formatter: getDateFormatter(f.name),
                        });
                        break;

                    case "SingleSelectLookup":
                    case "SingleSelectScript":
                        newField = new sap.m.ComboBox({
                            width: "100%",
                            visible: f.visible,
                            editable: isFieldEditable(f),
                            placeholder: getFieldPlaceholder(f),
                            selectedKey: getFieldBindingText(f),
                            showSecondaryValues: true,
                            selectionChange: onChange,
                        });

                        if (f.items) f.items.sort(sort_by("text"));

                        newField.addItem(new sap.ui.core.Item({ key: "", text: "" }));
                        f.items.forEach(function (item) {
                            newField.addItem(
                                new sap.ui.core.ListItem({
                                    key: item.key,
                                    text: item.text,
                                    additionalText: item.additionalText,
                                })
                            );
                        });
                        break;

                    case "MultiSelectLookup":
                    case "MultiSelectScript":
                        newField = new sap.m.MultiComboBox({
                            width: "100%",
                            visible: f.visible,
                            selectedKeys: getFieldBindingText(f),
                            placeholder: getFieldPlaceholder(f),
                            showSecondaryValues: true,
                            selectionChange: onChange,
                        });

                        if (f.items) f.items.sort(sort_by("text"));

                        f.items.forEach(function (item) {
                            newField.addItem(
                                new sap.ui.core.ListItem({
                                    key: item.key,
                                    text: item.text,
                                    additionalText: item.additionalText,
                                })
                            );
                        });
                        break;

                    default:
                        newField = new sap.m.Text({
                            text: getFieldBindingText(f),
                            wrapping: getFieldWrapping(f),
                        });
                        break;
                }

                col.addCell(newField);

                // Formatter
                if (f.formatter) {
                    let fieldName = f.valueType ? f.name + "_value" : f.name;
                    newField.bindProperty(formatterProp, {
                        parts: [fieldName],
                        formatter: function (fieldName) {
                            if (typeof fieldName === "undefined" || fieldName === null) return;
                            return sap.n.Adaptive.formatter(fieldName, f.formatter);
                        },
                    });
                }
            });

            // Row Action 1
            const t = config.settings.properties.table;
            if (t.enableAction1) {
                let ColumnHeader = new sap.m.Column({
                    width: t.action1Width || "",
                });
                table.addColumn(ColumnHeader);

                let newField = new sap.m.Button({
                    text: t.action1Text,
                    icon: t.action1Icon,
                    type: t.action1Type,
                    press: function (oEvent) {
                        if (!t._action1Nav) return;

                        let context = oEvent.oSource.getBindingContext();
                        let columnData = context.getObject();

                        if (t._action1Nav.dialogTitleField) {
                            t._action1Nav.dialogTitleFieldText = columnData[t._action1Nav.dialogTitleField + "_value"] || columnData[t._action1Nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(t._action1Nav, columnData, events, table.sId);
                    },
                });

                col.addCell(newField);
            }

            // Row Action 2
            if (t.enableAction2) {
                let ColumnHeader = new sap.m.Column({
                    width: t.action2Width || "",
                });

                table.addColumn(ColumnHeader);
                let newField = new sap.m.Button({
                    text: t.action2Text,
                    icon: t.action2Icon,
                    type: t.action2Type,
                    width: t.action2Width || "",
                    press: function (oEvent) {
                        if (!t._action2Nav) return;

                        let context = oEvent.oSource.getBindingContext();
                        let columnData = context.getObject();
                        if (t._action2Nav.dialogTitleField) {
                            t._action2Nav.dialogTitleFieldText = columnData[t._action2Nav.dialogTitleField + "_value"] || columnData[t._action2Nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(t._action2Nav, columnData, events, table.sId);
                    },
                });

                col.addCell(newField);
            }

            // Row Action 3
            if (t.enableAction3) {
                let ColumnHeader = new sap.m.Column({
                    width: t.action3Width || "",
                });

                table.addColumn(ColumnHeader);
                let newField = new sap.m.Button({
                    text: t.action3Text,
                    icon: t.action3Icon,
                    type: t.action3Type,
                    width: t.action3Width || "",
                    press: function (oEvent) {
                        if (!t._action3Nav) return;

                        let context = oEvent.oSource.getBindingContext();
                        let columnData = context.getObject();

                        if (t._action3Nav.dialogTitleField) {
                            t._action3Nav.dialogTitleFieldText = columnData[t._action3Nav.dialogTitleField + "_value"] || columnData[t._action3Nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(t._action3Nav, columnData, events, table.sId);
                    },
                });

                col.addCell(newField);
            }

            // Table - Aggregation
            table.bindAggregation("items", { path: "/", template: col, templateShareable: false });
        } catch (e) {
            console.log(e);
        }
    },

    handleTableSortIndicator: function () {
        if (!report.sortBy) return;

        // Clear All
        const keys = Object.keys(report.colHeaders);

        keys.forEach(function (key) {
            report.colHeaders[key].setSortIndicator("None");
        });

        if (report.colHeaders[report.sortBy]) {
            const sortIndicator = report.sortOrder === "ASC" ? "Ascending" : "Descending";
            report.colHeaders[report.sortBy].setSortIndicator(sortIndicator);
        }
    },
};

report.start();
