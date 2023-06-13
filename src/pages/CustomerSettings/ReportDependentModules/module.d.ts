export type ModuleResponse = {
  customerModuleId: string;
  customerModuleName: string;
  customerReportId: string;
  customerReportName: string;
  customerPlans: customerPlans[];
};

type customerPlans = {
  id: string;
  name: string;
};

// {"customerModuleId":"dd9f47d3-5c4d-4a31-807f-03f0975d6c79",
// "customerModuleName":"Stok Modulü",
// "customerReportId":"15e646c1-0507-4445-9775-3d29da8238bb",
// "customerReportName":"Fizibilite Raporu",
// "customerPlans":[
//   {"id":"b315b097-ec98-4521-b82a-254813eb876b",
//   "name":"Ugur-Emre-Plan"}
// ]
// }