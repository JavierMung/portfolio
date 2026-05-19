"use client";

export default function Button({ color, onClick }: { color: string, onClick?: () => void }) {
    return (
        <button
            className={`w-3.5 h-3.5 rounded-full hover:brightness-110 transition-all ${color}`}
            onClick={onClick}
            aria-label="Window control button"

        />
    );
}