sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageBox',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/library",
	"sap/ui/unified/library",
    'sap/ui/comp/smartvariants/PersonalizableInfo',
	"sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
	MessageBox,
	Filter,
	FilterOperator,
	CoreLibrary, 
    UnifiedLibrary,
	PersonalizableInfo,
	MessageToast,
    BusyIndicator) {
        "use strict";
        var CalendarDayType = UnifiedLibrary.CalendarDayType,
		ValueState = CoreLibrary.ValueState;

        return Controller.extend("ui5demodeploy.controller.View1", {
            onInit: function () {
                window.view1 = this;

                this.oExpandedLabel = this.getView().byId("expandedLabel");
			    this.oSnappedLabel = this.getView().byId("snappedLabel");
                this.oSmartVariantManagement = this.byId("svm");
                this.oFilterBar = this.byId("filterbar");
                var oPersInfo = new PersonalizableInfo({
                    type: "filterBar",
                    keyName: "persistencyKey",
                    dataSource: "",
                    control: this.oFilterBar
                });
                this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
                this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);
            },

            rowSelectionChange : function(e){
                var idx = this.byId("salesTable").getSelectedIndices()
                this.sPath = e.getParameters().rowContext.sPath;

                if(idx.length != 0){
                    this.byId("rePricingLink").setEnabled(true);
                    this.byId("rejectAllLink").setEnabled(true);
                }else{
                    this.byId("rePricingLink").setEnabled(false);
                    this.byId("rejectAllLink").setEnabled(false);
                }
            },

            onPressPricing : function(){
                this.pricingDatePicker = new sap.m.DatePicker({});
                var that = this;
                var sPath =this.sPath
                var salesOrderNumber = window.ui5demodeploy.getView().getModel("salesList").getProperty(sPath + "/SalesOrderNumber")
                var oModel = this.getView().getModel();

                MessageBox.confirm(new sap.m.VBox({items : [new sap.m.Text({text : 'Prising Date: '}).addStyleClass(''), this.pricingDatePicker]}), 
				{ 
                    title: "Re-Prising",
                    actions: ["Re-Prising", "Cancel"],
                    onClose: function(action){
                    if(action=="Re-Prising"){
                        var date = that.pricingDatePicker.getDateValue();
                        if(date == null){
                            return;
                        }
                        BusyIndicator.show();
                        date.setHours(date.getHours() + 9);

                        oModel.callFunction("/rePricing",{method:"POST", 
                        urlParameters:{"SalesOrderNumber":salesOrderNumber, 
                                        "pricingdate":date}, 
                                        success:fnSuccess, 
                                        error: fnError})
                        function fnSuccess(oData,oResponse){
                            var _spmsg = JSON.stringify(oResponse.headers).split('message\\":\\"')[1]
                            var _starget = _spmsg.split('\\",\\"')[0];
                            var _msg = _starget.replaceAll("\\\\","\\");
                            var msg = decodeURIComponent(JSON.parse('"'+_msg+'"'));
                            
                            MessageToast.show(msg,{duration:5000});
                            BusyIndicator.hide();
                        }
                        function fnError(error){
                        BusyIndicator.hide();
                        }
                    }
                }});
            },

            onPressRejectAll : function(){
                this.rejectDatePicker = new sap.m.DatePicker({});
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    values:window.ui5demodeploy.getView().getModel("rejectReason").oData
                });
                var aModel = this.getView().getModel();
                sap.ui.getCore().setModel(oModel);

                this.recjectCombo  = new sap.m.ComboBox({width:'143%'});
                this.recjectCombo .bindProperty("tooltip", "/tooltip");
                this.recjectCombo .setModel(oModel);

                var oItemTemplate1 = new sap.ui.core.ListItem();
                    oItemTemplate1.bindProperty("key", "Status");
                    oItemTemplate1.bindProperty("text", "comboText");

                this.recjectCombo .bindItems("/values", oItemTemplate1);

                var that = this;
                var sPath = this.sPath
                var salesOrderNumber = window.ui5demodeploy.getView().getModel("salesList").getProperty(sPath + "/SalesOrderNumber");
                var rejectreason;

                MessageBox.confirm(new sap.m.VBox({items : [new sap.m.Text({text : 'Prising Date: '}).addStyleClass(''), this.rejectDatePicker,
                                                            new sap.m.Text({text : 'Reason for Rejection: '}).addStyleClass(''), this.recjectCombo]}), 
				{ 
                    title: "Reject All",
                    actions: ["Reject All", "Cancel"],
                    onClose: function(action){
                    if(action=="Reject All"){
                        rejectreason = window.view1.recjectCombo.getSelectedKey();
                        var date = that.rejectDatePicker.getDateValue();
                        if(date == null || rejectreason ==''){
                            return;
                        }
                        BusyIndicator.show();
                        date.setHours(date.getHours() + 9);
                        
                        aModel.callFunction("/rejectAll",{method:"POST", 
                        urlParameters:{"SalesOrderNumber":salesOrderNumber, 
                                        "pricingdate":date,
                                        "rejectreason":rejectreason}, 
                                        success:fnSuccess, 
                                        error: fnError})
                        function fnSuccess(oData,oResponse){
                            var _spmsg = JSON.stringify(oResponse.headers).split('message\\":\\"')[1];
                            var _starget = _spmsg.split('\\",\\"')[0];
                          
                            var _msg = _starget.replaceAll("\\\\","\\");
                            var msg = decodeURIComponent(JSON.parse('"'+_msg+'"'));
                            MessageToast.show(msg,{duration:5000});
                            BusyIndicator.hide();
                        }
                            function fnError(error){
                            BusyIndicator.hide();
                        }
                    }
                }});
            },

            liveSearch : function(e){
                this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
                this.oSnappedLabel.setText(this.getFormattedSummaryText());
                this.onSearch();
            },

            handleChange: function (oEvent) {
                  var  oDP = oEvent.getSource(),
                    sValue = oEvent.getParameter("value"),
                    bValid = oEvent.getParameter("valid");
    
                    this._iEvent++;
               
    
                if (bValid) {
                    oDP.setValueState(ValueState.None);
                } else {
                    oDP.setValueState(ValueState.Error);
                }
            },

            tokenUpdate : function(e){
                this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
                this.oSnappedLabel.setText(this.getFormattedSummaryText());
                var oTable = this.byId("salesTable");
                oTable.setShowOverlay(true);    

            },

            onFilterChange : function(e){
                this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
                this.oSnappedLabel.setText(this.getFormattedSummaryText());
                var oTable = this.byId("salesTable");
                oTable.setShowOverlay(true);
            },

            onSearch: function() {
                var aFilter = this.aFilter();
                
                var oTable = this.byId("salesTable");
                var oBinding = oTable.getBinding();
                oBinding.filter(aFilter);
                oTable.setShowOverlay(false);
            },

            dateFormat : function(date){
                if(date == null){
                    return ''
                }
                
                var dt = date;
                return dt.getFullYear()+ '. ' + dt.getMonth().toString().padStart(2,'0') + '. ' + dt.getDate().toString().padStart(2,'0') + '. ';
            },

            getFormattedSummaryText: function() {
                var aFiltersWithValues = this.aFilter();
                var aCategory = this.aCategory();
    
                if (aFiltersWithValues.length === 0) {
                    return "No filters active";
                }
    
                if (aFiltersWithValues.length === 1) {
                    return aFiltersWithValues.length + " filter active: " + aCategory.join(", ");
                }
    
                return aFiltersWithValues.length + " filters active: " + aCategory.join(", ");
            },
    
            getFormattedSummaryTextExpanded: function() {
                var aFiltersWithValues = this.aFilter()
    
                if (aFiltersWithValues.length === 0) {
                    return "No filters active";
                }
    
                var sText = aFiltersWithValues.length + " filters active",
                    aNonVisibleFiltersWithValues = this.hiddenFilter();
    
                if (aFiltersWithValues.length === 1) {
                    sText = aFiltersWithValues.length + " filter active";
                }
    
                if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
                    sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
                }
    
                return sText;
            },

            aFilter: function(){
                var oFilterBar = this.byId("filterbar")
       
                var aFilterItems = oFilterBar.getFilterItems();
            
                var aFilter = []

                for(var oFilterItem of aFilterItems){
                    var oControl = oFilterBar.determineControlByFilterItem(oFilterItem);
            
                    var oFilter

                    if(oFilterItem.mProperties.name == "Search"){
                        var sQuery = this.byId("oSearch").getValue();

                        if (sQuery) {
                            aFilter.push(new Filter({
                                filters: [
                                    new Filter("OrderType", FilterOperator.Contains, sQuery),
                                    new Filter("SalesOrderNumber", FilterOperator.Contains, sQuery),
                                    new Filter("SalesOrganization", FilterOperator.Contains, sQuery),
                                    new Filter("DistChannel", FilterOperator.Contains, sQuery),
                                    new Filter("Division", FilterOperator.Contains, sQuery),
                                    new Filter("SalesOffice", FilterOperator.Contains, sQuery),
                                    new Filter("SalesGroup", FilterOperator.Contains, sQuery),
                                    new Filter("RejectionStatus", FilterOperator.Contains, sQuery),
                                    new Filter("StatusOfStatic", FilterOperator.Contains, sQuery),
                                    new Filter("DeliverStatus", FilterOperator.Contains, sQuery),
                                    new Filter("CreatedBy", FilterOperator.Contains, sQuery),
                                    new Filter("CustomerName", FilterOperator.Contains, sQuery),
                                    new Filter("OrderType", FilterOperator.Contains, sQuery),
                                ],
                                and: false,
                              }));   
                        }
                    }else{
                        if(oControl.getFilter().aFilters){
                            var list = [];

                            for(var oFIlter of oControl.getFilter().aFilters){
                                if(oFIlter.oValue2 == undefined){
                                    list.push(new Filter(oFIlter.sPath, oFIlter.sOperator, oFIlter.oValue1));
                                }else{
                                    list.push(new Filter(oFIlter.sPath, oFIlter.sOperator, oFIlter.oValue1, oFIlter.oValue2));
                                }
                            }

                            aFilter.push(new Filter({
                                filters: list,
                                and: false,
                            }));   
                        }
                    }
                }

                return aFilter;
            },

            hiddenFilter: function(){
                var oFilterBar = this.byId("filterbar")
                var hidden = []
               
                return hidden;
            },

            aCategory : function(){
                var oFilterBar = this.byId("filterbar")
                var list = [];
                var aFilterItems = oFilterBar.getFilterItems();
                for(var oFilterItem of aFilterItems){
                    var oControl = oFilterBar.determineControlByFilterItem(oFilterItem);

                    if(oFilterItem.mProperties.name == "Search"){
                        var sQuery = this.byId("oSearch").getValue();
                        if (sQuery) {
                            list.push(oFilterItem.getName())
                        }
                    }else{
                        if(oControl.getFilter().aFilters){
                            list.push(oFilterItem.getName())
                        }
                    }
                }

                return list;
            }

        });
    });