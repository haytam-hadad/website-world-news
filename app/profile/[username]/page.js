import Profile from "@/app/components/Profile";

const fetchUserProfile = async (username) => {
    try {
        const response = await fetch("http://localhost:5000/api/userprofile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(`"username" : ${username }`),
            cache: "no-store", // Ensures fresh data every request (disable caching)
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

const ProfilePage = async ({ params }) => {
    const { username } = params;
    const userProfile = await fetchUserProfile(username);

    return (
        <div>
            {userProfile ? <Profile user={userProfile} /> : <p>User not found</p>}
        </div>
    );
};

export default ProfilePage;
