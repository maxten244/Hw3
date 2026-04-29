import { useEffect, useMemo, useState } from 'react'
import './App.css'

const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80'
const ABOUT_IMAGE_URL = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'

const MENU_ITEMS = [
  { id: 'bruschetta', name: 'Bruschetta', description: 'Toasted bread with tomato, basil & olive oil', price: 9, section: 'Starters', image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?auto=format&fit=crop&w=800&q=80' },
  { id: 'soup-day', name: 'Soup of the Day', description: "Chef's daily selection", price: 8, section: 'Starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80' },
  { id: 'caesar-salad', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, house dressing', price: 12, section: 'Starters', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80' },
  { id: 'grilled-salmon', name: 'Grilled Salmon', description: 'With seasonal vegetables & herb butter', price: 24, section: 'Mains', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80' },
  { id: 'beef-bourguignon', name: 'Beef Bourguignon', description: 'Slow-cooked with red wine & mushrooms', price: 26, section: 'Mains', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80' },
  { id: 'risotto', name: 'Risotto', description: 'Creamy Arborio, seasonal ingredients', price: 20, section: 'Mains', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80' },
  { id: 'roast-chicken', name: 'Roast Chicken', description: 'Half bird, lemon & thyme, gravy', price: 22, section: 'Mains', image: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 'tiramisu', name: 'Tiramisu', description: 'Classic mascarpone & espresso', price: 10, section: 'Desserts & Drinks', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
  { id: 'creme-brulee', name: 'Creme Brulee', description: 'Vanilla bean, caramelized sugar', price: 9, section: 'Desserts & Drinks', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80' },
  { id: 'house-wine', name: 'House Wine', description: 'Red or white, glass', price: 8, section: 'Desserts & Drinks', image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80' },
]

const STORAGE_KEY = 'laTableCart'

function App() {
  const [page, setPage] = useState('home')
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(''), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart])
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.qty * item.price, 0), [cart])

  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((line) => line.id === item.id)
      if (found) {
        return prev.map((line) =>
          line.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }]
    })
    setToast(`${item.name} added to cart`)
  }

  function removeFromCart(itemId) {
    setCart((prev) =>
      prev
        .map((line) => (line.id === itemId ? { ...line, qty: line.qty - 1 } : line))
        .filter((line) => line.qty > 0),
    )
  }

  const groupedMenu = useMemo(() => {
    return MENU_ITEMS.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = []
      acc[item.section].push(item)
      return acc
    }, {})
  }, [])

  return (
    <div className="app-shell bg-dark text-light min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark border-bottom border-secondary-subtle sticky-top nav-bg">
        <div className="container py-1">
          <button className="navbar-brand btn btn-link text-warning text-decoration-none p-0 fw-semibold" onClick={() => setPage('home')}>
            La Table
          </button>
          <div className="d-flex gap-2 flex-wrap">
            {['home', 'menu', 'about', 'contact'].map((tab) => (
              <button
                key={tab}
                className={`btn btn-sm ${page === tab ? 'btn-warning' : 'btn-outline-light'}`}
                onClick={() => setPage(tab)}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button className="btn btn-sm btn-outline-warning" onClick={() => setPage('menu')}>
              Cart ({totalItems})
            </button>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        {page === 'home' && (
          <section className="py-4 py-md-5">
            <div className="hero-image-wrap mb-4">
              <img src={HERO_IMAGE_URL} className="hero-image" alt="Dining room at La Table" />
            </div>
            <div className="text-center">
              <h1 className="display-4 text-warning">La Table</h1>
              <p className="lead text-secondary mb-0">Fresh, seasonal, made with care.</p>
            </div>
          </section>
        )}

        {page === 'menu' && (
          <>
            <section className="mb-5">
              <h2 className="mb-4 text-warning">Our Menu</h2>
              {Object.entries(groupedMenu).map(([sectionName, items]) => (
                <div key={sectionName} className="mb-4">
                  <h3 className="h4">{sectionName}</h3>
                  <div className="row g-3">
                    {items.map((item) => (
                      <div key={item.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 bg-black text-light border-warning-subtle">
                          <img src={item.image} className="menu-item-image" alt={item.name} />
                          <div className="card-body d-flex flex-column">
                            <h4 className="h5">{item.name}</h4>
                            <p className="text-secondary small flex-grow-1">{item.description}</p>
                            <p className="text-warning fw-semibold mb-3">${item.price.toFixed(2)}</p>
                            <button className="btn btn-warning" onClick={() => addToCart(item)}>
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="p-4 rounded-3 cart-panel">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Your Cart</h2>
                <button className="btn btn-sm btn-outline-light" onClick={() => setCart([])}>
                  Clear cart
                </button>
              </div>
              {cart.length === 0 ? (
                <p className="text-secondary mb-0">Your cart is empty.</p>
              ) : (
                <>
                  <div className="list-group mb-3">
                    {cart.map((line) => (
                      <div key={line.id} className="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center gap-3">
                        <div>
                          <div className="fw-semibold">{line.name}</div>
                          <div className="small text-secondary">
                            {line.qty} x ${line.price.toFixed(2)} = ${(line.qty * line.price).toFixed(2)}
                          </div>
                        </div>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => removeFromCart(line.id)}>
                          Remove one
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="h5 mb-0">Total: <span className="text-warning">${totalPrice.toFixed(2)}</span></p>
                </>
              )}
            </section>
          </>
        )}

        {page === 'about' && (
          <section className="py-4">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-md-6">
                <img src={ABOUT_IMAGE_URL} className="about-image" alt="Chef plating a meal in the kitchen" />
              </div>
              <div className="col-12 col-md-6">
                <h2 className="text-warning mb-3">About Us</h2>
                <p className="text-secondary mb-0">
                  La Table is a cozy modern bistro inspired by classic European dining. We source
                  quality ingredients and prepare every dish with care.
                </p>
              </div>
            </div>
          </section>
        )}

        {page === 'contact' && (
          <section className="py-4">
            <h2 className="text-warning mb-3">Contact</h2>
            <p className="text-secondary mb-2">68th ST Lexington, Manhattan</p>
            <p className="text-secondary mb-2">Phone: 3478880575</p>
            <p className="text-secondary">Email: latable@gmail.com</p>
          </section>
        )}
      </main>

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div className="toast show text-bg-dark border border-warning" role="status" aria-live="polite">
            <div className="toast-body">{toast}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
