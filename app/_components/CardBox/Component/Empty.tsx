import React  from "react";

type Props = {
  title: string;
};
const CardBoxComponentEmpty  = ({ title }: Props) => {
  return (
    <div className="text-center py-24 text-gray-500 dark:text-slate-400">
      <p>{title}</p>
    </div>
  );
};

export default CardBoxComponentEmpty;
