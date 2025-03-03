import Profile from "../../../components/Profile";

const fetchSessionUser = async (username) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/userprofile?username=${username}`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch user profile: ${res.status} ${res.statusText}`);
    }

    const user = await res.json();
    return user || null;
  } catch (error) {
    console.error("Error fetching session user:", error);
    return null;
  }
};

export default async function ProfilePage({ params }) {
  const { username } = params;
  const userData = await fetchSessionUser(username);

  if (!userData) {
    return <p className="text-center text-red-500 text-xl font-bold">Error: User not found</p>;
  }

  return (
    <>
      <Profile userData={userData} />
    </>
  );
}
