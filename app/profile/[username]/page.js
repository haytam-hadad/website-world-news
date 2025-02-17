import React from 'react';

const Profile = ({ params }) => {
    const user = params.username;
    return (
        <div>
            <h1>{user}s Profile</h1>
            <div>
                <h2>About Me</h2>
                <p>This is a brief description about {user}.</p>
            </div>
            <div>
                <h2>Contact Information</h2>
                <p>Email: {user}@example.com</p>
                <p>Phone: (123) 456-7890</p>
            </div>
            <div>
                <h2>Recent Activities</h2>
                <ul>
                    <li>Posted a new article</li>
                    <li>Commented on a post</li>
                    <li>Liked a comment</li>
                </ul>
            </div>
        </div>
    );
};

export default Profile;