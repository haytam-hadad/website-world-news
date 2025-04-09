"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  FileText,
  Shield,
  User,
  UserCircle,
  Copyright,
  AlertOctagon,
  Lock,
  ShieldAlert,
  XCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsOfUsePage() {
  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <Shield className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          By accessing or using our Services, you agree to be bound by these Terms of Use and our Privacy Policy. If you
          do not agree to these terms, you must not access or use our Services.
        </p>
      ),
    },
    {
      id: "eligibility",
      title: "User Eligibility",
      icon: <User className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          You must be at least 13 years old to use our Services. If you are under 18, you need parent or guardian
          permission. We may refuse service to anyone and change eligibility requirements at any time.
        </p>
      ),
    },
    {
      id: "accounts",
      title: "User Accounts",
      icon: <UserCircle className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          You must provide accurate information when creating an account and are responsible for maintaining the
          security of your password. You must notify us immediately of any unauthorized account access.
        </p>
      ),
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <Copyright className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          Our Services and content are owned by us and protected by copyright and other intellectual property laws. You
          may only use our Services for personal, non-commercial use and must not reproduce, distribute, or modify our
          content.
        </p>
      ),
    },
    {
      id: "prohibited-activities",
      title: "Prohibited Activities",
      icon: <AlertOctagon className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          You must not use our Services for illegal purposes, to distribute spam, impersonate others, or interfere with
          the operation of our Services. You must not introduce harmful code or attempt to gain unauthorized access to
          our systems.
        </p>
      ),
    },
    {
      id: "content-guidelines",
      title: "Content Guidelines",
      icon: <FileText className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          You are responsible for any content you post. Content must not violate any rights, be defamatory, offensive,
          or contain malware. We reserve the right to remove content at our discretion without notice.
        </p>
      ),
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: <Lock className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your data. By
          using our Services, you agree to our Privacy Policy.
        </p>
      ),
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <ShieldAlert className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          To the extent permitted by law, we are not liable for any damages arising from your use of our Services,
          including direct, indirect, incidental, or consequential damages.
        </p>
      ),
    },
    {
      id: "termination",
      title: "Termination",
      icon: <XCircle className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          We may terminate your access to our Services at any time for any reason. You may terminate your account by
          discontinuing use or requesting account deletion.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: <RefreshCw className="w-5 h-5 text-mainColor flex-shrink-0" />,
      content: (
        <p>
          We may update these Terms at any time. For significant changes, we will provide notice. Continued use of our
          Services after changes means you accept the new Terms.
        </p>
      ),
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-mainColor/10">
          <FileText className="w-8 h-8 text-mainColor" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Use</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Please read these terms carefully before using our services. By accessing or using our platform, you agree to
          be bound by these terms.
        </p>
        <div className="mt-6 flex items-center justify-center text-sm">
          <p className="text-gray-500 dark:text-gray-400">Last Updated: April 9, 2024</p>
        </div>
      </motion.div>

      <div className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Important Notice</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                These terms create a legally binding agreement between you and our company. By using our services, you
                acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-darkgrey rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <AccordionItem value={section.id} className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  {section.icon}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {section.content}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If you have any questions about our Terms of Use, please{" "}
          <Link href="/contact" className="text-mainColor hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
