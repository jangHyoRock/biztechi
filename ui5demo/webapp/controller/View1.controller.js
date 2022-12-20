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

        return Controller.extend("ui5demo.controller.View1", {
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
                BusyIndicator.hide();
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
                var salesOrderNumber = window.ui5demo.getView().getModel("salesList").getProperty(sPath + "/SalesOrderNumber")
                var _salesOrderNumber = "'"+String(salesOrderNumber.padStart(10,'0'))+"'"; // '000003'

                MessageBox.confirm(new sap.m.VBox({items : [new sap.m.Text({text : 'Prising Date: '}).addStyleClass(''), this.pricingDatePicker]}), 
				{ 
                    title: "Re-Prising",
                    actions: ["Re-Prising", "Cancel"],
                    onClose: function(action){
                    if(action=="Re-Prising"){
                        var date = that.pricingDatePicker.getDateValue();
                        console.log(date);
                        if(date == null){
                            return;
                        }
                        BusyIndicator.show();
                        date.setHours(date.getHours() + 9);
                    
                        var dt = date;
                        var _dtFormat= dt.getFullYear()+ '-' + (dt.getMonth()+1).toString().padStart(2,'0') + '-' + dt.getDate().toString().padStart(2,'0');
                        var s_dtFormat = "datetime'"+_dtFormat+"T00:00'";

                        const xmlHttpPost = new XMLHttpRequest();
                        const xmlHttp = new XMLHttpRequest();

                        xmlHttp.open("GET", "http://localhost:9999/http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_C_SOLIST_B_V2", true)
                        //xmlHttp.open("GET", "http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_C_SOLIST_B_V2", true)
                        xmlHttp.setRequestHeader("Authorization", "Basic c3BvYzA2OlNwb2MwNiEh");
                        xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        xmlHttp.setRequestHeader("x-csrf-token", "fetch");
                        xmlHttp.send();
                        
                        xmlHttp.onreadystatechange = function() {
                            if (xmlHttp.readyState == 4) { 
                                if (xmlHttp.status == 200 || xmlHttp.status == 201){
                                    console.log("[status2] : " + xmlHttp.status);
                                    console.log("[response2] : " + "[success]");    				   				    				
                                    console.log("[response2] : " + xmlHttp.responseText);
                                    console.log("");
                                  
                                }
                                else {
                                    console.log("[status] : " + xmlHttp.status);
                                    console.log("[response] : " + "[fail]");    				   				    				
                                    console.log("[response] : " + xmlHttp.responseText);
                                    console.log("");  
                                    MessageToast.show(xmlHttp.status);   
                                    BusyIndicator.hide();   				
                                }				
                            } 
    		            }
                        xmlHttp.onload = () => {
                            if (xmlHttp.readyState == 4) { 
                                if (xmlHttp.status == 200 || xmlHttp.status == 201){
                                    console.log("[statusOnload] : " + xmlHttp.status);
                                    console.log("[responseOnload] : " + "[success3]");    				   				    				
                                    console.log("[responseOnload] : " + xmlHttp.responseText);
                                    console.log("[AllheadersOnload] : " + xmlHttp.getAllResponseHeaders());
                                    console.log("");

                                   // var url = "http://localhost:9999/http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2/rePricing?SalesOrderNumber="+_salesOrderNumber +"&pricingdate="+s_dtFormat ;
                                    var url = "http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2/rePricing?SalesOrderNumber="+_salesOrderNumber +"&pricingdate="+s_dtFormat ;
                                    var _durl = decodeURI(url);
                                    xmlHttpPost.open("POST", _durl,true);
                                    xmlHttpPost.setRequestHeader("Content-Type", "text/plain;charset=UTF-8") ;
                                    xmlHttpPost.setRequestHeader("Authorization", "Basic c3BvYzA2OlNwb2MwNiEh");
                                    xmlHttpPost.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                                    xmlHttpPost.setRequestHeader("x-csrf-token", xmlHttp.getResponseHeader("x-csrf-token"));
                                    //xmlHttpPost.setRequestHeader("Accept-Language","euc-kr");
                                    xmlHttpPost.setRequestHeader("Accept","application/json");
                                    xmlHttpPost.send();

                                    console.log("[statusPOST] : " + xmlHttpPost.status);
                                    console.log("[response2POST] : " + xmlHttpPost.responseText);
                                    console.log("[AllResponseHeadersPOST] : " + xmlHttpPost.getAllResponseHeaders());
                                    console.log("");

                                }else{
                                    alert("ERROR LOADING FILE!" + xmlHttp.status);
                                    MessageToast.show("err");
                                    MessageToast.show(xmlHttp.status); 
                                    BusyIndicator.hide();  
                                }
                            }
                        };
                        xmlHttpPost.onreadystatechange = function() {
                            if (xmlHttpPost.readyState == 4) { 
                                if (xmlHttpPost.status == 200 || xmlHttpPost.status == 201){
                                    var headers = xmlHttpPost.getResponseHeader('sap-message').trim().split('\r\n')[0];
                                    
                                    var _spmsg = headers.split('"message":"')[1];
                                    var msg = _spmsg.split('","target')[0];
                                    var _msg = decodeURIComponent(JSON.parse('"'+msg+'"'));

                                    MessageToast.show(_msg,{duration:5000});
                                    BusyIndicator.hide();

                                    console.log("[statusPost] : " + xmlHttpPost.status);
                                    console.log("[responsePost] : " + "[success]");    				   				    				
                                    console.log("[responsePost] : " + xmlHttpPost.responseText);
                                    console.log("");
                                  
                                }
                                else {
                                    console.log("[status] : " + xmlHttpPost.status);
                                    console.log("[response] : " + "[fail]");    				   				    				
                                    console.log("[response] : " + xmlHttpPost.responseText);
                                    console.log("");        				
                                    MessageToast.show(xmlHttpPost.status);   
                                    BusyIndicator.hide();
                                }				
                            } 
    		            }
                    }
                }});
            },

            onPressRejectAll : function(){
                console.log("reject all");
                this.rejectDatePicker = new sap.m.DatePicker({});
                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    values:window.ui5demo.getView().getModel("rejectReason").oData
                });

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
                var salesOrderNumber = window.ui5demo.getView().getModel("salesList").getProperty(sPath + "/SalesOrderNumber");
                var _salesOrderNumber = "'"+String(salesOrderNumber.padStart(10,'0'))+"'"; // '000003'
                //var _salesOrderNumber ="'0000004863'";
                //console.log(_salesOrderNumber);
                var rejectreason;

                MessageBox.confirm(new sap.m.VBox({items : [new sap.m.Text({text : 'Prising Date: '}).addStyleClass(''), this.rejectDatePicker,
                                                            new sap.m.Text({text : 'Reason for Rejection: '}).addStyleClass(''), this.recjectCombo]}), 
				{ 
                    title: "Reject All",
                    actions: ["Reject All", "Cancel"],
                    onClose: function(action){
                    if(action=="Reject All"){
                        rejectreason = "'"+window.view1.recjectCombo.getSelectedKey()+"'";
                        var date = that.rejectDatePicker.getDateValue();
                        if(date == null || rejectreason ==''){
                            return;
                        }
                        BusyIndicator.show();
                        date.setHours(date.getHours() + 9);
                    
                        var dt = date;
                        
                        var _dtFormat= dt.getFullYear()+ '-' + (dt.getMonth()+1).toString().padStart(2,'0') + '-' + dt.getDate().toString().padStart(2,'0');
                        var s_dtFormat = "datetime'"+_dtFormat+"T00:00'";
                                            
                        const xmlHttpPost = new XMLHttpRequest();
                        const xmlHttp = new XMLHttpRequest();

                        //xmlHttp.open("GET", "http://localhost:9999/http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2")
                        xmlHttp.open("GET", "http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2")
                        xmlHttp.setRequestHeader("Authorization", "Basic c3BvYzA2OlNwb2MwNiEh");
                        xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        xmlHttp.setRequestHeader("x-csrf-token", "FETCH");
                        
                        xmlHttp.send();
                        
                        xmlHttp.onreadystatechange = function() {
                            if (xmlHttp.readyState == 4) { 
                                if (xmlHttp.status == 200 || xmlHttp.status == 201){
                                    console.log("[statusReject All] : " + xmlHttp.status);
                                    console.log("[responseReject All] : " + "[success]");    				   				    				
                                    console.log("[responseReject All] : " + xmlHttp.responseText);
                                    console.log("");
                                  
                                }
                                else {
                                    console.log("[statusReject All] : " + xmlHttp.status);
                                    console.log("[responseReject All] : " + "[fail]");    				   				    				
                                    console.log("[responseReject All] : " + xmlHttp.responseText);
                                    console.log("");        
                                    MessageToast.show(xmlHttp.status); 
                                    BusyIndicator.hide();				
                                }				
                            } 
    		            }
                        xmlHttp.onload = () => {
                            if (xmlHttp.readyState == 4) { 
                                if (xmlHttp.status == 200 || xmlHttp.status == 201){
                                        console.log("[status3] : " + xmlHttp.status);
                                        console.log("[response3] : " + "[success3]");    				   				    				
                                        console.log("[response3] : " + xmlHttp.responseText);
                                        console.log("[Allheaders3] : " + xmlHttp.getAllResponseHeaders());
                                        console.log("");

                                   //var url = "http://localhost:9999/http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2/rejectAll?SalesOrderNumber="+_salesOrderNumber+"&pricingdate="+s_dtFormat+"&rejectreason="+rejectreason ;
                                    var url = "http://20.194.41.230:50000/sap/opu/odata/sap/ZSPOC06_03_SOLIST_B_V2/rejectAll?SalesOrderNumber="+_salesOrderNumber+"&pricingdate="+s_dtFormat+"&rejectreason="+rejectreason ;
                                    var _durl = decodeURI(url);
                                    console.log(_durl);
                                    xmlHttpPost.open("POST", _durl,true);
                                    xmlHttpPost.setRequestHeader('content-type', 'text/html');
                                    xmlHttpPost.setRequestHeader("Authorization", "Basic c3BvYzA2OlNwb2MwNiEh");
                                    xmlHttpPost.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                                    xmlHttpPost.setRequestHeader("x-csrf-token",xmlHttp.getResponseHeader("x-csrf-token"));
                                    //xmlHttpPost.setRequestHeader("Accept-Language","euc-kr");
                                    xmlHttpPost.setRequestHeader("Accept","application/json");

                                    xmlHttpPost.send();

                                    console.log("[statusPOST] : " + xmlHttpPost.status);
                                    console.log("[responsePOST] : " + xmlHttpPost.responseText);
                                    console.log("[AllResponseHeadersPOST] : " + xmlHttpPost.getAllResponseHeaders());
                                    console.log("");
                                
                                
                                }else{
                                    alert("ERROR LOADING FILE!" + xmlHttp.status);
                                    MessageToast.show(xmlHttp.status); 
                                    BusyIndicator.hide();
                                }
                            }
                           
                        };
                        xmlHttpPost.onreadystatechange = function(e) {
                            if (xmlHttpPost.readyState == 4) { 
                                if (xmlHttpPost.status == 200 || xmlHttpPost.status == 201){

                                    var headers = xmlHttpPost.getResponseHeader('sap-message').trim().split('\r\n')[0];
                                    var _spmsg = headers.split('"message":"')[1];
                                    var msg = _spmsg.split('","target')[0];
                                    var _msg = decodeURIComponent(JSON.parse('"'+msg+'"'));

                                    MessageToast.show(_msg,{duration:5000});
                                    BusyIndicator.hide();
                                    console.log("[statusPostReject All] : " + xmlHttpPost.status);
                                    console.log("[responsePostReject All] : " + "[success]");    				   				    				
                                    console.log("[responsePostReject All] : " + xmlHttpPost.responseText);
                                    console.log("[responsePostReject All] : " + xmlHttpPost.responseText);
                                    console.log("");
                                }
                                else {
                                    MessageToast.show("err");
                                    console.log("[statusReject All] : " + xmlHttpPost.status);
                                    console.log("[responseReject All] : " + "[fail]");    				   				    				
                                    console.log("[responseReject All] : " + xmlHttpPost.responseText);
                                    console.log("");      
                                    MessageToast.show(xmlHttpPost.status);   		
                                    BusyIndicator.hide();		
                                }				
                            } 
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

                    if(oControl.getId() == "container-ui5demo---View1--oSearch"){
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
                
                var _mAdaptFiltersDialogInitialItemsOrder = oFilterBar._mAdaptFiltersDialogInitialItemsOrder
                
                for(var item of _mAdaptFiltersDialogInitialItemsOrder){
                    if(item.filterItem.mProperties.visibleInFilterBar == false){
                        hidden.push(item.filterItem.mProperties.name)
                    }
                }

               
                return hidden;
            },

            aCategory : function(){
                var oFilterBar = this.byId("filterbar")
       
                var aFilterItems = oFilterBar.getFilterItems();
            
                var list = [];


                    
            
                for(var oFilterItem of aFilterItems){
                    var oControl = oFilterBar.determineControlByFilterItem(oFilterItem);
            
                    

                    if(oControl.getId() == "container-ui5demo---View1--oSearch"){
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
