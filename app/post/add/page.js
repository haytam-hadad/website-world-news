"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { ThemeContext } from "../../ThemeProvider";
import Image from "next/image";

export default function AddPostPage() {
  const router = useRouter();
  const { user } = useContext(ThemeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageType, setImageType] = useState("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([
    { id: "technology", name: "Technology" },
    { id: "health", name: "Health" },
    { id: "sports", name: "Sports" },
    { id: "science", name: "Science" },
  ]);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      content,
      category,
      image: imageType === "url" ? imageUrl : imageFile,
    };
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      router.push("/");
    } else {
      const data = await response.json();
      setErrors(data.errors);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-darkgrey p-6 rounded-lg shadow-md border border-gray-200 dark:border-border">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-11 h-11 rounded-full text-lg bg-mainColor text-bold text-white flex items-center justify-center">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">
            {user?.username || "User"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Trust Rating: {user?.trustRating}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          className="form_input"
          placeholder="What's on your mind?"
        />
        {errors.title && (
          <p className="text-red-600 dark:text-red-400">{errors.title}</p>
        )}

        <textarea
          value={content || ""}
          onChange={(e) => setContent(e.target.value)}
          className="form_input"
          placeholder="Share your thoughts..."
        />
        {errors.content && (
          <p className="text-red-600 dark:text-red-400">{errors.content}</p>
        )}

        <select
          value={category || ""}
          onChange={(e) => setCategory(e.target.value)}
          className="form_input"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-600 dark:text-red-400">{errors.category}</p>
        )}

        <div className="bg-gray-100 dark:bg-darkgrey p-4 rounded-lg">
          <p className="mb-2 font-medium text-primary">Image</p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="imageType"
                value="url"
                checked={imageType === "url"}
                onChange={() => setImageType("url")}
              />
              <span className="text-primary">URL</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="imageType"
                value="upload"
                checked={imageType === "upload"}
                onChange={() => setImageType("upload")}
              />
              <span className="text-primary">Upload</span>
            </label>
          </div>
          {imageType === "url" ? (
            <input
              type="text"
              value={imageUrl || ""}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form_input mt-2"
              placeholder="Enter image URL"
            />
          ) : (
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form_input mt-2"
            />
          )}
          {errors.image && (
            <p className="text-red-600 dark:text-red-400">{errors.image}</p>
          )}
          {imageType === "url" && imageUrl && (
            <Image
              src={imageUrl}
              alt="Preview"
              className="mt-4 w-full rounded-lg"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 font-bold rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Post
        </button>
      </form>
    </div>
  );
}

