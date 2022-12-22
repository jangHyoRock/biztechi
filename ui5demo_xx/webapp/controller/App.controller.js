sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      'sap/ui/model/odata/v2/ODataModel',
      "sap/ui/model/json/JSONModel",
      "sap/ui/core/BusyIndicator"
    
  ],
  function(BaseController, ODataModel, JSONModel, BusyIndicator) {
    "use strict";

    return BaseController.extend("ui5demo.controller.App", {
      onInit() {
        window.ui5demo= this;
        var oModel;

        oModel = this.getView().getModel();
        BusyIndicator.show();

        oModel.read("/SalesList",{
          urlParameters: {
            "$skip" : 0,
            "$top" : 10000,
            "$expand": "to_Items"
          },
          success: fnsucces,
          error: fnerror
        });
        oModel.read("/ZPOC06_VH_RejectReason",{
          success: fnRejectSucces,
          error: fnerror
        });
        

        function fnsucces(oData,oResponse){
          window.ui5demo.getView().setModel(new JSONModel(oData.results), "salesList");
          BusyIndicator.hide();
        }
        function fnerror(error){
          console.log(error);
        }
        function fnRejectSucces(oData,oResponse){
          window.ui5demo.getView().setModel(new JSONModel(oData.results), "rejectReason");

         for(var i = 0; i <  window.ui5demo.getView().getModel("rejectReason").getProperty("/").length; i++){
            window.ui5demo.getView().getModel("rejectReason").setProperty("/"+i+"/comboText", window.ui5demo.getView().getModel("rejectReason").getProperty("/"+i+"/Status")+" ("+window.ui5demo.getView().getModel("rejectReason").getProperty("/"+i+"/StatusDesc")+")")
         }
        }
        
      },
      onAfterRendering (){
        console.log("onAfterRendering");
        console.log( sap.ushell.services.AppConfiguration);
        sap.ushell.services.AppConfiguration.setApplicationFullWidth(true);
      }

    });
  }
);
