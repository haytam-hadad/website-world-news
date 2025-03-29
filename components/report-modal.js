"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeContext } from "@/app/ThemeProvider"

const ReportModal = ({ articleId, isOpen, onClose, onSuccess }) => {
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [isReporting, setIsReporting] = useState(false)
  const [reportError, setReportError] = useState("")
  const [reportSuccess, setReportSuccess] = useState("")

  const modalRef = useRef(null)
  const router = useRouter()
  const { user } = useContext(ThemeContext)

  // Close modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setReportReason("")
      setReportDescription("")
      setReportError("")
      setReportSuccess("")
    }
  }, [isOpen])

  const handleReportSubmit = async (e) => {
    e.preventDefault()

    if (!reportReason) {
      setReportError("Please select a reason for reporting")
      return
    }

    if (!user) {
      router.push("/login")
      return
    }

    setIsReporting(true)
    setReportError("")
    setReportSuccess("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/${articleId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reason: reportReason,
          description: reportDescription,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setReportSuccess(data.message || "Report submitted successfully")

        // Call the success callback
        if (onSuccess) {
          onSuccess()
        }

        // Close modal after a short delay
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setReportError(data.message || "Failed to submit report. Please try again.")
      }
    } catch (error) {
      console.error("Error reporting article:", error)
      setReportError("An error occurred. Please try again.")
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6"
            ref={modalRef}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Report Article</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-green-600 dark:text-green-400 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                {reportSuccess}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                {reportError && (
                  <div className="text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{reportError}</span>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for reporting <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="misinformation">Misinformation</option>
                    <option value="spam">Spam</option>
                    <option value="hate_speech">Hate speech</option>
                    <option value="violence">Violence</option>
                    <option value="inappropriate_content">Inappropriate content</option>
                    <option value="copyright">Copyright violation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional details (optional)
                  </label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-mainColor focus:border-mainColor dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Please provide any additional information that might help us understand the issue."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isReporting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                  >
                    {isReporting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReportModal

