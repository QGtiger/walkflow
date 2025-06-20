import Bg1 from "../../assets/bg-01.webp";
import Bg2 from "../../assets/bg-02.webp";
import Bg3 from "../../assets/bg-03.webp";
import Bg4 from "../../assets/bg-04.webp";
import Bg5 from "../../assets/bg-05.webp";
import Bg6 from "../../assets/bg-06.webp";
import Bg7 from "../../assets/bg-07.webp";
import Bg8 from "../../assets/bg-08.webp";

import bg1s from "../../assets/bg-01-s.avif";
import bg2s from "../../assets/bg-02-s.avif";
import bg3s from "../../assets/bg-03-s.avif";
import bg4s from "../../assets/bg-04-s.avif";
import bg5s from "../../assets/bg-05-s.avif";
import bg6s from "../../assets/bg-06-s.avif";
import bg7s from "../../assets/bg-07-s.avif";
import bg8s from "../../assets/bg-08-s.avif";
import classNames from "classnames";

const options = [
  {
    value: "",
    thumbnail: "",
  },
  {
    value: Bg1,
    thumbnail: bg1s,
  },
  {
    value: Bg2,
    thumbnail: bg2s,
  },
  {
    value: Bg3,
    thumbnail: bg3s,
  },
  {
    value: Bg4,
    thumbnail: bg4s,
  },
  {
    value: Bg5,
    thumbnail: bg5s,
  },
  {
    value: Bg6,
    thumbnail: bg6s,
  },
  {
    value: Bg7,
    thumbnail: bg7s,
  },
  {
    value: Bg8,
    thumbnail: bg8s,
  },
];

export default function BackgroundSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((it) => {
        const isActive = value === it.value;
        return (
          <div
            key={it.value}
            className={classNames(
              " flex-grow-0 flex-shrink-0 relative rounded-md transition-all w-[22px] h-[22px] cursor-pointer overflow-hidden",
              " border-border border-solid border",
              {
                "border-primary": isActive,
              }
            )}
            onClick={() => onChange?.(it.value)}
          >
            {it.thumbnail ? (
              <div className="w-full h-full relative">
                <img
                  src={it.thumbnail}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div
                  className={classNames(
                    " absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all",
                    {
                      "opacity-100": isActive,
                    }
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="text-white w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 6 9 17l-5-5"
                      vectorEffect="non-scaling-stroke"
                    ></path>
                  </svg>
                </div>
              </div>
            ) : (
              <div className="transition-all absolute inset-0 border rounded-lg pointer-events-none flex items-center justify-center border-blue-600 shadow-optionSelectedRing]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className={classNames("text-gray-400 w-3 h-3", {
                    "text-primary": isActive,
                  })}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19.071 4.929 4.93 19.07M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2"
                    vectorEffect="non-scaling-stroke"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
