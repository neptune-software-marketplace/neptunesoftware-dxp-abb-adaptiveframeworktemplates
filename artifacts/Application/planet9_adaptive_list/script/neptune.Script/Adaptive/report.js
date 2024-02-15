const report = {
    metadata: metadata,
    childPage: null,
    groupBy: null,
    groupOrder: null,
    sortBy: null,
    sortOrder: null,
    pages: {},
    initId: null,
    tabObject: null,
    filterObject: null,
    colHeaders: null,
    valueListTarget: {},

    pagination: {
        take: 100,
        index: 0,
        count: 0,
    },

    events: {
        afterChildLoad: function () {
            let parentApp = oApp;

            if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.sourceTarget) {
                parentApp = sap.ui.getCore().byId(modelAppConfig.oData.settings.navigation.sourceTarget);
            }

            parentApp.to(report.childPage);
        },
        afterChildSave: function () {
            report.run();
        },
        onChildBack: function () {
            let parentApp = oApp;

            if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.sourceTarget) {
                parentApp = sap.ui.getCore().byId(modelAppConfig.oData.settings.navigation.sourceTarget);
            }

            parentApp.back();
        },
        onNavigatePage: function (page) {
            let parentApp = oApp;

            if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.sourceTarget) {
                parentApp = sap.ui.getCore().byId(modelAppConfig.oData.settings.navigation.sourceTarget);
            }

            if (!report.pages[page.sId]) parentApp.addPage(page);
            report.childPage = page;
            report.pages[page.sId] = true;
            parentApp.to(page);
        },
        onHeaderClick: function (field, button) {
            modelpopHeader.setData(field);
            popHeader.openBy(button);
        },
        onNavigateDialog: function (dialog) {
            dialog.open();
        },
        onTableChange: function (data) {
            report.save(data);
        },
        refresh: function () {
            report.run();
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
        report.tabObject = tabData;
        report.filterObject = oPanFilter;
        oApp.to(oPageDynamic);

        // Set Default Values
        sap.n.Adaptive.setDefaultData(config, metadata);

        // Prevent Back Button in Launchpad
        sap.n.Shell.attachBeforeBack(function (oEvent) {
            if (oApp.getCurrentPage() !== oPageDynamic) {
                oApp.back();
                oEvent.preventDefault();
            }
        });

        const t = config.settings.properties.table;

        if (t.paginationRows) {
            report.pagination.take = parseInt(t.paginationRows);
            toolPaginationItemDefault.setKey(t.paginationRows);
            toolPaginationItemDefault.setText(t.paginationRows);
        }

        if (config.settings.properties.report.avatarBackgroundColor) {
            oPageHeaderIcon.setBackgroundColor(config.settings.properties.report.avatarBackgroundColor);
        } else {
            oPageHeaderIcon.setBackgroundColor();
        }

        // Table Mode
        if (!config.settings.properties.report.enableDelete && !config.settings.properties.report.enableMultiSelect) report.tabObject.setMode("None");
        if (config.settings.properties.report.enableDelete && !config.settings.properties.report.enableMultiSelect) report.tabObject.setMode("Delete");
        if (config.settings.properties.report.enableMultiSelect) report.tabObject.setMode("MultiSelect");

        if (report.tabObject.setAutoPopinMode) {
            if (config.settings.properties.table.enableAutoPopin) {
                report.tabObject.setAutoPopinMode(true);
            } else {
                report.tabObject.setAutoPopinMode(false);
            }
        }

        report.sortBy = t.initialSortField || null;
        report.sortOrder = t.initialSortOrder || "ASC";
        report.groupBy = t.initialGroupField || null;
        report.groupOrder = t.initialGroupOrder || "ASC";
        report.tabObject.getModel().setData();

        // Language
        if (runtime) {
            if (AppCache && AppCache.userInfo && AppCache.userInfo.language) config.language = AppCache.userInfo.language;
        } else {
            const language = getAdaptiveEditorPreviewLanguage();
            if (language) {
                config.language = language;
            }
        }

        modelAppConfig.setData(config);
        modelAppConfig.refresh();

        // Hide Header
        if (config.settings.properties.report.hideHeader) {
            oPageTitle.setVisible(false);
        }

        // Action Button Left
        if (config.settings.properties.report.actionButtonLeft) {
            oPageTitle.addStyleClass("nepFlexLeft");
            oPageHeaderBox.addStyleClass("sapUiSmallMarginBottom");
        } else {
            oPageTitle.removeStyleClass("nepFlexLeft");
            oPageHeaderBox.removeStyleClass("sapUiSmallMarginBottom");
        }

        // Translation - Properties
        oPageHeaderTitle.setText(sap.n.Adaptive.translateProperty("report", "title", config));
        oPageHeaderSubTitle.setText(sap.n.Adaptive.translateProperty("report", "subTitle", config));
        oPageHeaderVariant.setText(sap.n.Adaptive.translateProperty("report", "subTitle", config));
        oPageExport.setText(sap.n.Adaptive.translateProperty("report", "textButtonExport", config));
        oPageImport.setText(sap.n.Adaptive.translateProperty("report", "textButtonImport", config));
        oPageMultiSelect.setText(sap.n.Adaptive.translateProperty("report", "textButtonMultiSelect", config));
        oPageCreate.setText(sap.n.Adaptive.translateProperty("report", "textButtonCreate", config));
        oPageUpdate.setText(sap.n.Adaptive.translateProperty("report", "textButtonRun", config));
        oPageClose.setText(sap.n.Adaptive.translateProperty("report", "textButtonClose", config));

        report.tabObject.setHeaderText(sap.n.Adaptive.translateProperty("table", "headerText", config));
        report.tabObject.setFooterText(sap.n.Adaptive.translateProperty("table", "footerText", config));
        report.tabObject.setNoDataText(sap.n.Adaptive.translateProperty("table", "noDataText", config));

        // Variant
        if (config.settings.properties.report.enableVariant) report.variantList();

        // Init
        sap.n.Adaptive.init({ id: modelAppConfig.oData.id })
            .then(function (data) {
                // Open Dialog
                if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().open) {
                    oApp.getParent().getParent().open();
                }

                const s = modelAppConfig.oData.settings;

                if (runtime) {
                    s.fieldsSel = data.fieldsSelection;
                    s.fieldsRun = data.fieldsReport;

                    if (s.fieldsSel) s.fieldsSel.sort(sort_by("fieldPos"));
                    if (s.fieldsRun) s.fieldsRun.sort(sort_by("fieldPos"));
                } else {
                    s.fieldsSel.forEach(function (selField) {
                        let selFieldRun = ModelData.FindFirst(data.fieldsSelection, "name", selField.name);
                        if (selFieldRun && selFieldRun.items) selField.items = selFieldRun.items;
                        if (selFieldRun && selFieldRun.default) selField.default = selFieldRun.default;
                    });

                    s.fieldsRun.forEach(function (runField) {
                        let selFieldRun = ModelData.FindFirst(data.fieldsReport, "name", runField.name);
                        if (selFieldRun && selFieldRun.items) runField.items = selFieldRun.items;
                        if (selFieldRun && selFieldRun.default) runField.default = selFieldRun.default;
                    });
                }

                // Key Fields for GET Record
                if (s.navigation && s.navigation.keyField && s.navigation.keyField.length) {
                    s.navigation.keyField.forEach(function (mapping) {
                        if (mapping.value) modelAppData.oData[mapping.fieldName] = mapping.value;
                        if (mapping.key) modelAppData.oData[mapping.fieldName] = s.data[mapping.key];
                    });
                }

                // Display Search Filter
                let showSearchField = true;
                if (s.properties.table.enablePagination) {
                    showSearchField = false;
                } else {
                    const searchFields = ModelData.Find(s.fieldsRun, "enableFilter", true);
                    if (!searchFields.length) showSearchField = false;
                }

                // Show/Hide Header
                if (!showSearchField) {
                    let selFields = ModelData.Find(s.fieldsSel, "visible", true);
                    if (!selFields.length) {
                        oPageHeader.setVisible(false);
                    } else {
                        oPageHeader.setVisible(true);
                    }
                } else {
                    oPageHeader.setVisible(true);
                }

                // Parse Extra Data from FieldCatalog
                report.valueListTarget = {};
                data.fieldCatalog.forEach(function (catField) {
                    if (catField.valueListTarget) report.valueListTarget[catField.name] = catField.valueListTarget;
                });

                // Build Filter
                report.buildTableFilter(report.filterObject, report.tabObject, modelAppConfig.oData, modelAppData.oData, showSearchField, report.run);

                // Build Table Columns
                report.buildTableColumns(report.tabObject, modelAppConfig.oData, report.events);

                // Auto Run
                if (s.properties.report.autoRun) report.run();
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) sap.m.MessageToast.show(data.responseJSON.status);
            });
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

    handlePagination: function () {
        let maxIndex = report.pagination.count / report.pagination.take;
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

        let numItems = 0;
        let maxItems = 6;
        let startItem = report.pagination.index - maxItems / 2;

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
                return;
            }
        });
    },

    run: function (keepIndex) {
        const d = JSON.parse(modelAppData.getJSON());
        const { fieldsRun, properties } = modelAppConfig.oData.settings;

        // Sorting, if no field is set, find first visible field
        if (!report.sortBy && fieldsRun.length) {
            fieldsRun.forEach(function (field) {
                if (report.sortBy) return;
                if (field.visible) report.sortBy = field.name;
            });
        }

        // Apply Initial SortingIndicator
        report.handleTableSortIndicator();

        // Pagination
        if (properties.table.enablePagination) {
            if (!keepIndex) report.pagination.index = 0;

            // Records to Get
            const { pagination, groupBy, sortBy } = report;
            d._pagination = {
                take: pagination.take,
                skip: pagination.take * pagination.index,
            };

            d._order = {};
            if (groupBy) d._order[groupBy] = report.groupOrder;
            if (sortBy) d._order[sortBy] = report.sortOrder;
        } else {
            delete d._pagination;
            delete d._order;
        }

        // POST Data Formatting
        modelAppConfig.oData.settings.fieldsSel.forEach(function (selField) {
            const { type, name } = selField;

            if (["CheckBox", "Switch"].includes(type)) {
                if (!d[name]) d[name] = false;
            }

            if (["MultiSelect", "MultiSelectLookup", "MultiSelectScript"].includes(type)) {
                if (d[name] && !d[name].length) delete d[selField.name];
            }

            if (["ValueHelpOData"].includes(type)) {
                const filter = sap.ui.getCore().byId("filter" + name);
                const tokens = filter.getTokens();

                if (tokens && tokens.length) {
                    d[name] = [];
                    for (let i = 0; i < tokens.length; i++) {
                        const token = tokens[i];
                        d[name].push(token.getKey());
                    }
                } else {
                    delete d[name];
                }
            }

            if (d[name] === "") delete d[name];
            if (Array.isArray(d[name]) && !d[name].length) delete d[name];
        });

        report.tabObject.setBusy(true);

        sap.n.Adaptive.run(modelAppConfig.oData, d, "List")
            .then(function (data) {
                // Required
                if (data.status && data.status === "required") {
                    const requiredFieldsMsg = sap.n.Adaptive.translateProperty('report', 'requiredFieldsToast', modelAppConfig.getData())
                    sap.m.MessageToast.show(requiredFieldsMsg);
                    return;
                }

                // Message from Server Script
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

                // set to the correct data source
                const reportData = data.hasOwnProperty("result") ? data.result : data;

                // AfterRun Formatting of Data
                modelAppConfig.oData.settings.fieldsRun.forEach(function (runField) {
                    if (["MultiSelectLookup", "MultiSelectScript"].includes(runField.type)) {
                        reportData.forEach(function (data) {
                            if (data && data[runField.name]) {
                                const dataArray = data[runField.name].split(",");
                                if (dataArray.length > 0) data[runField.name] = dataArray;
                            }
                        });
                    }

                    // If lookup and no lookup is configured + items from setup script -> local lookup
                    if (runField.valueType === "Lookup" && !runField.valueLookup && runField.items) {
                        reportData.forEach(function (data) {
                            if (data && data[runField.name]) {
                                const lookupData = runField.items.find((obj) => obj.key === data[runField.name]);
                                if (lookupData) {
                                    data[runField.name + "_value"] = lookupData.text;
                                } else {
                                    data[runField.name + "_value"] = data[runField.name];
                                }
                            }
                        });
                    }
                });

                // Set Table Data
                report.tabObject.getModel().setData(reportData);

                if (data.hasOwnProperty("result")) {
                    oPageHeaderNumber.setNumber(`(${data.count})`);
                    report.pagination.count = data.count;
                    report.handlePagination();
                } else {
                    oPageHeaderNumber.setNumber(`(${data.length})`);
                }

                // IconTabBarFilter Counter - Used as Child
                let tabFilter = oApp.getParent().getParent();

                if (tabFilter && tabFilter.getMetadata()._sClassName === "sap.m.IconTabFilter") {
                    if (data.count) {
                        tabFilter.setCount(data.count);
                    } else {
                        tabFilter.setCount(data.length);
                    }

                    oPageHeaderTitle.addStyleClass("nepTitleSmall");
                    oPageHeaderNumber.addStyleClass("nepCounterSmall");
                    oPageHeaderNumber.setVisible(false);
                    oPageHeaderIcon.setDisplaySize("XS");
                }

                // Sorting Client Side
                report.handleSortingClient();

                // Sum
                const sumFields = ModelData.Find(modelAppConfig.oData.settings.fieldsRun, ["enableSum", "type"], [true, "ObjectNumber"]);

                if (sumFields.length) {
                    const props = modelAppConfig.oData.settings.properties;
                    props.table._sum = {};

                    // Set all sum to 0
                    sumFields.forEach(function (sumField) {
                        props.table._sum[sumField.name] = 0;
                    });

                    // Calculate sum
                    report.tabObject.getModel().oData.forEach(function (data) {
                        sumFields.forEach(function (sumField) {
                            const { name } = sumField;
                            props.table._sum[name] += parseFloat(data[name]);

                            if (sumField.numberUnitType) {
                                props.table._sum[`${name}_unit`] = data[name + "_unit_value"];
                            }
                        });
                    });

                    // Calculate average
                    sumFields.forEach(function (sumField) {
                        if (sumField.sumCalculation === "Average") {
                            props.table._sum[sumField.name] = props.table._sum[sumField.name] / report.tabObject.getModel().oData.length;
                        }
                    });

                    // Format Number
                    sumFields.forEach(function (sumField) {
                        if (sumField.formatter) {
                            props.table._sum[sumField.name] = sap.n.Adaptive.formatter(props.table._sum[sumField.name], sumField.formatter);
                        }
                    });

                    modelAppConfig.refresh();
                }
            })
            .catch(function ({ responseJSON }) {
                if (responseJSON && responseJSON.status) sap.m.MessageToast.show(responseJSON.status);
            })
            .finally(function () {
                modelAppData.refresh(true);
                report.tabObject.setBusy(false);
            });
    },

    handleSortingClient: function () {
        let sorters = [];
        let binding = report.tabObject.getBinding("items");

        // Handle Group
        if (report.groupBy) {
            let ui5GroupOrder = null;

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
        }

        // Handle Sorting
        if (report.sortBy && !modelAppConfig.oData.settings.properties.table.enablePagination) {
            let ui5SortOrder = null;
            if (report.sortOrder === "ASC" || report.sortOrder === "DESC") {
                ui5SortOrder = report.sortOrder === "ASC" ? false : true;
            } else {
                ui5SortOrder = report.sortOrder;
            }

            let sortField = ModelData.FindFirst(modelAppConfig.oData.settings.fieldsRun, "name", report.sortBy);
            let sortBy = sortField.valueType ? sortField.name + "_value" : sortField.name;

            sorters.push(new sap.ui.model.Sorter(sortBy, ui5SortOrder, false));
        }

        binding.sort(sorters);
    },

    delete: function (data) {
        const config = modelAppConfig.getData();
        const deleteMessage = sap.n.Adaptive.translateProperty("report", "textConfirmDelete", config);
        const deleteTitle = sap.n.Adaptive.translateProperty("report", "titleConfirmDelete", config);
        sap.m.MessageBox.show(deleteMessage, {
            title: deleteTitle,
            icon: sap.m.MessageBox.Icon.ERROR,
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
            onClose: function (oAction) {
                if (oAction === "YES") {
                    const { id } = data;
                    sap.n.Adaptive.run(config, { id, data }, "Delete").then(function (data) {
                        // Message from Server Script
                        if (data.message && data.message.text) {
                            if (data.message.type) {
                                sap.m.MessageBox[data.message.type](data.message.text);
                            } else {
                                sap.m.MessageBox.information(data.message.text);
                            }
                            return;
                        }

                        report.run();

                        if (sap.n.Shell.closeSidepanelTab) sap.n.Shell.closeSidepanelTab(id);
                    });
                }
            },
        });
    },

    create: function () {
        // Pass mapped data
        let postData = null;
        const s = modelAppConfig.oData.settings;
        if (s.properties.report._navigationCreate) {
            if (s.properties.report._navigationCreate.keyField) {
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

            sap.n.Adaptive.navigation(s.properties.report._navigationCreate, postData, report.events);
        } else {
            let tabModel = report.tabObject.getModel();
            if (!tabModel.oData) tabModel.oData = [];
            tabModel.oData.push({});
            tabModel.refresh();
        }
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

    multiselect: function () {
        const dataSelected = [];
        report.tabObject.getModel().oData.forEach(function (data) {
            if (data._sel) dataSelected.push(data);
        });

        sap.n.Adaptive.navigation(modelAppConfig.oData.settings.properties.report._navigationMultiSelect, dataSelected, report.events);
    },

    export: function () {
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

    exportDownload: function () {
        let columns = [];
        const s = modelAppConfig.oData.settings;

        columns.push({ name: "id", template: { content: { path: "id" } } });
        s.fieldsRun.forEach(function (field) {
            let fieldName = field.valueType ? field.name + "_value" : field.name;

            if (field.formatter) {
                columns.push({
                    name: field.text,
                    template: {
                        content: {
                            parts: [fieldName],
                            formatter: function (fieldName) {
                                if (typeof fieldName === "undefined" || fieldName === null) return;
                                return sap.n.Adaptive.formatter(fieldName, field.formatter);
                            },
                        },
                    },
                });
            } else {
                columns.push({
                    name: field.text,
                    template: {
                        content: {
                            path: fieldName,
                        },
                    },
                });
            }
        });

        let oExport = new sap.ui.core.util.Export({
            exportType: new sap.ui.core.util.ExportTypeCSV({ separatorChar: ";" }),
            models: modelExportData,
            rows: { path: "/" },
            columns: columns,
        });

        oExport
            .generate()
            .done(function (sContent) {
                let fileName = s.properties.report.title;
                if (s.properties.report.subTitle) fileName += "_" + s.properties.report.subTitle;
                oExport.saveFile(fileName);
            })
            .always(function () {
                this.destroy();
            });

        report.tabObject.setBusy(false);
    },

    importFile: function (file) {
        try {
            function importData(data) {
                if (data.length === 0) {
                    sap.m.MessageToast.show("Imported Successfully");
                    oApp.setBusy(false);
                    report.run();

                    document.getElementById("adaptiveListImport").value = "";
                    return;
                }

                const COUNT = 500;
                Promise.all(
                    data.slice(0, COUNT).map(function (item) {
                        return sap.n.Adaptive.run(modelAppConfig.oData, item, "Save");
                    })
                )
                    .catch(function (_) {})
                    .finally(function (_) {
                        importData(data.slice(COUNT));
                    });
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Encoded = event.target.result.split(",")[1];
                const csv = Base64.decode(base64Encoded);
                const data = report.convertCSVtoJSON(csv);
                importData(data);
            };
            reader.readAsDataURL(file);
        } catch (e) {
            oApp.setBusy(false);
            console.log(e);
            document.getElementById("adaptiveListImport").value = "";
        }
    },

    import: function (evt) {
        oApp.setBusy(true);
        const files = evt.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            report.importFile(file);
        }
    },

    mapCSVHeaderLabelToFieldName: function (headerLabel) {
        const fieldCatalog = modelAppConfig.oData.settings.fieldCatalog;

        // try to map header labels to exact field names
        for (let i = 0; i < fieldCatalog.length; i++) {
            const { name } = fieldCatalog[i];

            // exact match, with field name
            if (headerLabel === name) return name;
        }

        // if all exact name match fails, we try to match header labels
        // to title text
        for (let i = 0; i < fieldCatalog.length; i++) {
            const { name, label } = fieldCatalog[i];

            // exact match, with field label
            if (headerLabel === label) return name;
        }

        // if all matches fail return header label as is
        return headerLabel;
    },

    convertCSVtoJSON: function (csv) {
        try {
            let result = [];
            let lines = csv.split("\n");
            let headersRaw = lines[0].split(";");
            let headers = ["id"];
            let exclude = [];

            // Convert from Name to fieldName
            for (let i = 1; i < headersRaw.length; i++) {
                let headerLabel = headersRaw[i];
                headerLabel = headerLabel.replace(/(\r\n|\n|\r)/gm, "");

                let fieldRun = ModelData.FindFirst(modelAppConfig.oData.settings.fieldsRun, "text", headerLabel);
                if (fieldRun) {
                    if (fieldRun.valueType) exclude.push(i);
                    headers.push(fieldRun.name);
                } else {
                    headers.push(report.mapCSVHeaderLabelToFieldName(headerLabel));
                }
            }

            // Convert Data
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].length) {
                    let obj = {};
                    let currentline = lines[i].split(";");

                    for (let j = 0; j < currentline.length; j++) {
                        if (!exclude.includes(j)) {
                            let currentField = currentline[j];
                            if (currentField) obj[headers[j]] = currentField.replace(/(\r\n|\n|\r)/gm, "");
                        }
                    }
                    result.push(obj);
                }
            }

            return result;
        } catch (e) {
            console.log(e);
            document.getElementById("adaptiveListImport").value = "";
        }
    },

    save: function (data) {
        function getStatusMessage(status) {
            const d = modelAppConfig.oData;
            if ((status.includes("UNIQUE constraint failed") || status.includes("duplicate key value")) && d.settings.properties.report.textUnique) {
                return sap.n.Adaptive.translateProperty("report", "textUnique", d);
            }

            return status;
        }

        const config = modelAppConfig.oData;

        // ensure all required fields are attached
        config.settings.fieldsSel
            .filter(function (f) {
                return f.required;
            })
            .forEach(function (f) {
                const k = f.name;
                const k2 = `${f.name}_value`;

                if (!data[k] && modelAppData.oData[k]) {
                    data[k] = data[k2] = modelAppData.oData[k];
                }

                if (!data[k2] && modelAppData.oData[k2]) {
                    data[k] = data[k2] = modelAppData.oData[k2];
                }
            });

        const autoUpdate = !data.id ? true : false;
        sap.n.Adaptive.run(config, data, "Save")
            .then(function (_data) {
                if (autoUpdate) report.run();
            })
            .catch(function (res) {
                const j = res.responseJSON;
                if (j && j.status) {
                    sap.m.MessageToast.show(getStatusMessage(j.status));
                }
            });
    },

    variantList: function (selectedItem) {
        jsonRequest({
            url: `${AppCache.Url}/api/functions/Variant/List`,
            data: JSON.stringify({
                objectType: "Adaptive",
                objectKey: report.initId,
            }),
            success: function (data) {
                if (selectedItem) {
                    let item = ModelData.FindFirst(data, "id", selectedItem);
                    if (item) item.selected = true;
                }

                modeltabVariant.setData(data);
                modeltabVariant.refresh();
            },
        });
    },

    variantSave: function () {
        let data = {
            objectKey: report.initId,
            objectType: "Adaptive",
            name: modelpageVariantSave.oData.name,
            ispublic: informVariantpublic.getSelected(),
            content: modelAppData.oData,
        };

        if (modelpageVariantSave.oData.id) data.id = modelpageVariantSave.oData.id;

        jsonRequest({
            url: `${AppCache.Url}/api/functions/Variant/Save`,
            data: JSON.stringify(data),
            success: function (res) {
                report.variantList(res.id);
                diaVariant.close();
            },
        });
    },

    variantDelete: function (id) {
        jsonRequest({
            url: `${AppCache.Url}/api/functions/Variant/Delete`,
            data: JSON.stringify({ id }),
            success: function (_data) {
                ModelData.Delete(tabVariant, "id", id);
            },
        });
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

                    if (fieldValue && fieldComp) {
                        fieldComp.setValue(fieldValue);
                        fieldComp.fireSubmit();
                    }

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

                        if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.sourceTarget) {
                            nav.sourceTarget = modelAppConfig.oData.settings.navigation.sourceTarget;
                        } else {
                            nav.sourceTarget = oApp.sId;
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

                ColumnHeader.setHeader(
                    new sap.m.Label({
                        text: sap.n.Adaptive.translateFieldLabel(f, config),
                        // wrapping: true,
                    })
                );

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

                        if (f.statusInverted) opts.inverted = true;
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
                        opts = {
                            text: getFieldBindingText(f),
                        };

                        if (f.statusInverted) opts.inverted = true;
                        if (f.statusTitleType) opts.title = `{${f.name}_title}`;
                        if (f.statusIconType) opts.icon = `{${f.name}_icon}`;
                        if (f.statusStateType) opts.state = `{${f.name}_state}`;

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

                    case "Button":
                        opts = {
                            text: getFieldBindingText(f),
                            type: f.buttonType,
                            visible: "{= ${" + f.name + "} ? true:false }",
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

                        if (f.statusIconType) opts.icon = `{${f.name}_icon}`;
                        if (f.buttonTypeTooltip) opts.tooltip = f.buttonTypeTooltip;

                        newField = new sap.m.Button(opts);
                        newField.addStyleClass("sapUiSizeCompact");
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

                    case "ExpandableText":
                        newField = new sap.m.ExpandableText({
                            text: getFieldBindingText(f),
                            maxCharacters: 50,
                            // renderWhitespace: true
                        });
                        if (f.expandableTextPopover) newField.setOverflowMode("Popover");
                        break;

                    case "StepInput":
                        opts = {
                            value: getFieldBindingText(f),
                            placeholder: getFieldPlaceholder(f),
                            change: onChange,
                        };

                        if (f.stepInputMinType) opts.min = `{${f.name}_min}`;
                        if (f.stepInputMaxType) opts.max = `{${f.name}_max}`;
                        if (f.stepInputStepType) opts.step = `{${f.name}_step}`;
                        if (f.stepInputTextAlign) opts.textAlign = f.stepInputTextAlign;

                        newField = new sap.m.StepInput(opts);
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
                            type: f.inputType,
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
                            showSelectAll: true,
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
                    visible: report.buildVisibleProp("1"),
                }).addStyleClass("sapUiSizeCompact");

                if (t.action1Tooltip) newField.setTooltip(t.action1Tooltip);

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
                    visible: report.buildVisibleProp("2"),
                }).addStyleClass("sapUiSizeCompact");

                if (t.action2Tooltip) newField.setTooltip(t.action2Tooltip);

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
                    visible: report.buildVisibleProp("3"),
                }).addStyleClass("sapUiSizeCompact");

                if (t.action3Tooltip) newField.setTooltip(t.action3Tooltip);

                col.addCell(newField);
            }

            // Row Action 4
            if (t.enableAction4) {
                let ColumnHeader = new sap.m.Column({
                    width: t.action4Width || "",
                });

                table.addColumn(ColumnHeader);
                let newField = new sap.m.Button({
                    text: t.action4Text,
                    icon: t.action4Icon,
                    type: t.action4Type,
                    width: t.action4Width || "",
                    press: function (oEvent) {
                        if (!t._action4Nav) return;

                        let context = oEvent.oSource.getBindingContext();
                        let columnData = context.getObject();

                        if (t._action4Nav.dialogTitleField) {
                            t._action4Nav.dialogTitleFieldText = columnData[t._action4Nav.dialogTitleField + "_value"] || columnData[t._action4Nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(t._action4Nav, columnData, events, table.sId);
                    },
                    visible: report.buildVisibleProp("4"),
                }).addStyleClass("sapUiSizeCompact");

                if (t.action4Tooltip) newField.setTooltip(t.action4Tooltip);

                col.addCell(newField);
            }

            // Row Action 5
            if (t.enableAction5) {
                let ColumnHeader = new sap.m.Column({
                    width: t.action5Width || "",
                });

                table.addColumn(ColumnHeader);
                let newField = new sap.m.Button({
                    text: t.action5Text,
                    icon: t.action5Icon,
                    type: t.action5Type,
                    width: t.action5Width || "",
                    press: function (oEvent) {
                        if (!t._action5Nav) return;

                        let context = oEvent.oSource.getBindingContext();
                        let columnData = context.getObject();

                        if (t._action5Nav.dialogTitleField) {
                            t._action5Nav.dialogTitleFieldText = columnData[t._action5Nav.dialogTitleField + "_value"] || columnData[t._action5Nav.dialogTitleField];
                        }

                        sap.n.Adaptive.navigation(t._action5Nav, columnData, events, table.sId);
                    },
                    visible: report.buildVisibleProp("5"),
                }).addStyleClass("sapUiSizeCompact");

                if (t.action5Tooltip) newField.setTooltip(t.action5Tooltip);

                col.addCell(newField);
            }

            // Table - Aggregation
            table.bindAggregation("items", { path: "/", template: col, templateShareable: false });
        } catch (e) {
            console.log(e);
        }
    },

    buildVisibleProp: function (field) {
        if (field === "1" || field === "2" || field === "3" || field === "4" || field === "5") {
            field = {
                visible: true,
                visibleFixedValue: modelAppConfig.oData.settings.properties.table["action" + field + "VisibleFixedValue"],
                visibleSystemValue: modelAppConfig.oData.settings.properties.table["action" + field + "VisibleSystemValue"],
                visibleFieldName: modelAppConfig.oData.settings.properties.table["action" + field + "VisibleFieldName"],
                visibleCondition: modelAppConfig.oData.settings.properties.table["action" + field + "VisibleCondition"],
                visibleInverse: modelAppConfig.oData.settings.properties.table["action" + field + "VisibleInverse"],
            };
        }

        let visibleCond = field.visible;

        let visibleValue = field.visibleFixedValue ? field.visibleFixedValue : field.visibleSystemValue;

        let visibleStatement = field.visibleInverse ? "false:true" : "true:false";

        if (field.visibleFieldName && field.visibleCondition && visibleValue) {
            if (isNaN(visibleValue)) {
                visibleCond = "{= ${" + field.visibleFieldName + "}.toString() " + field.visibleCondition + " '" + visibleValue + "' ? " + visibleStatement + " }";
            } else {
                visibleCond = "{= parseInt(${" + field.visibleFieldName + "}) " + field.visibleCondition + parseInt(visibleValue) + " ? " + visibleStatement + " }";
            }
        }

        if (field.visibleFieldName && field.visibleCondition === "empty") {
            if (field.visibleInverse) {
                visibleCond = "{= ${" + field.visibleFieldName + "} ? true:false }";
            } else {
                visibleCond = "{= ${" + field.visibleFieldName + "} ? false:true }";
            }
        }

        return visibleCond;
    },

    setDateRange: function (days, state) {
        let date = new Date();

        if (state === "to") {
            date.setHours(23, 59, 00);
        } else {
            date.setHours(00, 00, 00);
        }

        date = new Date(date);
        date = date.setDate(date.getDate() + days);
        return new Date(date);
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

                        if (field.items) {
                            if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                sortObjects(field.items, ["additionalText", "text"]);
                            } else {
                                field.items.sort(sort_by("text"));
                            }

                            let lastGroup = "";

                            $.each(field.items, function (i, item) {
                                if ((field.lookupFieldGrouping1 || field.lookupFieldGrouping2) && lastGroup !== item.additionalText) {
                                    selField.addItem(new sap.ui.core.SeparatorItem({ text: item.additionalText }));
                                    lastGroup = item.additionalText;
                                }

                                if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                    selField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text }));
                                } else {
                                    selField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text, additionalText: item.additionalText }));
                                }
                            });
                        }

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

                        if (field.items) {
                            if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                sortObjects(field.items, ["additionalText", "text"]);
                            } else {
                                field.items.sort(sort_by("text"));
                            }

                            let lastGroup = "";

                            $.each(field.items, function (i, item) {
                                if ((field.lookupFieldGrouping1 || field.lookupFieldGrouping2) && lastGroup !== item.additionalText) {
                                    selField.addItem(new sap.ui.core.SeparatorItem({ text: item.additionalText }));
                                    lastGroup = item.additionalText;
                                }

                                if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                    selField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text }));
                                } else {
                                    selField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text, additionalText: item.additionalText }));
                                }
                            });
                        }

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
                                let events = report.events;
                                events.valueRequest = true;
                                events.valueRequestField = selField.sId;
                                events.valueRequestKey = field.valueRequestKey;

                                sap.n.Adaptive.navigation(field._navigation, appdata, events);
                            },
                            submit: function (oEvent) {
                                if (run) run();
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
                                    const valueRefMissing = sap.n.Adaptive.translateProperty("report", "odataValueList", config);
                                    sap.m.MessageToast.show(valueRefMissing);
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

    buildValueList: function (annotations, inputField, inputFieldLabel, fieldName) {
        // TODO - Pagination ?
        // TODO - Column Sorting Fields ?
        // TODO - Save current annotation ?

        const annotation = annotations[0];

        if (!annotation.valueListLabel) annotation.valueListLabel = inputFieldLabel;

        // DIALOG
        const diaValueList = new sap.m.Dialog({
            title: inputFieldLabel,
            verticalScrolling: false,
            horizontalScrolling: false,
            contentWidth: "1280px",
            contentHeight: "800px",
            draggable: true,
        });

        diaValueList.addStyleClass("sapUiSizeCompact sapUiNoContentPadding");

        report.buildValueListContent(annotations, annotation, inputField, diaValueList);
        diaValueList.open();
    },

    buildValueListContent: function (annotations, annotation, inputField, diaValueList) {
        // Init
        diaValueList.destroyContent();

        // Search Function
        runSearch = function () {
            const filterData = {
                _entitySet: annotation.valueListCollectionPath,
                ...modelformFilter.oData,
            };
            sap.n.Adaptive.run(modelAppConfig.oData, filterData, "ValueListRun").then(function (res) {
                if (res.count) {
                    oPageHeaderNumber.setNumber("(" + res.count + ")");
                } else {
                    oPageHeaderNumber.setNumber("(" + res.result.length + ")");
                }
                modeltabValueList.setData(res.result);
            });
        };

        let tokenValues = [];
        const tokens = inputField.getTokens();

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            tokenValues.push(token.getKey());
        }

        const butClose = new sap.m.Button({
            text: "Close",
            press: function (oEvent) {
                diaValueList.close();
            },
        });

        const butSelect = new sap.m.Button({
            text: "OK",
            type: "Emphasized",
            press: function (oEvent) {
                inputField.removeAllTokens();
                const selectedItems = tabValueList.getSelectedItems();

                selectedItems.forEach(function (item) {
                    const context = item.getBindingContext();
                    const data = context.getObject();
                    inputField.addToken(new sap.m.Token({ key: data[annotation.valueListKeyField], text: data[annotation.valueListKeyField] }));
                });

                report.run();

                diaValueList.close();
            },
        });

        // FILTER
        const formFilter = new sap.ui.layout.form.SimpleForm({
            layout: "ColumnLayout",
            labelSpanS: 12,
            labelSpanM: 12,
            labelSpanL: 12,
            columnsM: 2,
            columnsL: 3,
        });

        const modelformFilter = new sap.ui.model.json.JSONModel();
        formFilter.setModel(modelformFilter);

        if (annotation.valueListSearchSupported) {
            formFilter.addContent(new sap.m.Label({ text: "Search" }));
            formFilter.addContent(
                new sap.m.SearchField({
                    value: "{/_search}",
                    search: function (oEvent) {
                        runSearch();
                    },
                })
            );
        }

        annotation.fields.forEach(function (field) {
            formFilter.addContent(new sap.m.Label({ text: field.label }));

            if (field.valueListTarget) {
                var selField = new sap.m.MultiInput("filter" + field.name, {
                    type: "Text",
                    enableMultiLineMode: true,
                    value: "{/" + field.name + "}",
                    showValueHelp: true,
                    showClearIcon: true,
                    valueHelpRequest: function (oEvent) {
                        const inputField = this;

                        const reqBody = {
                            _valueListTarget: field.valueListTarget,
                        };

                        if (!reqBody._valueListTarget) {
                            const valueRefMissing = sap.n.Adaptive.translateProperty("report", "odataValueList", modelAppConfig.getData());
                            sap.m.MessageToast.show(valueRefMissing);
                            return;
                        }

                        sap.n.Adaptive.run(modelAppConfig.oData, reqBody, "ValueListSetup").then(function (res) {
                            report.buildValueList(res, inputField);
                        });
                    },
                    submit: function (oEvent) {
                        runSearch();
                    },
                });

                selField.addValidator(function (args) {
                    return new sap.m.Token({ key: args.text, text: args.text });
                });
            } else {
                var selField = new sap.m.Input({
                    showClearIcon: true,
                    value: "{/" + field.name + "}",
                    submit: function (oEvent) {
                        runSearch();
                    },
                });
            }

            formFilter.addContent(selField);
        });

        // TABLE
        const tabValueList = new sap.m.Table({
            mode: "MultiSelect",
            sticky: ["ColumnHeaders"],
            includeItemInSelection: true,
            fixedLayout: false,
            updateFinished: function (oEvent) {
                const items = this.getItems();

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const context = item.getBindingContext();
                    const data = context.getObject();

                    if (tokenValues.includes(data[annotation.valueListKeyField])) {
                        this.setSelectedItem(item);
                    }
                }
            },
        });

        const tabValueListItems = new sap.m.ColumnListItem();

        annotation.fields.forEach(function (field) {
            // Header
            const tabColumn = new sap.m.Column();
            tabColumn.setHeader(new sap.m.Text({ text: field.label }));
            tabValueList.addColumn(tabColumn);

            // Item
            tabValueListItems.addCell(new sap.m.Text({ text: "{" + field.name + "}" }));
        });

        const modeltabValueList = new sap.ui.model.json.JSONModel();
        tabValueList.setModel(modeltabValueList);
        tabValueList.bindAggregation("items", { path: "/", template: tabValueListItems, templateShareable: false });

        // DYNAMIC PAGE
        const oPageDynamic = new sap.f.DynamicPage({ headerExpanded: true, backgroundDesign: "Solid" }).addStyleClass("sapUiNoContentPadding");
        const oPageTitle = new sap.f.DynamicPageTitle({ backgroundDesign: "Solid" }).addStyleClass("nepFlexWrap");
        const oPageHeaderBox = new sap.m.FlexBox({ fitContainer: true, alignItems: "Center" });
        const oPageHeaderVBox = new sap.m.VBox();
        const oPageHeaderHBoxTitle = new sap.m.HBox();
        const oPageHeaderTitle = new sap.m.Title({ text: annotation.valueListLabel, level: "H1", wrapping: true });
        const oPageHeaderNumber = new sap.m.ObjectNumber({ number: "(0)", emphasized: false });
        const oPageHeader = new sap.f.DynamicPageHeader({ pinnable: false, backgroundDesign: "Solid" });
        const oPageContent = new sap.m.VBox();

        oPageDynamic.setTitle(oPageTitle);
        oPageTitle.setHeading(oPageHeaderBox);
        oPageHeaderBox.addItem(oPageHeaderVBox);
        oPageHeaderVBox.addItem(oPageHeaderHBoxTitle);

        if (annotations.length > 1) {
            const butValueLists = new sap.m.Button({
                type: "Transparent",
                iconFirst: false,
                // text: "Value Lists",
                icon: "sap-icon://navigation-down-arrow",
                press: function (oEvent) {
                    var popValueLists = new sap.m.Popover({
                        showHeader: false,
                        placement: "Bottom",
                    });

                    var listValueLists = new sap.m.List();
                    var itemValueLists = new sap.m.StandardListItem({
                        type: "Active",
                        title: "{valueListLabel}",
                        press: function (oEvent) {
                            const context = oEvent.oSource.getBindingContext();
                            const annotation = context.getObject();
                            report.buildValueListContent(annotations, annotation, inputField, diaValueList);
                        },
                    });

                    var modellistValueLists = new sap.ui.model.json.JSONModel();
                    listValueLists.setModel(modellistValueLists);
                    listValueLists.bindAggregation("items", { path: "/", template: itemValueLists, templateShareable: false });

                    modellistValueLists.setData(annotations);

                    popValueLists.addContent(listValueLists);

                    popValueLists.openBy(this);
                },
            });

            oPageHeaderHBoxTitle.addItem(butValueLists);
        }

        oPageHeaderHBoxTitle.addItem(oPageHeaderTitle);
        oPageHeaderHBoxTitle.addItem(oPageHeaderNumber);

        oPageTitle.addNavigationAction(butSelect);
        oPageTitle.addNavigationAction(butClose);

        oPageDynamic.setHeader(oPageHeader);
        oPageHeader.addContent(formFilter);

        oPageDynamic.setContent(oPageContent);
        oPageContent.addItem(tabValueList);

        diaValueList.addContent(oPageDynamic);

        runSearch();
    },
};

report.start();
window.adaptiveListImport = report.import;
