"use client";

import { motion } from "framer-motion";

interface ScheduleItem {
  time: string;
  label: string;
}

const defaultSchedule: ScheduleItem[] = [
  { time: "17:00", label: "Kar\u015f\u0131lama" },
  { time: "18:00", label: "Nik\u00e2h T\u00f6reni" },
  { time: "19:00", label: "Yemek" },
  { time: "21:00", label: "Parti & Dans" },
];

interface EventScheduleProps {
  schedule?: { time: string; label: string }[];
}

export function EventSchedule({ schedule: propSchedule }: EventScheduleProps) {
  const schedule =
    propSchedule && propSchedule.length > 0 ? propSchedule : defaultSchedule;

  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="relative">
          <div className="absolute top-3 left-0 right-0 h-px bg-[#e8a87c]/15" />

          <div className="flex justify-between relative">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4735e] border-2 border-[#1a0f0a] relative z-10 mb-4" />

                <p className="font-merienda text-sm text-[#e8a87c] mb-1">
                  {item.time}
                </p>
                <p className="font-sans text-sm text-[#faf0e6]">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative">
          {schedule.map((item, index) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-start gap-5 relative">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#d4735e] shrink-0 mt-1" />
                  {index < schedule.length - 1 && (
                    <div className="w-px h-10 bg-[#e8a87c]/15" />
                  )}
                </div>

                <div className="pb-6">
                  <p className="font-merienda text-sm text-[#e8a87c]">
                    {item.time}
                  </p>
                  <p className="font-sans text-sm text-[#faf0e6] mt-0.5">
                    {item.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
