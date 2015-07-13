var ROUTES = [];
var additional_routes = ['apps', 'launch'];
var trans =  getFirstTranslation();

// APP

App = Ember.Application.create();

for(var route in INIT_CONFIG) {
	ROUTES.push(route);
}

additional_routes.forEach(function(route){
	ROUTES.push(route);
});



// DEFINE ROUTES
App.Router.map(function() {
	this.resource('wizard', {path: '/'}, function(){
		var self = this;
		ROUTES.forEach(function(tab){
			self.resource(tab);
		});
	});
});



App.WizardRoute = Ember.Route.extend({
	wizard: Em.I18n.translations.wizard,
	actions: {
		goToSubRoute: function(data){
			this.transitionTo(data);
		}
	},
	model: function(){
		var data = {linkItems:[]};
		ROUTES.forEach(function(routeName){
			data.linkItems.push({
				name: routeName,
				value: trans[routeName] !== undefined ? trans[routeName]["tab"] : routeName.toUpperCase()
			});
		});
		return data;
	},
});

App.WizardController = Ember.Controller.extend({
	actions: {
		updateSelection: function(data){
			var isValid = true;
			$.each(Validator.ElementsForValidation(), function(index, elem){
				if(!Validator.ValidateField(elem)){
					isValid = false;
				}
			});
			
			if(!isValid){ return; }
			
			// OK, EVERYTHING IS VALID GO TO SELECTED TAB
			$("#sidebar>ul>li>a.menu-item").removeClass("selected");
			$("#sidebar>ul>li>a.menu-item." + data).addClass("selected");
			this.send('goToSubRoute', data);
		}
	}
});



ROUTES.forEach(function(route){
	var r = route.ToRoute();

	// Create a route for every tab.
	App[r] = Ember.Route.extend({
		content_model : {},
		model: function(){
			return getModels(route);
		},
		renderTemplate: function() {
			if (route === 'apps') {
				this.render('apps');
			} else {
				this.render('generic');
			}
		},
		afterModel: function(model, transition) {
			transition.then(function() {
				// Done transitioning
				Ember.run.schedule('afterRender', self, function () {
					$.each(Validator.ElementsForValidation(), function(index, elem){
						$(elem).bind("focusout", function(e) {
							Validator.ValidateField(e.target);
						});
					});
				});
			});
		}
	});



	var c = route.toController();

	// Create a controller for every route.
	App[c] = Ember.ObjectController.extend({
		title: Ember.String.htmlSafe(trans[route]['title']),
		description: Ember.String.htmlSafe(trans[route]['description']),
		routeName: route,

		fields: function() {
			return App.FieldModel.createFields(this.get("model"), trans[route]);
		}.property(),

		fileFields: function() {
			return App.FieldModel.createFileFields(this.get("model"), trans[route]);
		}.property(),

		subTabGroups: function() {
			var subTabList = this.get("model.sub_tabs");

			if (Ember.isNone(subTabList)) {
				return [];
			}

			var subTabs = App.SubTabModel.createArrayUsingListOfNames(
				subTabList, this.get("routeName"), this.get("model"), trans[route]);

			return this._setSubTabGroups(subTabs);
		}.property(),

		apps: function() {
			var apps = this.get("model.apps");
			var retApps = [];
			apps.forEach(function(app){
				retApps.push({
					appName: app.appName,
					isChecked: false
				});
			});
			return retApps;
		}.property(),

		isLaunch: function() {
			return this.routeName === 'launch';
		}.property(),

		fieldDataObserver: function() {
			var dataObj = {};
			var self = this;

			dataObj["fields"] = self.get("fields");
			dataObj["tabGroups"] = {};

			DATA[self.get("routeName")] = dataObj;
		}.observes("fields.@each.value"),

		fileFieldDataObserver: function() {
			var dataObj = {};
			var self = this;

			dataObj["files"] = self.get("fileFields");
			dataObj["tabGroups"] = {};

			DATA[self.get("routeName")] = dataObj;

			DATA[self.get("routeName")]["files"].forEach(function(field, index){
				readURL($("[data-element-id="+field.elementId+"]")[0], DATA[self.get("routeName")]['files'], index);
			});
		}.observes("fileFields.@each.value"),

		appCheckObserver: function() {

			DATA["apps"] = this.get("apps");

		}.observes("apps.@each.isChecked"),

		actions: {
			activateTab: function(tab) {
				// OFF EVENTS ON CURRENTLY ACTIVE TAB
				$.each(Validator.ElementsOnActiveTab(), function(index, elem){
					$(elem).unbind("focusout", "**");
				});

				console.log("ACTIVATE TAB!!!");
				var tabGroup = this.get("subTabGroups").find(function(group){
					return group.tabGroupName === tab.get("tabGroup");
				});
				tabGroup.tabs.forEach(function(subTab) {
					subTab.set("isActive", false);
				});
				tab.set("isActive", true);
			},

			doLaunch: function() {
				ZipGeneratorService.generateZipFrom(DATA);
			},
		},

		_setSubTabGroups: function(subTabs) {
			var self = this;
			var model = self.get("model");
			var tabGroupNames = [GENERAL_SUBTAB_GROUP];
			var tabGroups = [];

			subTabs.forEach(function(subTab){
				var tabGroup = null;

				if (tabGroupNames.indexOf(subTab.get("tabGroup")) === -1) {
					// Create a new tab group.
					tabGroupNames.push(subTab.get("tabGroup"));

					// This is the first tab in this group, so activate it.
					subTab.set("isActive", true);

					var translation = trans[route]['sub_tabs'][subTab.get("tabGroup")];

					tabGroup = App.TabGroupModel.createNew(subTab.get("tabGroup"), translation);

					tabGroups.push(tabGroup);

				} else {
					tabGroup = tabGroups.find(function(group){
						return group.tabGroupName === subTab.get("tabGroup");
					});
				}

				tabGroup.addTab(subTab);
			});

			return tabGroups;
		}

	});
});

Ember.View.reopen({
	init: function() {
		this._super();
		var self = this;
		var attr = self.get('attributeBindings');
		// bind attributes beginning with 'data-'
		Em.keys(this).forEach(function(key) {
			if (key.substr(0, 5) === 'data-') {
				attr.pushObject(key);
			}
		});
	},
});
