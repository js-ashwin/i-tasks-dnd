import { getAvatar } from "../utils/avatar";

export default function AvatarStack({ users = [] }: any) {
  const maxVisible = 3;

  const visibleUsers = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <div className="flex items-center">
      {visibleUsers.map((user: string, index: number) => (
        <img
          key={user}
          title={user}
          src={getAvatar(user)}
          alt={user}
          className="w-7 h-7 mb-1 rounded-full bg-white border-2 border-slate-200 shadow-sm hover:scale-110 transition dark:bg-slate-800 dark:border-slate-700"
          style={{
            marginLeft: index === 0 ? 0 : -7,
            zIndex: 10 - index,
          }}
        />
      ))}

      {remaining > 0 && (
        <div
          className="w-5 h-5 mb-1 rounded-full shadow-sm bg-gray-100 text-xs flex items-center justify-center border border-white text-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-800"
          style={{ marginLeft: 2 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
