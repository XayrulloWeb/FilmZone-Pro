import clsx from 'clsx';

const Skeleton = ({ className }) => {
  return (
    <div 
      className={clsx(
        "bg-white/5 animate-pulse rounded-xl", 
        className
      )} 
    />
  );
};

export default Skeleton;