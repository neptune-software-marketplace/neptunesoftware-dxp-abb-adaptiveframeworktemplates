if (typeof monaco !== "undefined") {
    monaco.editor.defineTheme("vs-dark-ui5", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editorGutter.background": "#1d232a",
            "editor.background": "#1d232a",
        },
    });

    sap.ui.getCore().attachThemeChanged(function () {
        const theme = poSettings.getMonacoTheme();
        monaco?.editor.setTheme(theme);
    });
}
