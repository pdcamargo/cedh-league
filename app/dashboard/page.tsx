import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import Card from "../components/Card";

export default withPageAuthRequired(
  async function DashboardPage() {
    const { user } = (await getSession()) ?? {};

    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>{user?.name}</Card.Header.Title>
          <Card.Header.SubTitle>{user?.name}</Card.Header.SubTitle>
        </Card.Header>
        <Card.Body>Dashbvoaard {JSON.stringify(user)}</Card.Body>
      </Card>
    );
  },
  {
    returnTo: "/dashboard",
  }
);
