"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { RoomImageCarousel } from "@/components/hotels/RoomImageCarousel";
import { HotelMobileBookingBar } from "@/components/hotels/HotelMobileBookingBar";
import type { Hotel, HotelRoom } from "@/types/hotel";

interface Props {
  hotel: Hotel;
  roomImagesMap: Record<number, string[]>;
  roomDisplayPrices: Record<string, { season: string; price: number }[] | null>;
}

export function HotelRoomsBookingClient({ hotel, roomImagesMap, roomDisplayPrices }: Props) {
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom>(hotel.rooms[0]);

  return (
    <>
      {/* Where you'll sleep */}
      <div className="py-8 border-b border-[var(--border-default)]" id="rooms">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Where you&apos;ll sleep</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotel.rooms.map((room, i) => {
            const r2imgs = roomImagesMap[i] ?? [];
            const isSelected = selectedRoom.name === room.name;

            return (
              <div
                key={room.name}
                className={`rounded-[var(--radius-md)] border overflow-hidden transition-all ${
                  isSelected
                    ? "border-[var(--primary)] lg:border-[var(--border-default)]"
                    : "border-[var(--border-default)]"
                }`}
              >
                <RoomImageCarousel
                  images={r2imgs}
                  fallback={room.image}
                  alt={room.name}
                  available={room.available}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-[var(--text-primary)]">{room.name}</h3>
                      <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">{room.beds}</p>
                    </div>
                    {/* Mobile-only select button */}
                    <button
                      type="button"
                      onClick={() => setSelectedRoom(room)}
                      className={`lg:hidden shrink-0 px-3 py-1 rounded-[var(--radius-full)] text-[12px] font-semibold border transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--primary)] text-[var(--text-inverse)] border-[var(--primary)]"
                          : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>

                  {(() => {
                    const displayPrices = roomDisplayPrices[room.name];
                    return displayPrices ? (
                      <div className="mt-2 space-y-0.5">
                        {displayPrices.map((sp) => (
                          <div key={sp.season} className="flex items-center justify-between">
                            <span className="text-[11px] text-[var(--text-tertiary)]">{sp.season}</span>
                            <span className="text-[13px] font-semibold text-[var(--text-primary)] tabular-nums">
                              {formatPrice(sp.price)}
                            </span>
                          </div>
                        ))}
                        <p className="text-[10px] text-[var(--text-tertiary)] pt-0.5">/ night · rates vary by season</p>
                      </div>
                    ) : (
                      <p className="text-[16px] font-bold text-[var(--text-primary)] mt-2 tabular-nums">
                        {formatPrice(room.price)}{" "}
                        <span className="text-[13px] font-normal text-[var(--text-tertiary)]">/ night</span>
                      </p>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile booking bar — shares selectedRoom state with room cards */}
      <HotelMobileBookingBar
        hotel={hotel}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
      />
    </>
  );
}
