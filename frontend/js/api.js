// cliente REST simples com bearer do Firebase
const API = (base = (window?.__env?.API_BASE_URL
  || (location.origin.startsWith('file') ? 'http://localhost:3000' : location.origin))) => {

  const getToken = () => localStorage.getItem('idToken') || '';

  const j = (m, body, headers={}) => ({
    method: m,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: 'Bearer ' + getToken() }),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const go = async (p, opt) => {
    const r = await fetch(base + p, opt);
    let data = null;
    try { data = r.status === 204 ? null : await r.json(); } catch(_) {}
    if (!r.ok) throw new Error(data?.error || r.statusText);
    return data;
  };

  // endpoints usados depois da home (exemplos)
  const me    = () => go('/profile/me', j('GET'));
  const setup = (payload) => go('/profile/setup', j('POST', payload));

  return { me, setup };
};

window.api = API();
