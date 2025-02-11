"use client";

import Image from "next/image";
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

const SinglePost = () => {
  const [vote, setVote] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Alice",
      text: "This is a great post! I really enjoyed reading it.",
      timeAgo: "2 hours ago",
      avatar: "A", // You can change this if you want to use an actual avatar image
    },
    {
      id: 2,
      user: "Bob",
      text: "Thanks for sharing this information. Very insightful.",
      timeAgo: "3 hours ago",
      avatar: "B",
    },
  ]);
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

  return (
    <>
      <div className="flex flex-col w-full max-w-4xl mx-auto bg-lightgrey dark:bg-darkgrey border p-4 rounded-xl shadow-sm">
        {/* Header Section */}
        <header className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-full border-mainColor bg-gray-300 dark:bg-gray-700 w-10 h-10 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg text-gray-900 dark:text-gray-100 font-semibold">
                Author Name
              </span>
            </div>
          </div>
          <span className="text-xs flex items-center text-gray-400">
            2h ago &nbsp;
            <Clock3 className="h-4 w-4 inline-block" />
          </span>
          <button
            onClick={toggleSubscribe}
            className={`p-2 px-4 rounded-full shadow-sm text-sm font-medium transition-all ${
              subscribed
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </header>

        {/* Title */}
        <h1 className="font-serif font-semibold text-3xl text-gray-900 dark:text-gray-100 mb-4">
          Post Title Goes Here
        </h1>

        {/* Image */}
        <div className="w-full h-60 lg:h-96 relative rounded-xl overflow-hidden mb-4">
          <Image
            className="w-full h-full object-cover rounded-xl"
            src="/images/image.jpg"
            alt="Post Image"
            width={600}
            height={400}
          />
        </div>

        {/* Description */}
        <p className="text-md text-gray-600 dark:text-gray-300 mb-6">
          This is a placeholder for the post content. It will be replaced with
          the actual article body.
        </p>
        <hr className="m-2" />
                {/* Interaction Section */}
                <div className="flex items-center px-1 justify-between space-x-6 my-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
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
          <div className="flex items-center space-x-6 cursor-pointer text-gray-500 hover:text-blue-500">
            <p className="text-blue-500 cursor-pointer font-semibold capitalize text-md p-2">
              Category
            </p>
          </div>
        </div>
      </div>
      <div className="flex mt-3 flex-col w-full max-w-4xl mx-auto bg-lightgrey dark:bg-darkgrey border p-4 rounded-xl shadow-sm">
        {/* Comment Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Comments
          </h2>
          {/* Comment Input and Submit Button */}
          <div className="mt-3 flex flex-col sm:flex-row items-center p-1 space-x-3">
            <input
              type="text"
              className="flex-1 px-4 py-2 border w-full shadow-sm rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-mainColor"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition duration-300 sm:w-auto w-full sm:mt-0 mt-2 flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Comment</span>
            </button>
          </div>
          {/* Comment List */}
          <div className="mt-3 space-y-4">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                user={comment.user}
                text={comment.text}
                timeAgo={comment.timeAgo}
                avatar={comment.avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePost;

