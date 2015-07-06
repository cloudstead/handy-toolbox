BaseDataProcessorService = function() {
};

BaseDataProcessorService.prototype.extractFields = function(dataObj, initObj) {
	var retObj = initObj;

	if (!Ember.isNone(dataObj["fields"])) {

		dataObj["fields"].forEach( function(field) {
			if (field.isTimeOfDay) {
				var valArray = field.value.split(" ");
				var valTimeArray = valArray[0].split(":");
				var hours = parseInt(valTimeArray[0]);
				var minutes = parseInt(valTimeArray[1]);

				hours = valArray[valArray.length - 1] === "PM" ? hours + 12 : hours;
				retObj[field.elementId] = "" + minutes + " " + hours + " * * * *";
			} else {
				retObj[field.elementId] = field.get("value");
			}
		});

	}


	if (!Ember.isNone(dataObj["files"])) {

		dataObj["files"].forEach( function(field) {
			var aditionalInfoArray = field.get("type.additional").split("/");
			var fileNameData = {
				folders: aditionalInfoArray.slice(0, aditionalInfoArray.length -1),
				fileName: aditionalInfoArray[aditionalInfoArray.length -1]
			};
			retObj[field.elementId] = {
				fileData: field.get("fileData"),
				fileNameData: fileNameData
			};
		});

	}

	return retObj;
};

BaseDataProcessorService.prototype.findFieldIn = function(fieldsArray, fieldName) {
	return fieldsArray.find(function(field){
		var elementIdArray = field.get("elementId").split("/");
		var elementId = elementIdArray[elementIdArray.length - 1];
		return elementId === fieldName;
	});
};
