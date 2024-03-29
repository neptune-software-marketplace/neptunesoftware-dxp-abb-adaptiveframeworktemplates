const report = {
    metadata: metadata,
    initId: null,
    formObject: null,
    pages: {},
    __metadata: null,
    uniqueKeyValue: null,
    uniqueKeyField: null,

    events: {
        onChildBack: function () {
            oApp.back();
        },
        onNavigatePage: function (page) {
            if (!report.pages[page.sId]) oApp.addPage(page);
            report.childPage = page;
            report.pages[page.sId] = true;
            oApp.to(page);
        },
    },

    start: function () {
        if (!sap.n.Adaptive) {
            console.error("Neptune Adaptive Framework not found");
            return;
        }

        sap.n.Adaptive.initApp(this);
    },

    init: function (config, runtime) {
        // Set Default Values
        sap.n.Adaptive.setDefaultData(config, metadata);

        // Reset when config changes
        if (report.initId !== config.id) report.initId = config.id;

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

        oApp.setBusy(true);

        if (config.settings.properties.report.avatarBackgroundColor) {
            oPageHeaderIcon.setBackgroundColor(config.settings.properties.report.avatarBackgroundColor);
        } else {
            oPageHeaderIcon.setBackgroundColor();
        }

        // Compact Mode
        if (config.settings.properties.form.enableCentered) {
            panMain.addStyleClass("nepFormInput");
            panItemMain.addStyleClass("nepFormInput");
        } else {
            panMain.removeStyleClass("nepFormInput");
            panItemMain.removeStyleClass("nepFormInput");
        }

        // Avoid rounded cornes on attachment if no padding
        if (config.settings.properties.report.enablePadding) {
            tabAttachment.removeStyleClass("nepNoRadiusTop");
            tabAttachment.addStyleClass("nepRadiusTop");
            barEdit.addStyleClass("nepDynamicPageNoPadding");
        } else {
            tabAttachment.removeStyleClass("nepRadiusTop");
            tabAttachment.addStyleClass("nepNoRadiusTop");
            barEdit.removeStyleClass("nepDynamicPageNoPadding");
        }

        // Action Button Left
        if (config.settings.properties.report.actionButtonLeft) {
            oPageTitle.addStyleClass("nepFlexWrap nepFlexLeft");
            oPageHeaderBox.addStyleClass("sapUiSmallMarginBottom");
        } else {
            oPageTitle.removeStyleClass("nepFlexWrap");
            oPageTitle.removeStyleClass("nepFlexLeft");
            oPageHeaderBox.removeStyleClass("sapUiSmallMarginBottom");
        }

        // Translation - Properties
        function syncTitle(targetModel) {
            const config = targetModel.getData();
            if (config.settings.properties.report.dynamicTitle) {
                oPageHeaderTitle.bindProperty("text", "AppData>/" + config.settings.properties.report.dynamicTitle);
            } else {
                oPageHeaderTitle.unbindProperty('text')
                oPageHeaderTitle.setText(sap.n.Adaptive.translateProperty("report", "title", config));
            }
        }

        function syncSubTitle(targetModel) {
            const config = targetModel.getData();
            if (config.settings.properties.report.dynamicSubTitle) {
                oPageHeaderSubTitle.bindProperty("text", `AppData>/${config.settings.properties.report.dynamicSubTitle}`);
            } else {
                oPageHeaderSubTitle.unbindProperty('text')
                const text = sap.n.Adaptive.translateProperty("report", "subTitle", config);
                if (!text) {
                    oPageHeaderSubTitle.setVisible(false);
                } else {
                    oPageHeaderSubTitle.setText(text);
                    oPageHeaderSubTitle.setVisible(true);
                }
            }
        }

        // Adaptive Designer: modelappData, Launchpad: modelAppConfig
        const targetModel = typeof modelappData !== 'undefined' ? modelappData : modelAppConfig;
        syncTitle(targetModel);
        syncSubTitle(targetModel);

        targetModel.attachPropertyChange(function (prop) {
            const path = prop.mParameters.path;
            if (['/settings/properties/report/title', '/settings/properties/report/dynamicTitle'].includes(path)) {
                syncTitle(targetModel);
            }

            if (['/settings/properties/report/subTitle', '/settings/properties/report/dynamicSubTitle'].includes(path)) {
                syncSubTitle(targetModel);
            }
        });


        toastSaved.setText(sap.n.Adaptive.translateProperty("report", "textToastSave", config));
        toastDelete.setText(sap.n.Adaptive.translateProperty("report", "textToastDelete", config));
        toolHeaderBack.setText(sap.n.Adaptive.translateProperty("report", "textButtonClose", config));
        toolHeaderSave.setText(sap.n.Adaptive.translateProperty("report", "textButtonSave", config));
        toolHeaderDelete.setText(sap.n.Adaptive.translateProperty("report", "textButtonDelete", config));

        barEditItemMain.setText(sap.n.Adaptive.translateProperty("report", "tab0Text", config));
        barEditItem1.setText(sap.n.Adaptive.translateProperty("report", "tab1Text", config));
        barEditItem2.setText(sap.n.Adaptive.translateProperty("report", "tab2Text", config));
        barEditItem3.setText(sap.n.Adaptive.translateProperty("report", "tab3Text", config));
        barEditItem4.setText(sap.n.Adaptive.translateProperty("report", "tab4Text", config));
        barEditItem5.setText(sap.n.Adaptive.translateProperty("report", "tab5Text", config));
        barEditItemA.setText(sap.n.Adaptive.translateProperty("report", "tabAText", config));

        // Init
        sap.n.Adaptive.init(modelAppConfig.oData)
            .then(function (data) {
                const s = modelAppConfig.oData.settings;
                const r = s.properties.report;

                if (runtime) {
                    s.fieldsSel = data.fieldsSelection;
                    s.fieldsRun = data.fieldsReport;

                    // Fields Sorting
                    if (s.fieldsSel) s.fieldsSel.sort(sort_by("fieldPos"));
                    if (s.fieldsRun) s.fieldsRun.sort(sort_by("fieldPos"));
                } else {
                    s.fieldsSel.forEach(function (selField) {
                        let selFieldRun = ModelData.FindFirst(data.fieldsSelection, "name", selField.name);
                        if (selFieldRun && selFieldRun.items) selField.items = selFieldRun.items;
                        if (selFieldRun && selFieldRun.default) selField.default = selFieldRun.default;
                    });
                }

                // Form Fields
                if (r.enableTab1 || r.enableTab2 || r.enableTab3 || r.enableTab4 || r.enableTab5 || r.enableAttachment) {
                    barEdit.setSelectedItem(barEditItemMain);
                    barEdit.setVisible(true);
                    panMain.setVisible(false);
                    report.buildForm(panItemMain, modelAppConfig.oData, {}, report.events);
                    report.formObject = panItemMain.getContent();
                } else {
                    barEdit.setVisible(false);
                    panMain.setVisible(true);
                    report.buildForm(panMain, modelAppConfig.oData, {}, report.events);
                    report.formObject = panMain.getContent();
                }

                // New Record ?
                if (s.data && s.data._defaultData) {
                    report.afterRun(s.data._defaultData);
                } else {
                    // Key Fields for GET Record
                    if (s.navigation && s.navigation.keyField && s.navigation.keyField.length) {
                        if (!s.data) s.data = {};
                        s.data._keyField = s.navigation.keyField;

                        // Fix before patch 4
                        s.navigation.keyField.forEach(function (field) {
                            if (field.valueKey) {
                                s.data[field.fieldName] = field.valueKey;
                                field.key = field.fieldName;
                            }
                        });
                    }

                    sap.n.Adaptive.run(modelAppConfig.oData, s.data, "Get").then(function (data) {
                        report.afterRun(data);
                    });
                }
            })
            .catch(function (data) {
                if (data.responseJSON && data.responseJSON.status) {
                    sap.m.MessageToast.show(data.responseJSON.status);
                }

                if (data.status === 0) {
                    sap.m.MessageToast.show("No connection");
                }

                oApp.setBusy(false);
            });
    },

    delete: function () {
        const s = modelAppConfig.oData.settings;
        const data = modelAppData.oData;

        const deleteMessage = sap.n.Adaptive.translateProperty('report', 'textConfirmDelete', modelAppConfig.getData());
        const deleteTitle = sap.n.Adaptive.translateProperty('report', 'titleConfirmDelete', modelAppConfig.getData());

        sap.m.MessageBox.show(deleteMessage, {
            title: deleteTitle,
            icon: sap.m.MessageBox.Icon.ERROR,
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
            onClose: function (oAction) {
                if (oAction === "YES") {
                    const { id } = data;
                    sap.n.Adaptive.run(modelAppConfig.oData, { id, data }, "Delete").then(function (data) {
                        // Message from Server Script
                        if (data.message && data.message.text) {
                            if (data.message.type) {
                                sap.m.MessageBox[data.message.type](data.message.text);
                            } else {
                                sap.m.MessageBox.information(data.message.text);
                            }
                            return;
                        }

                        sap.m.MessageToast.show(toastDelete.getText());

                        if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().close) {
                            oApp.getParent().getParent().close();
                        }

                        if (s.events && s.events.afterChildSave) s.events.afterChildSave();

                        // const openedAsSidepanel = modelAppConfig.oData.settings.navigation.openAs === 'S';
                        // if (openedAsSidepanel) {
                        //     // a new record is being created in the sidepanel tab
                        //     if (!saveData.id) {
                        //         sap.n.Shell.closeSidepanelTab(sap.n.Shell.getTabKey('PLANET9_ADAPTIVE_EDIT', ''));
                        //     }
                        // } else {
                        //     report.close();
                        // }

                        report.close();
                    });
                }
            },
        });
    },

    afterRun: function (data) {
        // Message from Server Script
        if (data && data.message && data.message.text) {
            if (data.message.type) {
                sap.m.MessageBox[data.message.type](data.message.text);
            } else {
                sap.m.MessageBox.information(data.message.text);
            }
            oApp.setBusy(false);
            return;
        }

        // If no records are received -> New record with data from event config
        if (!data && modelAppConfig.oData.settings.data && modelAppConfig.oData.settings.data._keyField) {
            data = {};
            modelAppConfig.oData.settings.data._keyField.forEach(function (field) {
                if (field.key) data[field.fieldName] = modelAppConfig.oData.settings.data[field.key];
                if (field.value) data[field.fieldName] = field.value;
            });
        }

        // Save OData Metadata Key
        if (data && data.__metadata) report.__metadata = data.__metadata;

        // Save ServiceNow Key
        if (data && data["sys_id"]) {
            report.uniqueKeyField = "sys_id";
            report.uniqueKeyValue = data["sys_id"];
        }

        // Save SalesForce Key
        if (data && data["Id"]) {
            report.uniqueKeyField = "Id";
            report.uniqueKeyValue = data["Id"];
        }

        // Delete Button - Only enabled if unique ID field data exists
        const keysData = Object.keys(data);
        if (modelAppConfig.oData.settings.properties.report.enableDelete && keysData.length > 0) {
            toolHeaderDelete.setEnabled(true);
        }

        // Get Attachment
        if (modelAppConfig.oData.settings.properties.report.enableAttachment) report.getAttachment(data);

        // Open Dialog
        if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().open) oApp.getParent().getParent().open();

        // Data Preprocessing
        modelAppConfig.oData.settings.fieldsSel.forEach(function (field) {
            const { name, type } = field;

            // Editor
            if (type === "Editor") {
                field._editor.setData(data[name]);
                field._editor.onChange = function (data) {
                    modelAppData.oData[name] = data;
                };
            }

            // Default Value
            if (field.default && !data[name]) {
                data[name] = ["Switch", "CheckBox"].includes(type) ? true : field.default;
            }

            // Date Format
            if (["DatePicker", "DateTimePicker"].includes(type)) {
                if (data && data[name]) data[name] = sap.n.Adaptive.getDate(data[name]);
            }

            // MultiSelect Parser
            if (["MultiSelectLookup", "MultiSelectScript"].includes(type)) {
                try {
                    let keyString = data[name];

                    // CASTANA Contribution
                    if (keyString) {
                        if (keyString.length > 0 && keyString.substr(0, 1) === "{") {
                            const keyValues = keyString.substr(1, keyString.length - 2);
                            const keyJSON = `[${keyValues}]`;
                            const keyArray = JSON.parse(keyJSON);
                            data[name] = keyArray;
                        }

                        let dataArray = data[name].split(",");
                        if (dataArray.length > 0) data[name] = dataArray;
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });

        // Switch to readOnly if requirements are met
        toolHeaderSave.setEnabled(true);

        // Requirement 1
        if (
            modelAppConfig.oData.settings.properties.form &&
            modelAppConfig.oData.settings.properties.form.field1ReadOnly &&
            modelAppConfig.oData.settings.properties.form.operator1ReadOnly &&
            modelAppConfig.oData.settings.properties.form.value1ReadOnly
        ) {
            if (
                report.checkFieldsReadOnly(
                    data[modelAppConfig.oData.settings.properties.form.field1ReadOnly],
                    modelAppConfig.oData.settings.properties.form.operator1ReadOnly,
                    modelAppConfig.oData.settings.properties.form.value1ReadOnly || modelAppConfig.oData.settings.properties.form.sysvar1ReadOnly
                )
            ) {
                report.setFieldsReadOnly();
                toolHeaderSave.setEnabled(false);
                toolHeaderDelete.setEnabled(false);
            }
        }

        // Requirement 2
        if (
            modelAppConfig.oData.settings.properties.form &&
            modelAppConfig.oData.settings.properties.form.field2ReadOnly &&
            modelAppConfig.oData.settings.properties.form.operator2ReadOnly &&
            modelAppConfig.oData.settings.properties.form.value2ReadOnly
        ) {
            if (
                report.checkFieldsReadOnly(
                    data[modelAppConfig.oData.settings.properties.form.field2ReadOnly],
                    modelAppConfig.oData.settings.properties.form.operator2ReadOnly,
                    modelAppConfig.oData.settings.properties.form.value2ReadOnly || modelAppConfig.oData.settings.properties.form.sysvar2ReadOnly
                )
            ) {
                report.setFieldsReadOnly();
                toolHeaderSave.setEnabled(false);
                toolHeaderDelete.setEnabled(false);
            }
        }

        // If Save is not enabled
        if (!modelAppConfig.oData.settings.properties.report.enableSave) {
            report.setFieldsReadOnly();
        }

        modelAppData.setData(data);
        modelAppData.refresh();

        // Tabs
        if (modelAppConfig.oData.settings.properties.report._tab1Nav) {
            report.openChild(modelAppConfig.oData.settings.properties.report._tab1Nav, barEditItem1);
        } else {
            barEditItem1.destroyContent();
            barEditItem1.setCount(0);
        }

        if (modelAppConfig.oData.settings.properties.report._tab2Nav) {
            report.openChild(modelAppConfig.oData.settings.properties.report._tab2Nav, barEditItem2);
        } else {
            barEditItem2.destroyContent();
            barEditItem2.setCount(0);
        }

        if (modelAppConfig.oData.settings.properties.report._tab3Nav) {
            report.openChild(modelAppConfig.oData.settings.properties.report._tab3Nav, barEditItem3);
        } else {
            barEditItem3.destroyContent();
            barEditItem3.setCount(0);
        }

        if (modelAppConfig.oData.settings.properties.report._tab4Nav) {
            report.openChild(modelAppConfig.oData.settings.properties.report._tab4Nav, barEditItem4);
        } else {
            barEditItem4.destroyContent();
            barEditItem4.setCount(0);
        }

        if (modelAppConfig.oData.settings.properties.report._tab5Nav) {
            report.openChild(modelAppConfig.oData.settings.properties.report._tab5Nav, barEditItem5);
        } else {
            barEditItem5.destroyContent();
            barEditItem5.setCount(0);
        }

        oApp.setBusy(false);
    },

    save: function () {
        toolHeaderSave.setEnabled(false);

        const s = modelAppConfig.oData.settings;

        let formUnique = true;
        let formValues = {};
        let formValid = true;
        let saveData = {};

        if (modelAppData.oData && modelAppData.oData.id) saveData.id = modelAppData.oData.id;

        s.fieldsSel.forEach(function (f) {
            // Format Data for Boolean
            if (["Switch", "CheckBox"].includes(f.type)) {
                if (!modelAppData.oData[f.name]) modelAppData.oData[f.name] = false;
            }

            saveData[f.name] = modelAppData.oData[f.name];

            delete modelAppData.oData[f.name + "ValueState"];
        });

        // Required Validatation, if it's required, editable and visible
        s.fieldsSel
            .filter(function (f) {
                return f.required && f.editable && f.visible;
            })
            .forEach(function (f) {
                if (saveData[f.name] === null || saveData[f.name] === undefined || saveData[f.name] === "") {
                    formValid = false;
                    modelAppData.oData[f.name + "ValueState"] = "Error";
                }
            });

        if (!formValid) {
            const textRequiredFields = sap.n.Adaptive.translateProperty("report", "requiredFieldsToast", modelAppConfig.getData());
            sap.m.MessageToast.show(textRequiredFields);
            toolHeaderSave.setEnabled(true);
            modelAppData.refresh();
            return;
        }

        // Unique Validatation, if it's editable and visible
        s.fieldsSel
            .filter(function (f) {
                return f.unique && f.editable && f.visible && saveData[f.name];
            })
            .forEach(function (f) {
                const value = saveData[f.name];

                if (formValues[value]) {
                    formUnique = false;
                } else {
                    formValues[value] = 1;
                }
            });

        if (!formUnique) {
            s.fieldsSel
                .filter(function (f) {
                    return f.unique && f.editable && f.visible && saveData[f.name];
                })
                .forEach(function (f) {
                    modelAppData.oData[f.name + "ValueState"] = "Error";
                });

            const textUniqueValues = sap.n.Adaptive.translateProperty("report", "textUnique", modelAppConfig.getData());
            sap.m.MessageToast.show(textUniqueValues);
            toolHeaderSave.setEnabled(true);
            modelAppData.refresh();
            return;
        }

        // Add navigation KeyFields to Save
        if (report.__metadata) saveData.__metadata = report.__metadata;

        // Add UniqueKey
        if (report.uniqueKeyValue && report.uniqueKeyField) {
            saveData[report.uniqueKeyField] = report.uniqueKeyValue;
        }

        sap.n.Adaptive.run(modelAppConfig.oData, saveData, "Save")
            .then(function (data) {
                if (data.status && data.status === "required") {
                    const textRequiredFields = sap.n.Adaptive.translateProperty("report", "requiredFieldsToast", modelAppConfig.getData());
                    sap.m.MessageToast.show(textRequiredFields);
                } else {
                    // Message from Server Script
                    if (data.message && data.message.text) {
                        if (data.message.type) {
                            sap.m.MessageBox[data.message.type](data.message.text);
                        } else {
                            sap.m.MessageBox.information(data.message.text);
                        }
                        return;
                    }

                    sap.m.MessageToast.show(toastSaved.getText());

                    if (oApp.getParent() && oApp.getParent().getParent() && oApp.getParent().getParent().close) {
                        oApp.getParent().getParent().close();
                    }

                    if (s.events && s.events.afterChildSave) s.events.afterChildSave();

                    const openedAsSidepanel = modelAppConfig.oData.settings?.navigation?.openAs === "S";

                    if (openedAsSidepanel) {
                        // a new record is being created in the sidepanel tab
                        if (!saveData.id) {
                            sap.n.Shell.closeSidepanelTab(sap.n.Shell.getTabKey("PLANET9_ADAPTIVE_EDIT", ""));
                        }
                    } else {
                        report.close();
                    }
                }

                modelAppData.refresh();
            })
            .catch(function (data) {
                const j = data.responseJSON;
                if (j && j.status) {
                    if ((j.status.indexOf("UNIQUE constraint failed") > -1 || j.status.indexOf("duplicate key value") > -1) && s.properties.report.textUnique) {
                        sap.m.MessageToast.show(sap.n.Adaptive.translateProperty("report", "textUnique", modelAppConfig.oData));
                    } else {
                        sap.m.MessageToast.show(j.status);
                    }
                }
            })
            .finally(function () {
                setTimeout(function () {
                    if (toolHeaderSave) toolHeaderSave.setEnabled(true);
                }, 1000);
            });
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

    openChild: function (navigation, child) {
        if (navigation.destinationType === "F") {
            sap.n.Adaptive.getConfig(navigation.destinationTargetF).then(function (config) {
                if (!config) return;

                config.settings.navigation = navigation;
                config.settings.data = modelAppData.oData;

                if (config.settings.data && navigation.keyField) {
                    config.settings.data._keyField = navigation.keyField;
                }

                if (modelAppConfig.oData.settings.navigation && modelAppConfig.oData.settings.navigation.sourceTarget) {
                    config.settings.navigation.sourceTarget = modelAppConfig.oData.settings.navigation.sourceTarget;
                }

                AppCache.Load(config.application, {
                    appGUID: ModelData.genID(),
                    startParams: config,
                    parentObject: child,
                });
            });
        } else {
            let startParams = {};

            if (modelAppData.oData) {
                startParams.data = JSON.parse(JSON.stringify(modelAppData.oData));
            }

            AppCache.Load(navigation.destinationTargetA, {
                appGUID: ModelData.genID(),
                startParams: startParams,
                parentObject: child,
            });
        }
    },

    buildForm: function (parent, config, appdata, events) {
        try {
            parent.destroyContent();

            var form = new sap.ui.layout.form.SimpleForm({
                layout: config.settings.properties.form.formLayout || "ResponsiveGridLayout",
                editable: true,
                backgroundDesign: "Transparent",
                columnsL: parseInt(config.settings.properties.form.columnsL) || 2,
                columnsM: parseInt(config.settings.properties.form.columnsM) || 1,
                labelSpanL: parseInt(config.settings.properties.form.labelSpanL) || 4,
                labelSpanM: parseInt(config.settings.properties.form.labelSpanM) || 2,
            });

            form.addStyleClass("sapUiMediumMarginTop");

            // Compact
            if (config.settings.properties.form.enableCompact) {
                form.addStyleClass("sapUiSizeCompact");
            } else {
                form.removeStyleClass("sapUiSizeCompact");
            }

            // Selection Fields
            $.each(config.settings.fieldsSel, function (i, field) {
                // Trigger new form
                if (field.enableNewForm) {
                    parent.addContent(form);

                    form = new sap.ui.layout.form.SimpleForm({
                        layout: config.settings.properties.form.formLayout || "ResponsiveGridLayout",
                        editable: true,
                        backgroundDesign: "Transparent",
                        columnsL: parseInt(field.columnsL) || 2,
                        columnsM: parseInt(field.columnsM) || 1,
                        labelSpanL: parseInt(field.labelSpanL) || 4,
                        labelSpanM: parseInt(field.labelSpanM) || 2,
                    });

                    // Compact
                    if (config.settings.properties.form.enableCompact) {
                        form.addStyleClass("sapUiSizeCompact");
                    } else {
                        form.removeStyleClass("sapUiSizeCompact");
                    }
                }

                if (field.columnLabel)
                    form.addContent(
                        new sap.ui.core.Title({
                            text: field.columnLabel,
                            level: config.settings.properties.form.titleLevel || "Auto",
                        })
                    );

                // Create Fields
                switch (field.type) {
                    case "Editor":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.FlexBox({
                            height: field.editorHeight || "400px",
                            renderType: "Bare",
                            width: "100%",
                            visible: field.visible,
                        });

                        try {
                            sap.n.Adaptive.editor(newField, {});
                        } catch (e) {
                            console.log(e);
                        }

                        field._editor = newField.editor;
                        field._editor.setEditable(field.editable);

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        if (field.default) newField.setState(field.default);
                        break;

                    case "DatePicker":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.DatePicker({
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            dateValue: "{AppData>/" + field.name + "}",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "DateTimePicker":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.DateTimePicker({
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            secondsStep: parseInt(field.dateTimePickerSecondsStep) || 1,
                            minutesStep: parseInt(field.dateTimePickerMinutesStep) || 1,
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            dateValue: "{AppData>/" + field.name + "}",
                        });

                        if (field.dateTimePickerFormat) newField.setDisplayFormat(field.dateTimePickerFormat);

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "CheckBox":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.CheckBox({
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            selected: "{AppData>/" + field.name + "}",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "Switch":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.Switch({
                            visible: report.buildVisibleProp(field),
                            enabled: field.editable,
                            state: "{AppData>/" + field.name + "}",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "StepInput":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        let options = {
                            visible: report.buildVisibleProp(field),
                            enabled: field.editable,
                            value: "{AppData>/" + field.name + "}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                        };

                        if (field.stepInputMin) options.min = parseInt(field.stepInputMin);
                        if (field.stepInputMax) options.max = parseInt(field.stepInputMax);
                        if (field.stepInputStep) options.step = parseInt(field.stepInputStep);
                        if (field.stepInputTextAlign) options.textAlign = field.stepInputTextAlign;

                        var newField = new sap.m.StepInput(options);

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "MultiSelect":
                    case "MultiSelectLookup":
                    case "MultiSelectScript":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        newField = new sap.m.MultiComboBox({
                            width: "100%",
                            visible: report.buildVisibleProp(field),
                            selectedKeys: "{AppData>/" + field.name + "}",
                            placeholder: field.placeholder || "",
                            showSelectAll: true,
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            showSecondaryValues: true,
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
                                    newField.addItem(new sap.ui.core.SeparatorItem({ text: item.additionalText }));
                                    lastGroup = item.additionalText;
                                }

                                if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                    newField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text }));
                                } else {
                                    newField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text, additionalText: item.additionalText }));
                                }
                            });
                        }

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "SingleSelect":
                    case "SingleSelectLookup":
                    case "SingleSelectScript":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.ComboBox({
                            width: "100%",
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            placeholder: field.placeholder || "",
                            selectedKey: "{AppData>/" + field.name + "}",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            showSecondaryValues: true,
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        // Items
                        newField.addItem(new sap.ui.core.Item({ key: "", text: "" }));

                        if (field.items) {
                            if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                sortObjects(field.items, ["additionalText", "text"]);
                            } else {
                                field.items.sort(sort_by("text"));
                            }

                            let lastGroup = "";

                            $.each(field.items, function (i, item) {
                                if ((field.lookupFieldGrouping1 || field.lookupFieldGrouping2) && lastGroup !== item.additionalText) {
                                    newField.addItem(new sap.ui.core.SeparatorItem({ text: item.additionalText }));
                                    lastGroup = item.additionalText;
                                }

                                if (field.lookupFieldGrouping1 || field.lookupFieldGrouping2) {
                                    newField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text }));
                                } else {
                                    newField.addItem(new sap.ui.core.ListItem({ key: item.key, text: item.text, additionalText: item.additionalText }));
                                }
                            });
                        }
                        break;

                    case "TextArea":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.TextArea({
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            rows: parseInt(field.textAreaRows) || 2,
                            placeholder: field.placeholder || "",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            value: "{AppData>/" + field.name + "}",
                            width: "100%",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "Text":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.Text({
                            visible: report.buildVisibleProp(field),
                            text: "{AppData>/" + field.name + "}",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "ValueHelp":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.Input({
                            visible: report.buildVisibleProp(field),
                            editable: field.editable,
                            type: field.inputType || "Text",
                            placeholder: field.placeholder || "",
                            valueState: "{AppData>/" + field.name + "ValueState}",
                            value: "{AppData>/" + field.name + "}",
                            showValueHelp: true,
                            valueHelpRequest: function (oEvent) {
                                events.valueRequest = true;
                                events.valueRequestField = newField.sId;
                                events.valueRequestKey = field.valueRequestKey;
                                sap.n.Adaptive.navigation(field._navigation, modelAppData.oData, events);
                            },
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        break;

                    case "Display":
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        var newField = new sap.m.Input({
                            visible: report.buildVisibleProp(field),
                            editable: false,
                            placeholder: field.placeholder || "",
                            value: "{AppData>/" + field.name + "}",
                        });

                        if (field.description) {
                            form.addContent(report.buildInputDescription(newField, field));
                        } else {
                            form.addContent(newField);
                        }

                        if (field.formatter) {
                            newField.bindProperty("value", {
                                parts: [{ path: "AppData>/" + field.name }],
                                formatter: function (fieldName) {
                                    if (typeof fieldName === "undefined" || fieldName === null) return;
                                    return sap.n.Adaptive.formatter(fieldName, field.formatter);
                                },
                            });
                        }
                        break;

                    default:
                        form.addContent(
                            new sap.m.Label({
                                text: sap.n.Adaptive.translateFieldLabel(field, config),
                                required: field.required,
                                design: "Bold",
                            })
                        );

                        if (field.mask) {
                            var newField = new sap.m.MaskInput({
                                visible: report.buildVisibleProp(field),
                                editable: field.editable,
                                mask: field.mask,
                                placeholder: field.placeholder || "",
                                valueState: "{AppData>/" + field.name + "ValueState}",
                                value: "{AppData>/" + field.name + "}",
                                liveChange: function (oEvent) {
                                    if (field.inputFormatter) {
                                        let newValue = this.getValue();

                                        switch (field.inputFormatter) {
                                            case "condense":
                                                newValue = newValue.replace(/\s+/g, "");
                                                break;

                                            case "uppercase":
                                                newValue = newValue.toUpperCase();
                                                break;

                                            case "lowercase":
                                                newValue = newValue.toLowerCase();
                                                break;

                                            default:
                                                break;
                                        }

                                        this.setValue(newValue);
                                    }
                                },
                            });

                            // Mask Rule if Not only Numbers
                            if (field.mask.indexOf("*") > -1) {
                                newField.addRule(
                                    new sap.m.MaskInputRule({
                                        regex: "[a-zA-Z0-9]",
                                    })
                                );
                            }

                            if (field.description) {
                                form.addContent(report.buildInputDescription(newField, field));
                            } else {
                                form.addContent(newField);
                            }
                        } else {
                            var newField = new sap.m.Input({
                                visible: report.buildVisibleProp(field),
                                editable: field.editable,
                                type: field.inputType || "Text",
                                placeholder: field.placeholder || "",
                                valueState: "{AppData>/" + field.name + "ValueState}",
                                value: "{AppData>/" + field.name + "}",
                                liveChange: function (oEvent) {
                                    if (field.inputFormatter) {
                                        let newValue = this.getValue();

                                        switch (field.inputFormatter) {
                                            case "condense":
                                                newValue = newValue.replace(/\s+/g, "");
                                                break;

                                            case "uppercase":
                                                newValue = newValue.toUpperCase();
                                                break;

                                            case "lowercase":
                                                newValue = newValue.toLowerCase();
                                                break;

                                            default:
                                                break;
                                        }

                                        this.setValue(newValue);
                                    }
                                },
                            });

                            if (field.description) {
                                form.addContent(report.buildInputDescription(newField, field));
                            } else {
                                form.addContent(newField);
                            }
                        }
                }
            });

            parent.addContent(form);
        } catch (e) {
            console.log(e);
        }
    },

    buildVisibleProp: function (field) {
        let visibleCond = field.visible;

        let visibleValue = field.visibleFixedValue ? field.visibleFixedValue : field.visibleSystemValue;

        let visibleStatement = field.visibleInverse ? "false:true" : "true:false";

        if (field.visibleFieldName && field.visibleCondition && visibleValue) {
            if (isNaN(visibleValue)) {
                visibleCond = "{= ${AppData>/" + field.visibleFieldName + "}.toString() " + field.visibleCondition + " '" + visibleValue + "' ? " + visibleStatement + " }";
            } else {
                visibleCond = "{= parseInt(${AppData>/" + field.visibleFieldName + "}) " + field.visibleCondition + visibleValue + " ? " + visibleStatement + " }";
            }
        }

        return visibleCond;
    },

    buildInputDescription: function (newField, field) {
        var newVBox = new sap.m.VBox({
            visible: report.buildVisibleProp(field),
        });

        var newDesc = new sap.m.Label({
            text: field.description,
            wrapping: true,
        });

        newDesc.addStyleClass("sapUiSmallMarginBottom nepInputDescription");

        newVBox.addItem(newField);
        newVBox.addItem(newDesc);

        return newVBox;
    },

    setFieldsReadOnly: function () {
        let fields = report.formObject[0].getContent();

        if (fields) {
            fields.forEach(function (field) {
                // Input Fields
                if (field.setEditable) {
                    field.setEditable(false);
                } else if (field.setEnabled) {
                    field.setEnabled(false);
                }

                // VBox
                if (field.getItems) {
                    let items = field.getItems();

                    items.forEach(function (item) {
                        if (item.setEditable) {
                            item.setEditable(false);
                        } else if (item.setEnabled) {
                            item.setEnabled(false);
                        }
                    });
                }
            });
        }
    },

    checkFieldsReadOnly: function (fieldValue, operator, dataValue) {
        // Symbols
        if (dataValue === "UserName") {
            if (AppCache.userInfo && AppCache.userInfo.username) {
                dataValue = AppCache.userInfo.username;
            } else {
                dataValue = systemSettings.user.username;
            }
        }

        let isReadOnly = false;

        switch (operator) {
            case "===":
                if (fieldValue === dataValue) isReadOnly = true;
                break;

            case "!==":
                if (fieldValue !== dataValue) isReadOnly = true;
                break;

            case ">=":
                if (fieldValue >= dataValue) isReadOnly = true;
                break;

            case "<=":
                if (fieldValue <= dataValue) isReadOnly = true;
                break;

            case ">":
                if (fieldValue > dataValue) isReadOnly = true;
                break;

            case "<":
                if (fieldValue < dataValue) isReadOnly = true;
                break;

            default:
                break;
        }

        return isReadOnly;
    },

    uploadFieldAfterRender: () => {
        const elm = document.getElementById("_editUploader");
        if (elm) {
            elm.removeEventListener("change", report.uploadFileChangeEvent);
            elm.addEventListener("change", report.uploadFileChangeEvent);
        }
    },

    uploadFileChangeEvent: (event) => {
        report.uploadFile(event, modelAppData.oData.id);
    },

    uploadFile: function (event, objectKey) {
        $.each(event.target.files, function (i, data) {
            var file = {
                name: data.name,
                description: "",
                objectKey: objectKey,
                objectType: "ADAPTIVE",
                fileType: data.type,
                fileSize: data.size,
            };

            try {
                var fileReader = new FileReader();

                fileReader.onload = function (fileData) {
                    file.content = fileData.target.result;

                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "/api/functions/Gos/Save",
                        data: JSON.stringify(file),
                        success: function (data) {
                            ModelData.Add(tabAttachment, data);
                        },
                        error: function (data) {
                            console.log(data);
                        },
                    });

                    document.getElementById("_editUploader").value = "";
                };
                fileReader.readAsDataURL(data);
            } catch (e) {
                try {
                } catch (e) {}
            }
        });
    },

    getAttachment: function (data) {
        if (!data.id) return;

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/api/functions/Gos/List",
            data: JSON.stringify({
                objectKey: data.id,
                objectType: "ADAPTIVE",
            }),
            success: function (data) {
                modeltabAttachment.setData(data);
            },
            error: function (data) {
                console.log(data);
            },
        });
    },

    formatAttachment: async function (file) {
        if (file.fileType.indexOf("image/") > -1) {
            return await report.previewAttachment(file);
        }
    },

    previewAttachment: async function (file) {
        return new Promise(function (resolve) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/api/functions/Gos/Get",
                data: JSON.stringify(file),
                success: function (data) {
                    resolve(data.content);
                },
                error: function (data) {
                    resolve("");
                },
            });
        });
    },
};

report.start();
