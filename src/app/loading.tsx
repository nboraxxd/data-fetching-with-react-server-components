import { Spinner } from '@/components/spinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Spinner className="h-8 w-8 animate-spin" />
    </div>
  )
}
