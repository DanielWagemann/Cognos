define (["/CognosScripts/HolidayCalendar.js", "/CognosScripts/ObjectMethods.js"], function (hc) {
	/*
	--	Configuration:
	
	{
		"PromptValues":
		[
			{
				"PromptName": "Bien",
				"PromptValue": ["2017-2019"]
			},
			{
				"PromptName": "WorkOrder", 
				"PromptValue": ["SM8251", "008125"]
			}, 
			{
				"PromptName": "AwardDate", 
				"PromptRange": ["2018-02-02T00:00:00.000"]
			}, 
			{
				"PromptName": "AdDate", 
				"PromptRange": [
					{
						"start":"2018-01-01T00:00:00.000", 
						"end":"2018-01-31T00:00:00.000"
					}, {
						"start":"2017-01-01T00:00:00.000", 
						"end":"2017-01-31T00:00:00.000"
					}
				]
			}, 
			{
				"PromptName": "CompletionDate", 
				"PromptRange": [{
					"start":"2018-02-02T00:00:00.000", 
					"end":""
				}]
			}, 
			{
				"PromptName": "StartDate", 
				"PromptRelative": "Last Month Begin"
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2018-01-01"]
			}, 
			{
				"PromptName": "EndDate", 
				"PromptRelative": "Yesterday"
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2018-02-19"]
			}, 
			{
				"PromptName": "EndDate", 
				"PromptRelative": "Last Work Day"
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2018-02-16"]
			}, 
			{
				"PromptName": "Biennium", 
				"PromptRelative": "This Biennium"
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2017-2019"]
			}, 
			{
				"PromptName": "Year", 
				"PromptRelative": "This Year"
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2018"]
			}, 
			{
				"PromptName": "FourMonthsOut",
				"PromptRelative": "Date Offset",
				"Interval": "month",
				"Number": 4
				
				//	On 2018-02-20, same as  
				//"PromptValue": ["2018-06-20"]
			}
		],
		"PromptIndex": 	//	future enhancement
		[
			{
				"PromptName": "Bien", 
				"PromptIndex": 0
			}, 
			{
				"PromptName": "fy", 
				"PromptIndex": [1, 2]
			}, 
			{
				"PromptName": "month", 
				"PromptIndex": "last"
			}
		], 
		"RequiredPrompts": 
		[
			["WorkOrderNumber","Biennium"], 	--	WorkOrderNumber and Biennium
			["WorkOrderNumber","FiscalYear"]	--	or WorkOrderNumber and FiscalYear
		], 
		"RequiredPromptCount":2,
		"SelectAll":  ["Bien", "fy", "month"], 	--	select all values in prompts with these names; value prompt, select UI List box
		"AutoComplete":  true
	}
	
	--	Page modules do not have configuration objects.
	--	The configuration for this page module is read from a text item named PromptConfiguration.
	
	
	*/
	
	var log = function (label, message) {
		console.log("    ****    " + label + " : " + message);
	}
	
	var convertValues = function (valArray) {
		var a = [];
		valArray.forEach(function (n) {
			a.push({"use": n, "display": n});
		});
		return a;
	}
	
	var convertRanges = function (valArray) {
		var a = [];
		valArray.forEach(function (n) {
			a.push({"start": {"use": n.start, "display": n.start}, "end": {"use": n.end, "display": n.end}});
		});
		return a;
	}
	
	var getValueFromSource = function (src) {
		var a = [];
		var n = src.element.innerHTML;
		a.push({"use": n, "display": n});
		return a;
	}
	
	var PromptPageLoaded = false;
	
	//var hc = new HolidayCalendar();
	
	function PageModule() {};
	
	PageModule.prototype.load = function( oPage ) {
		log("page", "PageModule.load" );
		
		
		////	Use ParamDisplay, not ParameterDisplay
		////	initialize parameter capture
		//var crObject = oPage.getControlByName("ReportName");
		////this.CurrentReport = "";
		//this.CurrentReport = sessionStorage.getItem("CurrentReport");
		//if (crObject) {
		//	this.CurrentReport = crObject.text;
		//	sessionStorage.setItem("CurrentReport", this.CurrentReport);
		//}
		////
		
		
		this.configContainer = oPage.getControlByName("PromptConfiguration");
		if (!this.configContainer) {
			alert("The prompt configuration container was not found.\r\nIt must be named \"PromptConfiguration\".");
		}
		//log("config tag name", configContainer.element.tagName);
		
		this.sConfig = this.configContainer.element.innerHTML;
		log("sConfig", this.sConfig);
		
		this.oConfig = JSON.parse(this.sConfig);
		
		if (this.oConfig.AutoComplete) {
			//	AutoComplete and the Auto-Submit property on a control are not compatible
			PromptPageLoaded = false;
		}
		//log("oConfig", JSON.stringify(oConfig));
		//log("Prompt values", oConfig.PromptValues.length);
	};
	
	PageModule.prototype.show = function( oPage ) {
		log("page", "PageModule.show" );
		//log("start of show", "PromptPageLoaded = " + PromptPageLoaded.toString());
		
		if (!PromptPageLoaded) {
			//log("page.show", "loading prompt defaults");
			if (this.oConfig.PromptValues) {
				//	set default prompt values
				this.oConfig.PromptValues.forEach(function (n) {
					//log("Prompt Name", n.PromptName);
					var oPrompt = oPage.getControlByName(n.PromptName);
					if (!oPrompt) {
						alert(n.PromptName + " was not found.");
					}
					else {
						if (n.PromptValue) {
					//		log("prompt value", n.PromptValue);
							oPrompt.setValues(convertValues(n.PromptValue));
						}
						if (n.PromptRange) {
					//		log("prompt range", JSON.stringify(n.PromptRange));
					//		log("prompt range", JSON.stringify(convertRanges(n.PromptRange)));
							oPrompt.setValues(convertRanges(n.PromptRange));
						}
						if (n.PromptValueSource) {
						//	log("prompt source", JSON.stringify(n.PromptValueSource));
						//	log("prompt source", JSON.stringify(getValueFromSource(oPage.getControlByName(n.PromptValueSource))));
							oPrompt.setValues(getValueFromSource(oPage.getControlByName(n.PromptValueSource)));
						}
						
						//"PromptValues" : [
						//	{
						//		"PromptName": "Biennium", 
						//		"PromptRelative": "This Biennium", 
						//		"PromptType": "value"	--	let's not offer a range
						//		
						//		//	On 2018-02-20, same as  
						//		//"PromptValue": ["2017-2019"]
						//	}
						//]
						if (n.PromptRelative) {
							switch (n.PromptRelative.toLowerCase()) {
								case "today":
									var d = new Date();
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "yesterday":
									var d = new Date();
									d.setDate(d.getDate()-1);
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "last work day":
									var d = new Date();
									d.setDate(d.getDate()-1);
									while (hc.isHoliday(d) || (d.getDay() % 6 == 0)) {
										d.setDate(d.getDate()-1);
									};
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this week begin":
									var d = new Date();
									d.setDate(d.getDate()-d.getDay());
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this month begin":
									var d = new Date();
									d.setDate(1);
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "last month begin":
									var d = new Date();
									d.setDate(1);
									d.setMonth(d.getMonth()-1);
									var a = [];
									var o = new Object();
									o.use = d.format("yyyy-mm-dd");
									o.display = d.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this year":
									var d = new Date();
									var a = [];
									var o = new Object();
									o.use = d.getFullYear();
									o.display = d.getFullYear();
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this fiscal year":
									var d = new Date();
									d.setMonth(d.getMonth()+6);
									var a = [];
									var o = new Object();
									o.use = d.getFullYear();
									o.display = d.getFullYear();
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this biennium":
									var d = new Date();
									d.setMonth(d.getMonth()+6);
									//	return biennium, like 2017-2019
									var s = (d.getFullYear() - (d.getFullYear() % 2) - 1).toString() + '-' + (d.getFullYear() - (d.getFullYear() % 2) + 1).toString();
									var a = [];
									var o = new Object();
									o.use = s;
									o.display = s;
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "this biennium begin year":
									var d = new Date();
									d.setMonth(d.getMonth()+6);
									//	return biennium begin year, like 2017 (on 2018-08-20)
									var y = d.getFullYear() - (d.getFullYear() % 2) - 1;
									var a = [];
									var o = new Object();
									o.use = y.toString();
									o.display = y.toString();
									a.push(o);
									oPrompt.setValues(a);
									break;
								case "date offset":
									var d = new Date();
									var d2 = d.dateAdd(n.Interval, n.Number, hc);
									var a = [];
									var o = new Object();
									o.use = d2.format("yyyy-mm-dd");
									o.display = d2.format("yyyy-mm-dd");
									a.push(o);
									oPrompt.setValues(a);
									break;
								default:
									//	error
							}
						}
					}
				});
			}
			
			if (this.oConfig.SelectAll) {
				//	for all prompts on this page, select all values in the value prompts
				this.oConfig.SelectAll.forEach(function (n) {
					//log("Select All", n);
					var oPrompt = oPage.getControlByName(n);
					if (!oPrompt) {
						alert(n + " was not found.");
					}
					else {
						//log(oPrompt.name, JSON.stringify(oPrompt.getValues(true)));
						oPrompt.setValues(oPrompt.getValues(true));
						//log(oPrompt.name, JSON.stringify(oPrompt.getValues()));
					}
				});
			}
			
			if (this.oConfig.RequiredPrompts) {
				//	Inspect the required prompt to verify that an acceptable combination of prompts is populated
				var ap = [];
				this.oConfig.RequiredPrompts.forEach(function (arr) {
					arr.forEach(function(sPromptName) {
						ap.push(oPage.getControlByName(sPromptName));
					}
				}
				
				ap.forEach(function(p) {
					p.setValidator(function () {
						var blnGood = false;
						//	check the entire set
						//	if any group is complete, we're done
						this.oConfig.RequiredPrompts.forEach(function (arr) {
							//	check each group
							if (!blnGood) {
								//	reset the counter
								var rpc = 0;
								arr.forEach(function(sPromptName, i, grp) {
									//log("Prompt Name", sPromptName);
									var oPrompt = oPage.getControlByName(sPromptName);
									if (!oPrompt) {
										alert(sPromptName + " was not found.");
									}
									else {
										rpc += (oPrompt.getValues()[0].use == undefined ? 0 : 1);
									}
								}
								//	if the counter grew to the size of the array, we're good
								if (arr.length == rpc) blnGood = true;
							}
						}
						return blnGood;
					}
				}
			}
			
			if (this.oConfig.RequiredPromptCount) {
				//	loop through the prompts on the page
				//	increment a counter if a prompt is populated
				//	When the counter equals RequiredPromptCount, we're done.  Enable the Finish button.
				//	If the counter never grows to RequiredPromptCount, disable the Finish button.
				//	This should probably occur within the prompt validator function for every prompt.
				//log("RequiredPromptCount:  ", this.oConfig.RequiredPromptCount);
				var rpc = this.oConfig.RequiredPromptCount;
				var ap = oPage.getAllPromptControls();
				ap.forEach(function(p) {
					//log("RequiredPromptCount:  Prompt", p.name);
					p.setValidator(function () {
						//log(p.name, "");
						var c = rpc;
						var i = 0;
						var a = oPage.getAllPromptControls();
						a.forEach(function(e) {
							//log("    Prompt Validation:  Prompt" + e.name, JSON.stringify(e.getValues()));
							//log("    Prompt Validation:  Prompt" + e.name, e.getValues()[0].use == undefined);
							i += e.getValues()[0].use == undefined ? 0 : 1;
							//log("    Prompt Validation:  Prompt" + e.name, i);
						});
						//log("PromptCount", i);
						//log("RequiredPromptCount", c);
						log("Valid Prompt", i >= c);
						return i >= c;
					});
				});
			}
			
			
			//	AutoComplete
			//	Do this last.
			if (this.oConfig.AutoComplete) {
				log("AutoComplete", "");
				//var oCR = cognos.Report.getReport("_THIS_");
				//oCR.sendRequest( oCR.Action.NEXT );
				if (!oPage.AutoFinish) {
					oPage.AutoFinish = function () {
						oPage.getControlByName("AutoFinish").ControlHost.next();
					};
				}
				//setTimeout(oPage.AutoFinish(), 100);
				oPage.AutoFinish();
			}
			
			PromptPageLoaded = true;
		}
		//log("end of show", "PromptPageLoaded = " + PromptPageLoaded.toString());
	};
	
	PageModule.prototype.hide = function( oPage ) {
		log("page", "PageModule.hide" );
	};
	
	PageModule.prototype.destroy = function( oPage ) {
		log("page", "PageModule.destroy" );
		
		////	use ParamDisplay, not ParameterDisplay
		////	capture parameters
		//if (this.CurrentReport) {
		//	if (!sessionStorage.getItem("Parameters" + this.CurrentReport)) {
		//		sessionStorage.setItem("Parameters" + this.CurrentReport, JSON.stringify({}));
		//	}
		//	
		//	var prompts = oPage.getAllPromptControls();
		//	prompts.forEach(function (e) {
		//		var p = JSON.parse(sessionStorage.getItem("Parameters" + this.CurrentReport));
		//		var v1 = e.getValues();
		//		var v2 = JSON.stringify(v1);
		//		var v3 = e.name;
		//		var v4 = [v3, v2];
		//		p[e.parameter] = JSON.stringify(v4);
		//		//p[e.parameter] = JSON.stringify([e.name, JSON.stringify(e.getValues())]);
		//		sessionStorage.setItem("Parameters" + this.CurrentReport, JSON.stringify(p));
		//	}, this);
		//}
		////
	};
	
	return PageModule;
});