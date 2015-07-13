App.FieldModel = Ember.Object.extend({
	hint: function() {
		return this.get("info").toString();
	}.property("info"),

	type: function() {
		var fieldType = this.get("fieldType");
		var fieldFilePath = this.get("fieldFilePath");
		var retType = {};

		var INPUT_TYPES = {
			'hostname_part': 'text',
			'hostname': 'text',
			'field': 'text',
			'host': 'text',
			'port': 'text',
			'login': 'text',
			'list_ipaddr': 'text',
			'text': 'text',
			'hash': 'password',
			'secret_key': 'password',
			'password': 'password',
			'username': 'text',
			'email': 'email',
			'fqdn': 'text',
			'list/ipaddr': 'text',
			'pick_one': 'choice',
			'cron': 'text',
			'file': 'file'
		};

		if(!INPUT_TYPES.hasOwnProperty(fieldType)){
			fieldType = 'text';
		}

		retType = {
			typeName: INPUT_TYPES[fieldType],
			typeKind: fieldType,
			additional: fieldFilePath,
		};

		return retType;
	}.property(),

	isFile: function() {
		return this.get("type").typeKind === 'file';
	}.property(),

	isChoice: function() {
		return this.get("type").typeKind === 'pick_one';
	}.property(),

	isTimeOfDay: function() {
		return this.get("type").typeKind === 'cron';
	}.property(),
});

App.FieldModel.reopenClass({

	resolveChoices: function(choices, translation) {
		if (Ember.isNone(choices)) {
			return [];
		}

		if (Ember.isNone(choices)) {
			return [];
		}

		var retChoices = [];

		choices.forEach(function(choice) {
			var translat = Ember.isNone(translation['choices']) ? choice : translation['choices'][choice];
			retChoices.push({
				label: translat,
				value: choice,
			});
		});

		return retChoices;
	},

	createNew: function(fieldName, fieldData, translation) {
		if (Ember.isNone(translation)) {
			translation = {
				label: fieldName,
				info: fieldName
			};
		}
		return App.FieldModel.create({
			elementId: fieldName,
			label: Ember.String.htmlSafe(translation['label']),
			info: Ember.String.htmlSafe(translation['info']),
			fieldType: fieldData.type,
			fieldFilePath: fieldData.additional,
			value: "",
			fileData: "",
			choices: App.FieldModel.resolveChoices(fieldData.choices, translation),
			dataKind: fieldName,
			required: !Ember.isNone(fieldData.required) ? fieldData.required + "" : "false",
		});
	},

	createFileFields: function(model, defaultTranslation) {
		var fieldKind = "files";

		var fields =  model[fieldKind];

		if (Ember.isNone(fields)) {
			return [];
		}

		var fieldPrefix = model["field_prefix"];
		var fieldDefaultPrefixArray = ["cloudos", "init"];
		var fieldsArray = [];

		for (var fieldName in fields) {
			var filePath = fields[fieldName];

			var fieldData = {
				type: "file",
				additional: filePath
			};

			var newField = App.FieldModel.createNew(fieldName, fieldData, defaultTranslation[fieldKind][fieldName + "_file"]);
			fieldsArray.push(newField);
		}

		return fieldsArray;
	},

	createFields: function(model, defaultTranslation) {
		var fieldKind = "fields";

		var fieldNames =  model[fieldKind];

		if (Ember.isNone(fieldNames)) {
			return [];
		}

		var fieldPrefix = model["field_prefix"];
		var fieldDefaultPrefixArray = ["cloudos", "init"];
		var fieldsArray = [];

		fieldNames.forEach(function(fieldName) {
			var fieldDataArray = fieldName.split("/");
			var fieldAppName = "cloudos";
			var fieldCategory = "init";
			var fieldKey = "";

			if (fieldDataArray.length === 3) {
				fieldAppName = fieldDataArray[0];
				fieldCategory = fieldDataArray[1];
				fieldKey = fieldDataArray[2];
			} else if (fieldDataArray.length === 1) {
				var prefixArray = [];
				if (Ember.isNone(fieldPrefix)) {
					prefixArray = fieldDefaultPrefixArray;
				} else {
					prefixArray = fieldPrefix.split("/");
				}

				fieldAppName = prefixArray[0];
				fieldCategory = prefixArray[1];
				fieldKey = fieldDataArray[0];
			}

			var fieldData = {};
			var translation = {};
			var jsonURL = APPS_DATA_PATH + fieldAppName + "/" + METADATA_FILENAME;
			var translationURL = APPS_DATA_PATH + fieldAppName + "/" + TRANSLATION_FILENAME;

			$.ajax({
				dataType: "json",
				url: jsonURL,
				async: false,
				success: function (data) {
					fieldData = data["categories"][fieldCategory][fieldKind][fieldKey];
				}
			});

			$.ajax({
				dataType: "json",
				url: translationURL,
				async: false,
				success: function (data) {
					translation = data["categories"][fieldCategory][fieldKey];
					if (Ember.isNone(translation)) {
						translation = defaultTranslation[fieldKind][fieldKey];
					}
				}
			});

			var newField = App.FieldModel.createNew(fieldName, fieldData, translation);
			fieldsArray.push(newField);

		});

		return fieldsArray;
	},

	serializeArray: function (fieldModels) {
		var retArray = [];
		fieldModels.forEach(function(fieldModel) {
			retArray.push(fieldModel.serialize());
		});
		return retArray;
	}

	// createNew: function(fieldName, fieldType, translation, choices) {
	// 	return App.FieldModel.create({
	// 		elementId: fieldName,
	// 		label: Ember.String.htmlSafe(translation['label']),
	// 		help: Ember.String.htmlSafe(translation['help']),
	// 		fieldType: fieldType,
	// 		value: "",
	// 		fileData: "",
	// 		choices: App.FieldModel.resolveChoices(choices, translation),
	// 	});
	// },

});
