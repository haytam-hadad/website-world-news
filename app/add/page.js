"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { ThemeContext } from "../ThemeProvider";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";

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
  const [sources, setSources] = useState([{ type: "url", value: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title,
      content: formatContent(content),
      category,
      image: imageType === "url" ? imageUrl : imageFile,
      sources,
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

  const formatContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const boldElements = doc.querySelectorAll("strong");
    boldElements.forEach((el) => {
      el.outerHTML = `**${el.textContent}**`;
    });
    const underlineElements = doc.querySelectorAll("u");
    underlineElements.forEach((el) => {
      el.outerHTML = `*${el.textContent}*`;
    });
    return doc.body.textContent || "";
  };

  const handleAddSource = () => {
    setSources([...sources, { type: "url", value: "" }]);
  };

  const handleRemoveSource = (index) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSourceChange = (index, newSource) => {
    setSources(
      sources.map((source, i) => (i === index ? newSource : source))
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-1 sm:p-4 mt-2 rounded-lg">
      <div className="flex items-center space-x-2 mb-5">
        <div className="w-10 h-10 rounded-full text-lg bg-mainColor text-bold text-white flex items-center justify-center">
          {user.displayname.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary">
            {user?.displayname || "User"}           <p className="text-gray-500 dark:text-gray-400 text-sm">
              @{user?.username}
            </p>
          </h2>

        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          htmlFor="title"
          className="block text-primary font-medium mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="form_input"
        />
        {errors.title && (
          <p className="text-red-600 dark:text-red-400">{errors.title}</p>
        )}
        <label
          htmlFor="content"
          className="block text-primary font-medium mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content || ""}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter post content"
          className="form_input"
          rows="5"
        />
        {errors.content && (
          <p className="text-red-600 dark:text-red-400">{errors.content}</p>
        )}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Use **bold** and *underline* syntax for formatting.
        </p>

        <label
          htmlFor="category"
          className="block text-primary font-medium mb-1"
        >
          Category
        </label>
        <select
          id="category"
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
        <div className="bg-lightgrey border dark:bg-darkgrey p-4 rounded-lg">
          <label
            htmlFor="imageType"
            className="block text-primary font-medium mb-2"
          >
            Image
          </label>
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
              placeholder="Enter image URL"
              className="form_input mt-2"
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

        <div className="bg-lightgrey border dark:bg-darkgrey p-4 rounded-lg">
          <label
            htmlFor="sources"
            className="block text-primary font-medium mb-2"
          >
            Sources
          </label>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 border-gray-300 dark:border-gray-600"
              >
                <select
                  value={source.type}
                  onChange={(e) =>
                    handleSourceChange(index, {
                      type: e.target.value,
                      value: source.value,
                    })
                  }
                  className="form_input w-1/4"
                >
                  <option value="url">URL</option>
                  <option value="book">Book</option>
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                </select>
                <input
                  type="text"
                  value={source.value}
                  onChange={(e) =>
                    handleSourceChange(index, {
                      type: source.type,
                      value: e.target.value,
                    })
                  }
                  placeholder="Enter source URL or text"
                  className="form_input w-3/4"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSource(index)}
                  className="text-red-600 text-sm font-semibold dark:text-red-400 hover:text-red-800 dark:hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5 m-1" />
                </button>
              </div>
            ))}
            <br />
            <button
              type="button"
              onClick={handleAddSource}
              className="text-secondaryColor bg-mainColor flex items-center px-2 py-1 rounded-md"
            >
              Add other source <Plus />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 flex items-center justify-center gap-1 font-bold rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Post <Plus className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

