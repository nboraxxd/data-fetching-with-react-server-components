import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

import { cn } from '@/utils'
import { SearchParamsProps } from '@/types'
import { SearchInput } from '@/app/search-input'

interface PaginationLinkProps {
  children: React.ReactNode
  currentSearchParams: URLSearchParams
  direction: 'previous' | 'next'
  page: number
  totalPages: number
}

const PAGE_SIZE = 10

export default async function Users({ searchParams }: SearchParamsProps) {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const totalUsers = await prisma.user.count({
    where: { name: { contains: search } },
  })
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE)

  const page = typeof searchParams.page === 'string' ? Math.min(Math.max(+searchParams.page, 1), totalPages) : 1

  const users = await prisma.user.findMany({
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
    where: { name: { contains: search } },
  })

  const currentSearchParams = new URLSearchParams()

  if (search) {
    currentSearchParams.set('search', search)
  }

  if (page) {
    currentSearchParams.set('page', `${page}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 pt-12">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div className="w-80">
            <SearchInput search={search} />
          </div>
          <div className="ml-16 mt-0 flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add user
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-6 -my-2">
            <div className="inline-block min-w-full px-6 py-2 align-middle">
              <div className="overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[62px] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:w-auto">
                        ID
                      </th>
                      <th className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="relative py-3.5 pl-3 pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {totalPages > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                            {user.id}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                          <td className="relative whitespace-nowrap py-4 pl-4 pr-6 text-right text-sm font-medium">
                            <a href="#" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
                              Edit
                              <ChevronRightIcon className="h-4 w-4" />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <p className="text-sm text-gray-700">
            Showing <span className="font-semibold">{totalPages > 0 ? (page - 1) * PAGE_SIZE + 1 : totalUsers}</span> to{' '}
            <span className="font-semibold">{Math.min(totalUsers, page * PAGE_SIZE)}</span> of{' '}
            <span className="font-semibold">{totalUsers}</span> users
          </p>
          {totalPages > 1 ? (
            <div className="ml-auto space-x-2 sm:mr-3">
              <PaginationLink
                currentSearchParams={currentSearchParams}
                page={page}
                totalPages={totalPages}
                direction="previous"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </PaginationLink>
              <PaginationLink
                currentSearchParams={currentSearchParams}
                page={page}
                totalPages={totalPages}
                direction="next"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </PaginationLink>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function PaginationLink({ children, currentSearchParams, page, direction, totalPages }: PaginationLinkProps) {
  const newSearchParams = new URLSearchParams(currentSearchParams)

  if (direction === 'previous') {
    if (page > 2) {
      newSearchParams.set('page', `${page - 1}`)
    } else {
      newSearchParams.delete('page')
    }
  }

  if (direction === 'next') {
    if (page < totalPages) {
      newSearchParams.set('page', `${page + 1}`)
    } else {
      newSearchParams.set('page', `${totalPages}`)
    }
  }

  const isDisabled = (direction === 'previous' && page === 1) || (direction === 'next' && page === totalPages)

  const paginationClassName =
    'inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-semibold text-gray-900 shadow transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'

  return !isDisabled ? (
    <Link
      href={Number(newSearchParams.get('page')) >= 2 ? `/?${newSearchParams}` : '/'}
      className={paginationClassName}
    >
      {children}
    </Link>
  ) : (
    <button
      className={cn(paginationClassName, 'disabled:pointer-events-none disabled:opacity-50')}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
