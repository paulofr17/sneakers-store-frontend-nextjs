import { Skeleton } from '@/components/ui/skeleton'

export default function BestSellerSkeleton() {
  return (
    <div className="mt-6 h-[250px] w-[calc(100vw_-_24px)] max-w-[1720px] overflow-hidden min-[500px]:h-[300px] sm:h-[350px] md:h-[350px] lg:w-[calc(100vw_-_217px)]">
      <div className="grid h-full w-full grid-cols-2 gap-[10px] overflow-hidden md:grid-cols-3 min-[1250px]:grid-cols-4 min-[1350px]:grid-cols-5">
        <div className="flex h-full w-full flex-col gap-1">
          <Skeleton className="h-full w-full"></Skeleton>
          <div className="flex flex-col items-center justify-between gap-[2px]">
            <Skeleton className="h-4 w-[70%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
            <Skeleton className="h-4 w-[25%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-2">
          <Skeleton className="h-full w-full"></Skeleton>
          <div className="flex flex-col items-center justify-between gap-[2px]">
            <Skeleton className="h-4 w-[70%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
            <Skeleton className="h-4 w-[25%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
          </div>
        </div>
        <div className="hidden h-full w-full flex-col gap-2 md:flex">
          <Skeleton className="h-full w-full"></Skeleton>
          <div className="flex flex-col items-center justify-between gap-[2px]">
            <Skeleton className="h-4 w-[70%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
            <Skeleton className="h-4 w-[25%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
          </div>
        </div>
        <div className="hidden h-full w-full flex-col gap-2 min-[1250px]:flex">
          <Skeleton className="h-full w-full"></Skeleton>
          <div className="flex flex-col items-center justify-between gap-[2px]">
            <Skeleton className="h-4 w-[70%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
            <Skeleton className="h-4 w-[25%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
          </div>
        </div>
        <div className="hidden h-full w-full flex-col gap-2 min-[1350px]:flex">
          <Skeleton className="h-full w-full"></Skeleton>
          <div className="flex flex-col items-center justify-between gap-[2px]">
            <Skeleton className="h-4 w-[70%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
            <Skeleton className="h-4 w-[25%] bg-gray-300 lg:h-5 xl:h-6"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  )
}
