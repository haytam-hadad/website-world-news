"use client"
import { useContext } from "react"
import Link from "next/link"
import Image from "next/image"
import { ThemeContext } from "../app/ThemeProvider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Footer() {
  const { categories } = useContext(ThemeContext)

  // Group categories by their group property
  const groupedCategories = categories.reduce((acc, category) => {
    if (!acc[category.group]) {
      acc[category.group] = []
    }
    acc[category.group].push(category)
    return acc
  }, {})

  return (
    <footer className="w-full py-4 border-t-4 border-mainColor dark:bg-white bg-thirdColor text-white dark:text-black mt-auto">
      <div className="max-w-7xl mx-auto px-5">
        {/* Logo and Copyright in one row */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/i1.svg"
              width={30}
              height={30}
              className="w-6 h-6 filter dark:filter-none invert"
              alt="Newsify Logo"
            />
            <span className="text-base font-bold">Newsify</span>
          </div>

          <p className="text-xs opacity-80">&copy; {new Date().getFullYear()} All rights reserved</p>
        </div>

        {/* Compact Categories Section with shadcn Accordion */}
        <div className="border-t border-white/10 dark:border-black/10 pt-3 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(groupedCategories).map(([group, groupCategories]) => (
              <Accordion key={group} type="single" collapsible className="text-sm">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="py-1 px-2 hover:bg-white/10 dark:hover:bg-black/5 rounded text-white/90 dark:text-black/90 text-xs font-medium hover:no-underline">
                    {group}
                  </AccordionTrigger>
                  <AccordionContent className="pl-2 mt-1 pb-1">
                    <ul className="space-y-1">
                      {groupCategories.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/categories/${category.id}`}
                            className="text-xs flex items-center gap-1 hover:text-mainColor dark:hover:text-mainColor transition-colors py-0.5"
                          >
                            <span className="opacity-80">{category.icon}</span>
                            <span>{category.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}

