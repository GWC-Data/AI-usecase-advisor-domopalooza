import domo from "ryuu.js";

const COLLECTION = "support_requests";

/* create document */

export const createSupportRequest = async ({
  customerName,
  email,
  usecase
}) => {

  const res = await domo.post(
    `/domo/datastores/v1/collections/${COLLECTION}/documents`,
    {
      content: {
        customerName,
        email,
        usecase,
        agentResult: "",
        status: "pending"
      }
    }
  );

  return res;
};


/* start workflow */

export const startSupportWorkflow = async ({
  customerName,
  email,
  devEmail,
  usecase,
  requestId
}) => {

  const res = await domo.post(
    "/domo/workflow/v1/models/0a8c907d-144b-4de3-9ba1-93541cd1e555/start",
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


/* get document */

export const getSupportRequestById = async (docId) => {

  const res = await domo.get(
    `/domo/datastores/v1/collections/${COLLECTION}/documents/${docId}`
  );

  return res;
};