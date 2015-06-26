
TRANSLATIONS = {};
LOCALE = 'en'; // todo: make this changeable based on the top-level keys in TRANSLATIONS map

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
/**
 * Called when we determine that we are not being run from a distribution package.
 * Refuse to continue because to do so would mean lots of errors about missing files.
 * These files are assembled by prep_dist.sh in the cloudos-dist repository. Run that first.
 */
function not_dist () {
    // todo: better error message here
    document.body.innerHTML = '<h2>It seems like you are running this directly from ' +
        'the cloudos-dist source repository. This will not work. Please download a cloudstead-handy-toolbox package ' +
        'from <a href="http://cloudstead.io/">cloudstead.io</a></h2>';
}

function createTabPanel (name) {
    var html = '<table><tr><td style="text-align:center;">' +
        '<div class="tabControl">' +
        '<table class="tabHolder" cellspacing="0" cellpadding="0" onselectstart="return false;">' +
        '<tr id="'+name+'TabArea">' +
        '<td style="font-size:1px;">&nbsp;</td>' +
    '</tr></table>' +
        '<div id="'+name+'PanelArea" class="tabPanel"></div>' +
        '</div></td></tr></table>';

    var panel = document.getElementById(name);
    panel.innerHTML = html;

    return new TabbedPanel(name+'Controller', document.getElementById(name+'TabArea'), panel);
}

function createTab (tabController, tabName, config, localized) {

    var panel = tabController.CreateTab(localized.tab);
    var html = tabHeader(localized);
    for (var property in config.fields) {
        if (config.fields.hasOwnProperty(property)) {
            html += propertyHtml(tabName, property, config.fields[property], localized)
        }
    }

    subtabDivs = [];
    if (typeof config.sub_tabs != 'undefined') {
        for (var i=0; i<config.sub_tabs.length; i++) {
            var subTabDivId = tabName + '_' + config.sub_tabs[i] + '_config';
            html += '<div id="'+subTabDivId+'"></div>';
            subtabDivs.push(subTabDivId);
        }
    }
    panel.innerHTML = html;

    for (var i=0; i<subtabDivs.length; i++) {
        subTabDivId = subtabDivs[i];
        var subController = createTabPanel(subTabDivId); // save these somewhere?
        var subTab = config.sub_tabs[i];
        var subConfig = INIT_CONFIG[tabName][subTab];
        createTab(subController, subTab, subConfig, localized[subTab]);
    }
}

function appHtml (tabName, manifest) {
    var name;
    if (typeof manifest.assets != 'undefined' && typeof manifest.assets.taskbarIconAltText != 'undefined') {
        name = manifest.assets.taskbarIconAltText.capitalize() + ' ('+ manifest.name.capitalize() +')'
    } else {
        name = manifest.name.capitalize();
    }
    return "<input type=\"checkbox\" checked/><b>" + name + "</b><br/>";
}

function createAppsTab (tabController, apps) {
    var tabName = 'apps';

    var localized = TRANSLATIONS[LOCALE][tabName];

    var panel = tabController.CreateTab(localized.tab);
    var html = tabHeader(localized);
    for (var app in apps) {
        if (apps.hasOwnProperty(app)) {
            html += appHtml(tabName, apps[app]);
        }
    }
    panel.innerHTML = html;
}

function createLaunchTab(tabController) {
    var tabName = 'launch';

    var localized = TRANSLATIONS[LOCALE][tabName];

    var panel = tabController.CreateTab(localized.tab);
    var html = tabHeader(localized);

    // todo: fill out rest of HTML for launching

    panel.innerHTML = html;
}

function tabHeader (localized) {
    return '<p class="tabTitle">' + localized.title + '</p>'
        + '<hr/>'
        + '<p class="tabDescription">' + localized.description + '</p>';
}

function propertyHtml(tabName, property, type, localized) {
    <!-- todo: why are tooltips not working?? -->
    var html = '<hr/>';
    switch (type.split('/')[0]) {
        case 'fqdn':
        case 'hostname':
        case 'ipaddr':
        case 'port':
        case 'uri':
        case 'email':
        case 'text':
        case 'time_of_day':
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+'</label><input type="text" name="'+property+'"/>';
            break;

        case 'password':
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+'</label><input type="password" name="'+property+'"/>';
            break;

        case 'list':
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+' (enter a comma-separated list of values)</label><input type="text" name="'+property+'"/>';
            break;

        case 'file':
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+'</label><input type="file" name="'+property+'"/>';
            break;

        case 'pick_one':
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+'</label><select name="'+property+'"/>';
            var choices = INIT_CONFIG[tabName].choices[property];
            for (var i=0; i<choices.length; i++) {
                var choice = choices[i];
                html += '<option value="'+choice+'">'+localized[property].options[choice]+'</option>'
            }
            break;

        case 'uuid':
            // todo
            html += '<script type="text/javascript">$( "#tooltip_'+property+'" ).tooltip();</script>'
                + '<label for="'+property+'">'+localized[property].label+'</label><input type="file" name="'+property+'"/>';
            break;
    }
    return html;
}

function generateInitFiles (form) {

}