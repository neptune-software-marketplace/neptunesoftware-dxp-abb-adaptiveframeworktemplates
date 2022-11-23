var report = {

    metadata: metadata,
    initId: null,
    formObject: null,

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
        if (report.initId !== config.id) {
            report.initId = config.id;
        } else {
            if (runtime) return;
        }

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

        var oSplitter1;
        var oSplitter2;
        var oSplitter3;

        // Clear
        oSplitterMain.destroyContentAreas();

        // Splitter 1
        if (modelAppConfig.oData.settings.properties.report._app1Nav || modelAppConfig.oData.settings.properties.report._app2Nav || modelAppConfig.oData.settings.properties.report._app3Nav) {
            oSplitter1 = new sap.ui.layout.Splitter({ height: "100%" });
            oSplitterMain.addContentArea(oSplitter1);

            var layoutData = new sap.ui.layout.SplitterLayoutData();
            if (modelAppConfig.oData.settings.properties.report.splitter1Width) layoutData.setSize(modelAppConfig.oData.settings.properties.report.splitter1Width);
            if (modelAppConfig.oData.settings.properties.report.splitter1MinSize) layoutData.setMinSize(parseInt(modelAppConfig.oData.settings.properties.report.splitter1MinSize));
            layoutData.setResizable((modelAppConfig.oData.settings.properties.report.splitter1Resizable ? true : false));
            oSplitter1.setLayoutData(layoutData);

        }

        // Splitter 2
        if (modelAppConfig.oData.settings.properties.report._app4Nav || modelAppConfig.oData.settings.properties.report._app5Nav || modelAppConfig.oData.settings.properties.report._app6Nav) {
            oSplitter2 = new sap.ui.layout.Splitter({ height: "100%" });
            oSplitterMain.addContentArea(oSplitter2);

            var layoutData = new sap.ui.layout.SplitterLayoutData();
            if (modelAppConfig.oData.settings.properties.report.splitter2Width) layoutData.setSize(modelAppConfig.oData.settings.properties.report.splitter2Width);
            if (modelAppConfig.oData.settings.properties.report.splitter2MinSize) layoutData.setMinSize(parseInt(modelAppConfig.oData.settings.properties.report.splitter2MinSize));
            layoutData.setResizable((modelAppConfig.oData.settings.properties.report.splitter2Resizable ? true : false));
            oSplitter2.setLayoutData(layoutData);

        }

        // Splitter 3
        if (modelAppConfig.oData.settings.properties.report._app7Nav || modelAppConfig.oData.settings.properties.report._app8Nav || modelAppConfig.oData.settings.properties.report._app9Nav) {
            oSplitter3 = new sap.ui.layout.Splitter({ height: "100%" });
            oSplitterMain.addContentArea(oSplitter3);

            var layoutData = new sap.ui.layout.SplitterLayoutData();
            if (modelAppConfig.oData.settings.properties.report.splitter3Width) layoutData.setSize(modelAppConfig.oData.settings.properties.report.splitter3Width);
            if (modelAppConfig.oData.settings.properties.report.splitter3MinSize) layoutData.setMinSize(parseInt(modelAppConfig.oData.settings.properties.report.splitter3MinSize));
            layoutData.setResizable((modelAppConfig.oData.settings.properties.report.splitter3Resizable ? true : false));
            oSplitter3.setLayoutData(layoutData);

        }

        // Applications - Row 1
        report.checkApp(oSplitter1, {
            nav: modelAppConfig.oData.settings.properties.report._app1Nav,
            width: modelAppConfig.oData.settings.properties.report.app1Width,
            minSize: modelAppConfig.oData.settings.properties.report.app1MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app1Resizable
        });

        report.checkApp(oSplitter1, {
            nav: modelAppConfig.oData.settings.properties.report._app2Nav,
            width: modelAppConfig.oData.settings.properties.report.app2Width,
            minSize: modelAppConfig.oData.settings.properties.report.app2MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app2Resizable
        });

        report.checkApp(oSplitter1, {
            nav: modelAppConfig.oData.settings.properties.report._app3Nav,
            width: modelAppConfig.oData.settings.properties.report.app3Width,
            minSize: modelAppConfig.oData.settings.properties.report.app3MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app3Resizable
        });

        // Applications - Row 2
        report.checkApp(oSplitter2, {
            nav: modelAppConfig.oData.settings.properties.report._app4Nav,
            width: modelAppConfig.oData.settings.properties.report.app4Width,
            minSize: modelAppConfig.oData.settings.properties.report.app4MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app4Resizable
        });

        report.checkApp(oSplitter2, {
            nav: modelAppConfig.oData.settings.properties.report._app5Nav,
            width: modelAppConfig.oData.settings.properties.report.app5Width,
            minSize: modelAppConfig.oData.settings.properties.report.app5MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app5Resizable
        });

        report.checkApp(oSplitter2, {
            nav: modelAppConfig.oData.settings.properties.report._app6Nav,
            width: modelAppConfig.oData.settings.properties.report.app6Width,
            minSize: modelAppConfig.oData.settings.properties.report.app6MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app6Resizable
        });

        // Applications - Row 3
        report.checkApp(oSplitter3, {
            nav: modelAppConfig.oData.settings.properties.report._app7Nav,
            width: modelAppConfig.oData.settings.properties.report.app7Width,
            minSize: modelAppConfig.oData.settings.properties.report.app7MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app7Resizable
        });

        report.checkApp(oSplitter3, {
            nav: modelAppConfig.oData.settings.properties.report._app8Nav,
            width: modelAppConfig.oData.settings.properties.report.app8Width,
            minSize: modelAppConfig.oData.settings.properties.report.app8MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app8Resizable
        });

        report.checkApp(oSplitter3, {
            nav: modelAppConfig.oData.settings.properties.report._app9Nav,
            width: modelAppConfig.oData.settings.properties.report.app9Width,
            minSize: modelAppConfig.oData.settings.properties.report.app9MinSize,
            resizable: modelAppConfig.oData.settings.properties.report.app9Resizable
        });

    },

    checkApp: function (splitter, options) {

        if (!options.nav) return;

        var panApp = new sap.m.Panel({
            height: "100%",
            backgroundDesign: "Solid"
        });

        var layoutData = new sap.ui.layout.SplitterLayoutData();
        if (options.width) layoutData.setSize(options.width);
        if (options.minSize) layoutData.setMinSize(parseInt(options.minSize));
        layoutData.setResizable((options.resizable ? true : false));
        panApp.setLayoutData(layoutData);

        panApp.addStyleClass("sapUiNoContentPadding");
        splitter.addContentArea(panApp);
        report.openChild(options.nav, panApp);
    },

    openChild: function (navigation, child) {

        switch (navigation.destinationType) {

            case "F":
                sap.n.Adaptive.getConfig(navigation.destinationTargetF).then(function (config) {

                    if (!config) return;

                    config.settings.navigation = navigation;
                    config.settings.data = modelAppConfig.oData.settings.data;

                    if (config.settings.data && navigation.keyField) config.settings.data._keyField = navigation.keyField;

                    AppCache.Load(config.application, {
                        appGUID: ModelData.genID(),
                        startParams: config,
                        parentObject: child
                    });

                });
                break;

            default:

                var startParams = {};

                if (modelAppConfig.oData.settings && modelAppConfig.oData.settings.data) startParams.data = JSON.parse(JSON.stringify(modelAppConfig.oData.settings.data));

                AppCache.Load(navigation.destinationTargetA, {
                    appGUID: ModelData.genID(),
                    startParams: startParams,
                    parentObject: child
                });
                break;

        }

    }

}

report.start();