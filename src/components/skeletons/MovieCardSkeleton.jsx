import Skeleton from "@/components/common/Skeleton";

const MovieCardSkeleton = () => {
  return (
    <div className="w-full">
      {/* Постер */}
      <Skeleton className="aspect-[2/3] w-full mb-3" />
      {/* Текст */}
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

export default MovieCardSkeleton;