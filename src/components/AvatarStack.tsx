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
          className="w-7 h-7 rounded-full bg-white border-2 border-white shadow-sm hover:scale-130 transition"
          style={{
            marginLeft: index === 0 ? 0 : -7,
            zIndex: 10 - index,
          }}
        />
      ))}

      {remaining > 0 && (
        <div
          className="w-7 h-7 rounded-full shadow-sm bg-gray-100 text-xs flex items-center justify-center border-2 border-white"
          style={{ marginLeft: 2 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
