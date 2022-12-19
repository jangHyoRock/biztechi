sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      'sap/ui/model/odata/v2/ODataModel',
      "sap/ui/model/json/JSONModel"
  ],
  function(BaseController, ODataModel, JSONModel) {
    "use strict";

    return BaseController.extend("ui5demo.controller.App", {
      onInit() {
        window.ui5demo= this;
        var oModel;

        oModel = this.getView().getModel();

        oModel.read("/SalesList",{
          success: fnsucces,
          error: fnerror
        });
        
        oModel.read("/ZPOC06_VH_RejectReason",{
          success: fnRejectSucces,
          error: fnerror
        });
        

        function fnsucces(oData,oResponse){
          window.ui5demo.getView().setModel(new JSONModel(oData.results), "salesList");
          

          for(var data of window.ui5demo.getView().getModel("salesList").oData){
            var salesOrderNumber = data.SalesOrderNumber;
            var  idx = 0
            oModel.read("/SalesList('"+salesOrderNumber+"')/to_Items", {success: fnsucces2});
            console.log()
            function fnsucces2(oData,oResponse){  
                      
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/results",oData.results[0]);
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/cmpre",parseFloat(oData.results[0].cmpre));
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/multiple",parseFloat(oData.results[0].multiple));
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/kbmeng",parseInt(oData.results[0].kbmeng));
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/abgru",oData.results[0].abgru);
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/posnr",oData.results[0].posnr);
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/vbeln",oData.results[0].vbeln);
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/vrkme",oData.results[0].vrkme);
              window.ui5demo.getView().getModel("salesList").setProperty("/"+idx +"/to_Items/waerk",oData.results[0].waerk);
            
              idx++
            }
          }
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
        

        
      }
    });
  }
);
