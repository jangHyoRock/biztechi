sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/odata/v2/ODataModel",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController, ODataModel, JSONModel) {
      "use strict";
  
      return BaseController.extend("zspoc06.controller.App", {
        onInit() {
          window.zspoc06= this;
          var oModel;
  
          oModel = this.getView().getModel();
  
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
            window.zspoc06.getView().setModel(new JSONModel(oData.results), "salesList");
          }
          function fnerror(error){
            console.log(error);
          }
          function fnRejectSucces(oData,oResponse){
            window.zspoc06.getView().setModel(new JSONModel(oData.results), "rejectReason");
  
           for(var i = 0; i <  window.zspoc06.getView().getModel("rejectReason").getProperty("/").length; i++){
              window.zspoc06.getView().getModel("rejectReason").setProperty("/"+i+"/comboText", window.zspoc06.getView().getModel("rejectReason").getProperty("/"+i+"/Status")+" ("+window.zspoc06.getView().getModel("rejectReason").getProperty("/"+i+"/StatusDesc")+")")
           }
          }
        }
      });
    }
  );
  