// Markdown mínimo y seguro (sin HTML): párrafos, títulos, listas, **negrita**, *cursiva*, `código`.
function inline(text, keyBase) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith('**')) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith('`')) out.push(<code key={k} className="kbd">{tok.slice(1, -1)}</code>);
    else out.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text }) {
  const lines = String(text || '').replace(/\r/g, '').split('\n');
  const blocks = [];
  let list = null;
  let para = [];
  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    const ul = line.match(/^\s*[-*•]\s+(.*)$/);
    const ol = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
    if (!line.trim()) {
      flushPara();
      flushList();
    } else if (h) {
      flushPara();
      flushList();
      blocks.push({ type: 'h', text: h[2] });
    } else if (ul || ol) {
      flushPara();
      const type = ul ? 'ul' : 'ol';
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push(ul ? ul[1] : ol[2]);
    } else if (/^\s*[-*_]{3,}\s*$/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: 'hr' });
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return (
    <div className="md">
      {blocks.map((b, i) => {
        if (b.type === 'h') return <h4 key={i}>{inline(b.text, `h${i}`)}</h4>;
        if (b.type === 'hr') return <hr key={i} className="divider" />;
        if (b.type === 'ul')
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{inline(it, `u${i}-${j}`)}</li>
              ))}
            </ul>
          );
        if (b.type === 'ol')
          return (
            <ol key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{inline(it, `o${i}-${j}`)}</li>
              ))}
            </ol>
          );
        return <p key={i}>{inline(b.text, `p${i}`)}</p>;
      })}
    </div>
  );
}
