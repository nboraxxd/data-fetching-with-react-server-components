'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import { Spinner } from '@/components/spinner'
import { ChangeEvent, useEffect, useRef, useState, useTransition } from 'react'
import useDebounce from '@/hooks/use-debounce'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const [mounted, setMounted] = useState(false)
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')

  const debouncedSearchText = useDebounce(searchText, 300)

  function handleSearchInputChange(ev: ChangeEvent<HTMLInputElement>) {
    setSearchText(ev.target.value)
  }

  useEffect(() => {
    if (!mounted && searchText !== '') return

    const trimmedValue = debouncedSearchText.trim()

    const searchParams = new URLSearchParams()
    trimmedValue !== '' ? searchParams.set('search', trimmedValue) : searchParams.delete('search')

    startTransition(() => {
      router.push(`/?${searchParams}`)
    })
  }, [debouncedSearchText, mounted, router, searchText])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="search"
        id="search"
        className="block w-full rounded-md border-gray-300 pl-10 text-sm focus:border-gray-400 focus:outline-none focus:ring-0"
        placeholder="Search"
        value={searchText}
        onChange={handleSearchInputChange}
      />
      {isPending ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Spinner className="h-5 w-5 animate-spin text-gray-400" aria-hidden="true" />
        </div>
      ) : null}
    </div>
  )
}
