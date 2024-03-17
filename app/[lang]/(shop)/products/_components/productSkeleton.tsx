import { Skeleton } from '@/components/ui/skeleton'

export default function ProductSkeleton() {
  return (
    <div className="mt-4 grid grow grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {[...Array(15)].map((_, index) => (
        <div key={index} className="flex w-full flex-col gap-2">
          <Skeleton className="relative aspect-square w-full bg-gray-200 "></Skeleton>
          <div className="flex w-full gap-1">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="relative aspect-square w-full max-w-12 bg-gray-200"
              ></Skeleton>
            ))}
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-[60%] bg-gray-300 lg:h-5 xl:h-7"></Skeleton>
            <Skeleton className="h-4 w-[30%] bg-gray-300 lg:h-5 xl:h-7 "></Skeleton>
          </div>
        </div>
      ))}
    </div>
  )
}
