import React from 'react';
import { Bell, Menu, Settings } from 'lucide-react';
import useStore from '../../store/useStore';
import { getAvatarEmoji } from '../../utils/avatars';

const Navbar = ({ onToggleSidebar }) => {
  const store = useStore();
  const username = store.user?.username || 'Adventurer';
  const avatarEmoji = getAvatarEmoji(store.user?.avatar);

  const notifications = store.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header
      className="glass sticky top-0 z-30 flex items-center justify-between px-6 border-b border-[rgba(248,250,252,0.06)]"
      style={{ height: 70, minHeight: 70 }}
    >
      {/* Left: Mobile hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center: Welcome message */}
      <div className="hidden sm:flex flex-col items-center flex-1">
        <h2 className="text-white text-sm font-semibold">
          Welcome back, {username}!
        </h2>
        <p className="text-gray-400 text-xs">{dateString}</p>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors hidden sm:block">
          <Settings size={20} />
        </button>

        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg cursor-pointer hover:bg-white/15 transition-colors">
          {avatarEmoji}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
