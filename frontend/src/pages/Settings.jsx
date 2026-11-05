import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead } from '../components/ui';

export default function Settings() {
  const navigate = useNavigate();
  // Load the saved store name (or a default) when the page opens
  const [store, setStore] = useState(localStorage.getItem('stocksplit_store') || 'Mini-Mart Pro');
  const [saved, setSaved] = useState(false);

  // Save the store name in the browser
  const save = (e) => {
    e.preventDefault();
    localStorage.setItem('stocksplit_store', store);
    setSaved(true);
  };

  // Logging out just removes the "logged in" flag
  const logout = () => {
    localStorage.removeItem('stocksplit_auth');
    navigate('/login');
  };

  return (
    <>
      <PageHead title="Settings" sub="Manage your store details." />

      <form className="card" onSubmit={save} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label style={{ display: 'grid', gap: 4, fontWeight: 600 }}>
          Store name
          <input
            value={store}
            onChange={(e) => { setStore(e.target.value); setSaved(false); }}
            style={{ padding: 10, border: '1px solid #e5e9f2', borderRadius: 8, font: 'inherit' }}
          />
        </label>
        <button className="btn btn--primary">Save changes</button>
        {saved && <p className="notice">Saved</p>}
      </form>

      <button className="btn btn--ghost btn--danger" onClick={logout} style={{ width: 'fit-content' }}>
        Log out
      </button>
    </>
  );
}