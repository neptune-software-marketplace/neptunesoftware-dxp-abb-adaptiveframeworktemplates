const report = {
    metadata: metadata,
    initId: null,

    start: function () {
        if (!sap.n || !sap.n.Adaptive) {
            console.error("Neptune Adaptive Framework not found");
            return;
        }

        sap.n.Adaptive.initApp(this);
    },

    init: function (data, runtime) {
        const config = data.settings;
        config.id = data.id;

        if (report.initId === config.id && runtime) {
            return;
        }

        report.initId = config.id;

        // Language
        if (runtime) {
            if (AppCache && AppCache.userInfo && AppCache.userInfo.language)
                config.language = AppCache.userInfo.language;
        } else {
            const language = getAdaptiveEditorPreviewLanguage();
            if (language) {
                config.language = language;
            }
        }

        modelappData.setData(config);
        modelappData.refresh();

        // Translation - Properties
        toolDetailTitle.setText(report.translateProperty("report", "title", config));
        toolGridClose.setText(report.translateProperty("report", "textButtonClose", config));

        // Variant
        if (modelappData.oData.properties.report.enableVariant) report.variantList();

        // Init
        sap.n.Adaptive.init(modelappData.oData).then(function (data) {
            pivotGrid.buildSelectionScreen(data);
            oApp.to(oPageDetail);

            // Auto Run
            if (pivotGrid.initialized && modelappData.oData.properties.report.autoRun)
                pivotGrid.runReport();
        });
    },

    close: function () {
        const p = oApp.getParent();
        const evts = modelappData.oData.events;
        const isDialog = p && p.getParent() && p.getParent().close;

        if (isDialog) {
            p.getParent().close();
            return;
        } else if (evts && evts.onChildBack) {
            evts.onChildBack();
            return;
        } else if (AppCache && AppCache.Back) {
            AppCache.Back();
            return;
        } else if (!isDialog && sap.n.HashNavigation && sap.n.HashNavigation.deleteNavItem) {
            sap.n.HashNavigation.deleteNavItem();
        }
    },

    translateFieldLabel: function (field, config) {
        const { language } = config;
        const { name, text } = field;
        if (!language) return text;

        const t = config.translation;
        if (t && t[language] && t[language].fieldCatalog[name]) {
            return t[language].fieldCatalog[name];
        }

        return text;
    },

    translateProperty: function (parent, key, config) {
        if (!config.language) return config.properties[parent][key];

        const { language, translation } = config;
        if (translation && translation[language] && translation[language][parent][key]) {
            return translation[language][parent][key];
        }

        return config.properties[parent][key];
    },

    variantList: function (selectedItem) {
        jsonRequest({
            url: `${AppCache.Url}/api/functions/Variant/List`,
            data: JSON.stringify({
                objectKey: report.initId,
                objectType: "Adaptive",
            }),
            success: function (data) {
                if (selectedItem) {
                    let rec = ModelData.FindFirst(data, "id", selectedItem);
                    if (rec) rec.selected = true;
                }

                modeltabVariant.setData(data);
                modeltabVariant.refresh();
            },
        });
    },

    variantSave: function () {
        const reqData = {
            objectKey: report.initId,
            objectType: "Adaptive",
            name: modelpageVariantSave.oData.name,
            ispublic: informVariantpublic.getSelected(),
            content: {
                selection: modelpanSelection.oData,
                settings: modelDataVariant.oData,
            },
        };

        if (modelpageVariantSave.oData.id) reqData.id = modelpageVariantSave.oData.id;

        jsonRequest({
            url: `${AppCache.Url}/api/functions/Variant/Save`,
            data: JSON.stringify(reqData),
            success: function (data) {
                report.variantList(data.id);
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
};

report.start();
