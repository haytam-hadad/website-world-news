"use client";
import { useEffect, useState } from "react";

export default function Profile({ user }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/articles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: user.username }),
                });

                if (!response.ok) throw new Error("Failed to fetch articles");

                const data = await response.json();
                setArticles(data);
            } catch (err) {
                console.error("Error fetching articles:", err);
                setArticles([
                    { id: 1, title: "Placeholder Article 1" },
                    { id: 2, title: "Placeholder Article 2" },
                ]);
            }
        };

        fetchArticles();
    }, [user.username]);

    return (
        <div className="profile p-4 max-w-2xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{user.username}s Profile</h1>
            <p className="text-gray-700 mb-4">Email: {user.email}</p>

            <h2 className="text-xl font-semibold mb-2">Articles</h2>

            {articles.length > 0 ? (
                <ul>
                    {articles.map((article) => (
                        <li key={article.id} className="text-gray-800">
                            {article.title}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No articles available.</p>
            )}
        </div>
    );
}
