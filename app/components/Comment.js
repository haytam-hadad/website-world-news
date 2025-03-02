import { Clock3, Flag, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

const Comment = ({ userProfilename, username, text, timeAgo, onReport, onReply }) => {
  return (
    <div className="flex hover:border-blue-300 dark:hover:border-blue-950 cursor-pointer w-full m-1 flex-col bg-lightgrey dark:bg-darkgrey border p-4 rounded-xl shadow-sm">
      <div className="flex flex-col w-full">
        {/* User Avatar and Name at the Top */}
        <header className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center text-white font-bold bg-gray-400 dark:bg-gray-700 rounded-full">
            {userProfilename ? userProfilename[0].toUpperCase() : "U"}
          </div>
          <div className="flex flex-col justify-between">
          <span className="flex items-center gap-1 " >
            <span className="capitalize cursor-pointer text-gray-900 dark:text-gray-100 font-medium text-lg">{userProfilename}</span>
            <span className=" cursor-pointer text-gray-400 dark:text-gray-500 text-xs">@{username}</span>         
          </span>
<span className="text-xs capitalize flex gap-1 items-center text-gray-400">
              {timeAgo} <Clock3 className="h-4 w-4 inline-block" />
            </span>
          </div>
        </header>

        {/* Comment Text */}
        <p className="text-md text-gray-600 dark:text-gray-300 line-clamp-4 px-3 mb-2">{text}</p>

        {/* Comment Actions */}
        <div className="flex items-center justify-between space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReport}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-red-500"
            >
              <Flag className="w-5 h-5 transition-transform transform hover:scale-110" />
            </button>
            <button
              onClick={onReply}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="w-5 h-5 transition-transform transform hover:scale-110" />
            </button>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
              <Share2 className="w-5 h-5 transition-transform transform hover:scale-110" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full cursor-pointer text-gray-500 hover:text-blue-500">
              <MoreHorizontal className="w-5 h-5 transition-transform transform hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
