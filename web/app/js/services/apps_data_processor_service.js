AppsDataProcessorService = function() {
	BaseDataProcessorService.call();
};

AppsDataProcessorService.prototype = new BaseDataProcessorService();

AppsDataProcessorService.prototype.process = function(dataToProcess, ouputFolder, extensionData) {
	for(var app in dataToProcess){
		var data = this.extractFields(dataToProcess[app], {});
		ouputFolder.file(app + ".json", JSON.stringify(data));
	}
};
