export async function dbReq({
  method,
  path,
  body = {},
}: {
  method: "POST" | "PUT";
  path: string;
  body?: any;
}) {
  const res = await fetch(
    `https://giridhar-s-workspace-bc9633.us-east-1.xata.sh/db/formulate:main${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${process.env.XATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json();
  return data;
}

export async function dbReqWithoutBody({
  method,
  path,
}: {
  method: "GET" | "DELETE";
  path: string;
  body?: any;
}) {
  await fetch(
    `https://giridhar-s-workspace-bc9633.us-east-1.xata.sh/db/formulate:main${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${process.env.XATA_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
}
