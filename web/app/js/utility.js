// RENDER BLOCK END

// HELPERS

String.prototype.toCamel = function () {
	return this.replace(/\W+(.)/g, function (x, chr) {
		return chr.toUpperCase();
	}).replace(/_+(.)/g, function (x, chr) {
		return chr.toUpperCase();
	});
};

String.prototype.ToRoute = function () {
	var c = this.toCamel();
	return c.charAt(0).toUpperCase() + c.slice(1) + 'Route';
};

String.prototype.toController = function () {
	var c = this.toCamel();
	return c.charAt(0).toUpperCase() + c.slice(1) + 'Controller';
};

getModels = function(routeName, params){
	var data = {}; data.apps = [];
	if(additional_routes.indexOf(routeName) > -1){
		if(routeName === "apps"){}
	}else{
		data = INIT_CONFIG[routeName];
	}

	data.routeName = routeName;
	return data;
};

function readURL(input, dataArray, dataIndex) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			dataArray[dataIndex].set("fileData", e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}
}

function getFirstTranslation() {
	var lang = window.navigator.languages.find(function(l) {
		return !Ember.isNone(TRANSLATIONS[l]);
	});

	return Ember.isNone(lang) ? TRANSLATIONS['en'] : TRANSLATIONS[lang];
}
