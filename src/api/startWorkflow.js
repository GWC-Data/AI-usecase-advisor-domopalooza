import Domo from "ryuu.js";

export const startSupportWorkflow = async ({
  customerName,
  email,
  devEmail,
  usecase,
  requestId
}) => {

  const res = await Domo.post(
    "/domo/workflow/v1/models/SupportRequestWorkflow/start",
    {
      customerName,
      email,
      devEmail,
      useCase: usecase,
      requestId
    }
  );

  return res;
};


export const waitForWorkflowCompletion = async (instanceId) => {

  let status = "IN_PROGRESS";

  while (status === "IN_PROGRESS") {

    const res = await Domo.get(
      `/domo/workflow/v1/models/SupportRequestWorkflow/instance/${instanceId}`
    );

    status = res.status;

    console.log("Workflow status:", res.status);

    if (status === "COMPLETED") return res;
    if (status === "FAILED") throw new Error("Workflow failed");

    await new Promise((r) => setTimeout(r, 2000));
  }
};


export const getSupportTicket = async (requestId) => {

  const res = await Domo.post(
    "/domo/datastores/v1/collections/support_requests/documents/query",
    {
      "content.requestId": requestId
    }
  );

  return res?.[0];
};