import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default withPageAuthRequired(
  async function Home() {
    redirect("/dashboard");

    return <div />;
  },
  { returnTo: "/dashboard" }
);
