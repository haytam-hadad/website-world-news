// import Profile from "@/app/components/Profile";
// const fetchUser = async (username) => {
//   try {
//     const apiUrl = `http://localhost:5000/api/user/${username}`;
//     const res = await fetch(apiUrl, { cache: "no-store" });
//     if (!res.ok) {
//       throw new Error(`Failed to fetch user: ${res.status} ${res.statusText}`);
//     }
//     const user = await res.json();
//     return user || null;
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return null;
//   }
// };

// export default async function ProfilePage({ params }) {
//   const { username } = await params;
//   const user = await fetchUser(username);

//   if (!user) {
//     return <p className="text-center text-red-500 text-xl font-bold">Error: User not found</p>;
//   }

//   return (
//       <Profile user={user} />
//   );
// }
