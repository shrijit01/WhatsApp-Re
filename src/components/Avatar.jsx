const AVATAR_COLORS = [
  '#E17055', '#00B894', '#0984E3', '#6C5CE7',
  '#FDCB6E', '#E84393', '#00CEC9', '#2D3436',
];

export function avatarColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function Avatar({ name, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: avatarColor(name), flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, color: '#fff', userSelect: 'none',
    }}>
      {name[0].toUpperCase()}
    </div>
  );
}
