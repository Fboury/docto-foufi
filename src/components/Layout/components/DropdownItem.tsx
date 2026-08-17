import { Link } from 'react-router';

// Sous-composant pour les items du menu
export default function DropdownItem({ to, emoji, title, desc, color = 'text-cyan-500' }: any) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white/[0.05]">
      <span className="text-xl">{emoji}</span>
      <div className="flex flex-col">
        <span className={`text-xs font-black tracking-wider uppercase ${color}`}>{title}</span>
        <span className="text-[10px] font-bold tracking-tight text-gray-500">{desc}</span>
      </div>
    </Link>
  );
}
