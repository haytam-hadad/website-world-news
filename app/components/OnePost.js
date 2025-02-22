"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Clock3,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Flag,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import Comment from "../components/Comment"; // Import the Comment component

const SinglePost = ({ post }) => {
  const [vote, setVote] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleUpvote = () => {
    setVote(vote !== "upvote" ? "upvote" : null);
  };

  const handleDownvote = () => {
    setVote(vote !== "downvote" ? "downvote" : null);
  };

  const toggleSubscribe = () => {
    setSubscribed(!subscribed);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newCommentObj = {
        id: Date.now(),
        user: "User Name", // Replace with actual user data
        text: newComment,
        timeAgo: "Just now", // Ideally, format timestamps properly
        avatar: "U", // Replace with user's initial or avatar image
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  const calculateTimeAgo = (t) => {
    if (!t) return "N/A";
    const publishedDate = new Date(t);
    if (isNaN(publishedDate.getTime())) return "N/A";
    const now = new Date();
    const diffInSeconds = Math.floor((now - publishedDate) / 1000);
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-1">
      <div className="flex flex-col w-full shadow-sm mx-auto bg-lightgrey dark:bg-darkgrey border p-2 rounded-xl">
        {/* Header Section */}
        <header className="flex rounded-full items-center justify-between text-sm text-gray-500 dark:text-gray-400 p-1 mb-3">
          <div className="flex items-center space-x-2">
            <div className="rounded-full border-mainColor bg-gray-400 dark:bg-gray-600 w-9 h-9 sm:w-11 sm:h-11  flex items-center justify-center text-lg capitalize font-semibold text-white">
              {post.author ? post.author.charAt(0) : "U"}
            </div>
            <div className="flex flex-col">
              <Link
                href={post.author ? `/profile/${post.author}` : "#"}
                className=" font-semibold truncate capitalize cursor-pointer hover:underline text-gray-900 dark:text-gray-100 text-md md:text-xl"
              >
                {post.author || "Unknown"}
              </Link>
            </div>
          </div>
          <span className="text-xs flex items-center text-gray-400">
            {calculateTimeAgo(post.publishedAt) || "Unknown"} &nbsp;
            <Clock3 className="h-4 w-4 inline-block" />
          </span>
          <button
            onClick={toggleSubscribe}
            className={`py-2 px-4 max-sm:px-2 rounded-full shadow-sm text-sm font-medium transition-all ${
              subscribed
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </header>
        <hr />
        {/* Title */}
        <h1 className="font-serif font-semibold text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-gray-100 p-2 mx-1 my-5 underline underline-offset-4">
          {post.title || "No Title Available"}
        </h1>

        {/* Image */}
        {post.imageUrl && post.imageUrl !== "" && (
          <div className="w-full h-60 lg:h-96 relative rounded-xl overflow-hidden mb-4">
            <Image
              className="w-full h-full object-cover rounded-xl"
              src={post.imageUrl}
              alt="Post Image"
              layout="fill"
            />
          </div>
        )}
        {/* Description */}
        <p className="text-xl max-sm:text-lg p-1 text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {post.content || "No content available"}
        </p>
        <hr className="m-2" />

        {/* Interaction Section */}
        <div className="flex items-center justify-between space-x-3 my-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-full cursor-pointer">
                <div
                  className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${
                    vote === "upvote" ? "text-green-600" : "text-gray-500"
                  }`}
                  onClick={handleUpvote}
                >
                  <ArrowBigUp className="w-7 h-7 transition-transform transform hover:scale-110" />
                </div>
                <div className="h-5 w-0.5 bg-gray-400 dark:bg-gray-500 mx-2" />
                <div
                  className={`p-1 rounded-full cursor-pointer hover:text-mainColor ${
                    vote === "downvote" ? "text-red-500" : "text-gray-500"
                  }`}
                  onClick={handleDownvote}
                >
                  <ArrowBigDown className="w-7 h-7 transition-transform transform hover:scale-110" />
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <MessageCircle className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <Share2 className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <Flag className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
                <MoreHorizontal className="w-5 h-5 transition-transform transform hover:scale-110" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href={`/category/${post.category}`}
              className="flex items-center cursor-pointer text-gray-500 hover:text-blue-500"
            >
              <p className="text-blue-500 cursor-pointer font-semibold capitalize text-sm sm:text-lg p-1 px-3 transition duration-300 hover:border border border-transparent hover:border-mainColor rounded-full">
                {post.category || "General"}
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="flex mt-4 flex-col w-full mx-auto bg-lightgrey dark:bg-darkgrey border p-3 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Comments
        </h2>

        <div className="mt-4 flex items-center w-full sm:flex-row flex-col sm:space-x-2 space-y-2">
          <input
            type="text"
            className="dark:bg-slate-950 w-full px-4 py-2 border border-mainColor rounded-lg text-gray-700 dark:text-gray-300 flex-1 sm:w-auto"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            className="bg-mainColor text-white p-2 rounded-lg sm:w-auto w-full"
          >
            Add Comment
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                user={comment.user}
                text={comment.text}
                timeAgo={comment.timeAgo}
                avatar={comment.avatar}
              />
            ))
          ) : (
            <p className="text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
