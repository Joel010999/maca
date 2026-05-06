import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Hammer, PlusCircle, LogOut, 
  Search, ShoppingBag, Edit3, Eye, X,
  Target, Activity, Star, Printer
} from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ventas' | 'herreria'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Persistencia LocalStorage - Llave v1 para inicio limpio
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('maca_orders_v1');
    return saved ? JSON.parse(saved) : [];
  });
  const [blacksmithOrders, setBlacksmithOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('maca_herreria_v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('maca_orders_v1', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('maca_herreria_v1', JSON.stringify(blacksmithOrders)); }, [blacksmithOrders]);

  // Form States - Ventas
  const [vName, setVName] = useState(''); const [vDoc, setVDoc] = useState(''); const [vPhone, setVPhone] = useState(''); const [vEmail, setVEmail] = useState('');
  const [vProv, setVProv] = useState(''); const [vLoc, setVLoc] = useState(''); const [vCP, setVCP] = useState(''); const [vWhatsApp, setVWhatsApp] = useState('');
  const [vProduct, setVProduct] = useState(''); const [vTotal, setVTotal] = useState(''); const [vObs, setVObs] = useState('');

  // Form States - Herrería
  const [hDate, setHDate] = useState(new Date().toISOString().split('T')[0]);
  const [hProduct, setHProduct] = useState('');
  const [hCustomer, setHCustomer] = useState('');
  const [hCost, setHCost] = useState('');
  const [hObs, setHObs] = useState('');

  // Modals States
  const [viewingOrder, setViewingOrder] = useState<any>(null); 
  const [editingOrder, setEditingOrder] = useState<any>(null); 
  const [showHistory, setShowHistory] = useState(false);
  const [editPayment, setEditPayment] = useState('');
  const [editObs, setEditObs] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'malestyle' && password.trim() === 'malestilo') setIsLoggedIn(true);
    else alert('Credenciales incorrectas');
  };

  const handleSaveOrder = () => {
    if (!vName || !vProduct || !vTotal) return alert('Completar Nombre, Producto y Total');
    const total = parseFloat(vTotal);
    const date = new Date();
    const newOrder = {
      id: Date.now().toString(),
      date: date.toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit'}),
      fullDate: date.toISOString(),
      customerName: vName, customerDoc: vDoc, customerPhone: vPhone, customerEmail: vEmail, customerProv: vProv, customerLoc: vLoc, customerCP: vCP, customerWhatsApp: vWhatsApp,
      totalAmount: total, advancePayment: 0, balance: total,
      observations: vObs || 'Sin observaciones',
      status: 'PENDING',
      items: [{ id: Date.now().toString(), productName: vProduct }]
    };
    setOrders(prev => [newOrder, ...prev]);
    setVName(''); setVDoc(''); setVPhone(''); setVEmail(''); setVProv(''); setVLoc(''); setVCP(''); setVWhatsApp(''); setVProduct(''); setVTotal(''); setVObs('');
    alert('Venta guardada ✨');
  };

  const handleSaveBlacksmithOrder = () => {
    if (!hProduct || !hCustomer || !hCost) return alert('Completar campos');
    setBlacksmithOrders(prev => [{ id: Date.now().toString(), date: hDate, product: hProduct, customer: hCustomer, cost: parseFloat(hCost), paid: false, observations: hObs || 'Sin observaciones' }, ...prev]);
    setHProduct(''); setHCustomer(''); setHCost(''); setHObs('');
    alert('Pedido al herrero registrado 🛠️');
  };

  // Cálculos Dashboard
  const totalBilled = orders.reduce((a,b)=>a+(b.totalAmount||0),0);
  const totalPaid = orders.reduce((a,b)=>a+(b.advancePayment||0),0);
  const totalDebt = orders.reduce((a,b)=>a+(b.balance||0),0);
  const totalBlacksmithCost = blacksmithOrders.reduce((a,b)=>a+(b.cost||0),0);
  const blacksmithPaid = blacksmithOrders.reduce((a,b)=>a+(b.paid?b.cost:0),0);
  const estimatedProfit = totalPaid - blacksmithPaid;
  const avgTicket = orders.length > 0 ? totalBilled / orders.length : 0;
  const collectionHealth = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;

  const monthlyHistory = orders.reduce((acc: any, order) => {
    const d = order.fullDate ? new Date(order.fullDate) : new Date();
    const key = d.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
    acc[key] = (acc[key] || 0) + (order.totalAmount || 0);
    return acc;
  }, {});

  const productRanking = orders.reduce((acc: any, order) => {
    const pName = order.items?.[0]?.productName || 'Varios';
    acc[pName] = (acc[pName] || 0) + 1;
    return acc;
  }, {});

  const inputStyle: React.CSSProperties = { width:'100%', padding:'10px 14px', borderRadius:'12px', border:'1px solid #eee', background:'rgba(255,255,255,0.7)', outline:'none', fontSize:'13px' };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: '#f8f8f8' }}>
        <div className="animated-bg" />
        <div className="glass" style={{ maxWidth: 400, width: '100%', padding: 48, borderRadius: 40, zIndex: 10 }}>
          <h1 style={{ textAlign: 'center', marginBottom: 32, fontFamily: 'Playfair Display' }}>Male Style</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" style={inputStyle} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" style={inputStyle} />
            <button type="submit" style={{ padding: 18, borderRadius: 16, background: '#E6007E', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', background: '#f8f8f8' }}>
      <div className="animated-bg no-print" />
      
      {/* Sidebar */}
      <nav className="glass no-print" style={{ width: 260, margin: 20, borderRadius: 32, padding: 30, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
        <h2 style={{ marginBottom: 48, fontFamily: 'Playfair Display' }}>Male Style</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1 }}>
          {[{id:'dashboard', icon:LayoutDashboard}, {id:'ventas', icon:ShoppingBag}, {id:'herreria', icon:Hammer}].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{ display:'flex', alignItems:'center', gap:12, padding:15, borderRadius:16, border:'none', background:activeTab === t.id ? '#E6007E' : 'transparent', color:activeTab === t.id ? 'white' : '#777', cursor:'pointer', fontWeight:'bold' }}><t.icon size={20}/> {t.id}</button>
          ))}
        </div>
        <button onClick={() => setIsLoggedIn(false)} style={{ display:'flex', alignItems:'center', gap:12, padding:15, color:'#ff4d4d', background:'none', border:'none', cursor:'pointer', fontWeight:'bold', marginTop: 'auto' }}><LogOut size={20}/> Salir</button>
      </nav>

      {/* Main Content */}
      <main className="no-print" style={{ flexGrow: 1, padding: 40, zIndex: 10, overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <h3 style={{ fontSize: 36, fontFamily: 'Playfair Display', textTransform: 'capitalize' }}>{activeTab}</h3>
          <div className="glass" style={{ padding: '12px 24px', borderRadius: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Search size={18} color="#999"/><input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', background: 'none', outline: 'none', width: 200 }} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                <div className="glass" style={{ padding: 25, borderRadius: 24, cursor: 'pointer' }} onClick={() => setShowHistory(true)}>
                  <p style={{ fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 8 }}>FACTURACIÓN TOTAL</p>
                  <p style={{ fontSize: 26, fontWeight: 'bold' }}>${totalBilled.toLocaleString()}</p>
                  <p style={{ fontSize: 9, color: '#E6007E', marginTop: 6, fontWeight:'bold' }}>HISTORIAL MENSUAL →</p>
                </div>
                <div className="glass" style={{ padding: 25, borderRadius: 24, borderLeft: '5px solid #E6007E' }}>
                  <p style={{ fontSize: 10, fontWeight: 'bold', color: '#E6007E', marginBottom: 8 }}>DEUDA CLIENTES</p>
                  <p style={{ fontSize: 26, fontWeight: 'bold', color: '#E6007E' }}>${totalDebt.toLocaleString()}</p>
                  <div style={{ width: '100%', height: 4, background: '#eee', marginTop: 12, borderRadius: 2 }}><div style={{ width: `${Math.max(0, 100 - collectionHealth)}%`, height: '100%', background: '#E6007E', borderRadius: 2 }} /></div>
                </div>
                <div className="glass" style={{ padding: 25, borderRadius: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 8 }}>TICKET PROMEDIO</p>
                  <p style={{ fontSize: 26, fontWeight: 'bold' }}>${avgTicket.toLocaleString()}</p>
                </div>
                <div className="glass" style={{ padding: 25, borderRadius: 24, borderLeft: '5px solid #ef4444' }}>
                  <p style={{ fontSize: 10, fontWeight: 'bold', color: '#ef4444', marginBottom: 8 }}>DEUDA HERRERO</p>
                  <p style={{ fontSize: 26, fontWeight: 'bold', color: '#ef4444' }}>${(totalBlacksmithCost - blacksmithPaid).toLocaleString()}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 30 }}>
                <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                  <h4 style={{ marginBottom: 28, fontSize: 18, display:'flex', alignItems:'center', gap:10 }}><Activity size={20} color="#E6007E"/> Actividad Reciente</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div><p style={{ fontSize: 14, fontWeight: 'bold' }}>{o.customerName}</p><p style={{ fontSize: 11, color: '#999' }}>{o.items[0].productName}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontSize: 14, fontWeight: 'bold' }}>${o.totalAmount.toLocaleString()}</p><p style={{ fontSize: 10, color: o.balance > 0 ? '#E6007E' : '#10b981', fontWeight:'bold' }}>{o.balance > 0 ? 'Con Deuda' : 'Saldado'}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass" style={{ padding: 32, borderRadius: 28, background: 'linear-gradient(135deg, #E6007E 0%, #FF4DB2 100%)', color: 'white' }}>
                  <h4 style={{ marginBottom: 24, fontSize: 18, display:'flex', alignItems:'center', gap:10 }}><Target size={20}/> Salud del Negocio</h4>
                  <p style={{ fontSize: 12, opacity: 0.8 }}>Cobrado vs. Facturado</p>
                  <p style={{ fontSize: 36, fontWeight: 'bold', margin: '8px 0' }}>{collectionHealth.toFixed(1)}%</p>
                  <div style={{ padding: 18, background: 'rgba(255,255,255,0.2)', borderRadius: 20, marginTop: 24 }}>
                    <p style={{ fontSize: 12, fontWeight: 'bold' }}>Ganancia Estimada*</p>
                    <p style={{ fontSize: 24, fontWeight: 'bold' }}>${estimatedProfit.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                <h4 style={{ marginBottom: 20, fontSize: 16, display:'flex', alignItems:'center', gap:10 }}><Star size={18} color="#f59e0b"/> Ranking de Estructuras</h4>
                <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 10 }}>
                  {Object.entries(productRanking).map(([name, count]: any) => (
                    <div key={name} style={{ minWidth: 160, padding: 20, borderRadius: 20, background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                      <p style={{ fontSize: 12, fontWeight: 'bold' }}>{name}</p>
                      <p style={{ fontSize: 20, fontWeight: 'bold', color: '#E6007E' }}>{count} <span style={{ fontSize: 10, color: '#999', fontWeight: 'normal' }}>pedidos</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ventas' && (
            <motion.div key="ventas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 28, height: 'fit-content' }}>
                <h4 style={{ marginBottom: 24, fontSize: 18, display:'flex', alignItems:'center', gap:10 }}><PlusCircle color="#E6007E"/> Cargar Venta</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input style={inputStyle} placeholder="Nombre y Apellido" value={vName} onChange={e => setVName(e.target.value)} />
                  <input style={inputStyle} placeholder="WhatsApp" value={vWhatsApp} onChange={e => setVWhatsApp(e.target.value)} />
                  <input style={inputStyle} placeholder="Producto" value={vProduct} onChange={e => setVProduct(e.target.value)} />
                  <input style={inputStyle} type="number" placeholder="Total $" value={vTotal} onChange={e => setVTotal(e.target.value)} />
                  <p style={{ fontSize: 10, fontWeight:'bold', color:'#999', marginTop:8 }}>DATOS DE DESPACHO</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <input style={inputStyle} placeholder="DNI" value={vDoc} onChange={e => setVDoc(e.target.value)} />
                    <input style={inputStyle} placeholder="Teléfono" value={vPhone} onChange={e => setVPhone(e.target.value)} />
                  </div>
                  <input style={inputStyle} placeholder="Email" value={vEmail} onChange={e => setVEmail(e.target.value)} />
                  <input style={inputStyle} placeholder="Provincia" value={vProv} onChange={e => setVProv(e.target.value)} />
                  <input style={inputStyle} placeholder="Localidad" value={vLoc} onChange={e => setVLoc(e.target.value)} />
                  <input style={inputStyle} placeholder="C.P." value={vCP} onChange={e => setVCP(e.target.value)} />
                  <textarea style={{ ...inputStyle, height: 60, resize: 'none' }} placeholder="Observaciones..." value={vObs} onChange={e => setVObs(e.target.value)} />
                  <button onClick={handleSaveOrder} style={{ padding: 18, borderRadius: 16, background: '#E6007E', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: 10 }}>Guardar Venta</button>
                </div>
              </div>
              <div className="glass" style={{ borderRadius: 28, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(0,0,0,0.03)', fontSize: 11, textTransform: 'uppercase', color: '#999' }}>
                    <tr><th style={{ padding: 20, textAlign: 'left' }}>Cliente</th><th style={{ padding: 20 }}>Deuda</th><th style={{ padding: 20, textAlign: 'right' }}>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => setViewingOrder(o)}>
                        <td style={{ padding: 20 }}><b>{o.customerName}</b><br/><span style={{fontSize:11, color:'#999'}}>{o.items?.[0]?.productName}</span></td>
                        <td style={{ padding: 20, textAlign: 'center' }}><span style={{ color: o.balance > 0 ? '#E6007E' : '#10b981', fontWeight: 'bold' }}>${o.balance.toLocaleString()}</span></td>
                        <td style={{ padding: 20, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={(e) => { e.stopPropagation(); setViewingOrder(o); }} style={{ padding: 10, borderRadius: 12, background: '#f5f5f5', border: 'none' }}><Eye size={16}/></button>
                            <button onClick={(e) => { e.stopPropagation(); setEditingOrder(o); setEditPayment(o.advancePayment); setEditObs(o.observations); }} style={{ padding: 10, borderRadius: 12, background: '#f5f5f5', border: 'none' }}><Edit3 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── HERRERÍA ── */}
          {activeTab === 'herreria' && (
            <motion.div key="herreria" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 28, height: 'fit-content' }}>
                <h4 style={{ marginBottom: 24, fontSize: 18, display:'flex', alignItems:'center', gap:10 }}><Hammer color="#f59e0b"/> Pedido Herrero</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <input style={inputStyle} type="date" value={hDate} onChange={e => setHDate(e.target.value)} />
                  <input style={inputStyle} placeholder="Estructura" value={hProduct} onChange={e => setHProduct(e.target.value)} />
                  <input style={inputStyle} placeholder="Cliente" value={hCustomer} onChange={e => setHCustomer(e.target.value)} />
                  <input style={inputStyle} type="number" placeholder="Costo $" value={hCost} onChange={e => setHCost(e.target.value)} />
                  <textarea style={{ ...inputStyle, height: 80, resize: 'none' }} placeholder="Observaciones..." value={hObs} onChange={e => setHObs(e.target.value)} />
                  <button onClick={handleSaveBlacksmithOrder} style={{ padding: 18, borderRadius: 16, background: '#f59e0b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Encargar</button>
                </div>
              </div>
              <div className="glass" style={{ borderRadius: 28, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(0,0,0,0.03)', fontSize: 11, textTransform: 'uppercase', color: '#999' }}>
                    <tr><th style={{ padding: 20, textAlign: 'left' }}>Cliente</th><th style={{ padding: 20 }}>Estructura</th><th style={{ padding: 20, textAlign: 'right' }}>Estado</th></tr>
                  </thead>
                  <tbody>
                    {blacksmithOrders.filter(bo => bo.customer?.toLowerCase().includes(searchTerm.toLowerCase())).map(bo => (
                      <tr key={bo.id} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => setViewingOrder({...bo, type: 'herreria'})}>
                        <td style={{ padding: 20 }}><b>{bo.customer}</b><br/><span style={{fontSize:11, color:'#999'}}>${bo.cost.toLocaleString()}</span></td>
                        <td style={{ padding: 20 }}>{bo.product}</td>
                        <td style={{ padding: 20, textAlign: 'right' }}>
                          <div style={{display:'flex', gap:10, justifyContent:'flex-end'}}>
                            <button onClick={(e) => { e.stopPropagation(); setViewingOrder({...bo, type: 'herreria'}); }} style={{ padding: 10, borderRadius: 12, background: '#f5f5f5', border: 'none' }}><Eye size={16}/></button>
                            <button onClick={(e) => { e.stopPropagation(); setBlacksmithOrders(prev => prev.map(x => x.id === bo.id ? {...x, paid: !x.paid} : x))} } style={{ padding: '8px 16px', borderRadius: 10, background: bo.paid ? '#10b981' : '#f59e0b', color: 'white', border: 'none', fontSize: 10, fontWeight: 'bold', cursor:'pointer' }}>{bo.paid ? 'PAGADO' : 'PENDIENTE'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── ETIQUETA DE DESPACHO ── */}
      {viewingOrder && viewingOrder.customerName && (
        <div className="print-only" style={{ padding: '30px', border: '2px solid #000', width: '9cm', minHeight: '12cm', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
          <h2 style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>MALE STYLE</h2>
          <p style={{ fontSize: '10px', fontWeight: 'bold' }}>DESTINATARIO:</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{viewingOrder.customerName}</p>
          <p style={{ fontSize: '12px' }}>DNI: {viewingOrder.customerDoc || 'N/A'}</p>
          <hr/>
          <p style={{ fontSize: '10px', fontWeight: 'bold' }}>CONTACTO:</p>
          <p style={{ fontSize: '14px' }}>TEL: {viewingOrder.customerPhone || viewingOrder.customerWhatsApp}</p>
          <p style={{ fontSize: '12px' }}>MAIL: {viewingOrder.customerEmail || 'N/A'}</p>
          <hr/>
          <p style={{ fontSize: '10px', fontWeight: 'bold' }}>DIRECCIÓN:</p>
          <p style={{ fontSize: '16px' }}>{viewingOrder.customerLoc}, {viewingOrder.customerProv}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', border:'1px solid #000', padding:'15px', textAlign:'center', marginTop:15 }}>C.P.: {viewingOrder.customerCP}</p>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {viewingOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} className="no-print" onClick={() => setViewingOrder(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: 40, borderRadius: 32, width: 600 }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h4 style={{ fontSize: 24, fontFamily: 'Playfair Display' }}>Detalle de Orden</h4>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => window.print()} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:12, background:'#E6007E', color:'white', border:'none', cursor:'pointer', fontWeight:'bold' }}><Printer size={16}/> Imprimir Etiqueta</button>
                  <button onClick={() => setViewingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24}/></button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight:'bold', color:'#E6007E', marginBottom:10 }}>PEDIDO</p>
                  <p style={{ fontSize: 14 }}><b>Cliente:</b> {viewingOrder.customerName || viewingOrder.customer}</p>
                  <p style={{ fontSize: 14 }}><b>Producto:</b> {viewingOrder.product || viewingOrder.items?.[0]?.productName}</p>
                  <p style={{ fontSize: 14 }}><b>Monto:</b> ${ (viewingOrder.totalAmount || viewingOrder.cost).toLocaleString() }</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight:'bold', color:'#999', marginBottom:10 }}>DESPACHO</p>
                  <p style={{ fontSize: 14 }}><b>DNI:</b> {viewingOrder.customerDoc || 'N/A'}</p>
                  <p style={{ fontSize: 14 }}><b>Mail:</b> {viewingOrder.customerEmail || 'N/A'}</p>
                  <p style={{ fontSize: 14 }}><b>CP:</b> {viewingOrder.customerCP || 'N/A'}</p>
                </div>
              </div>
              <div style={{ marginTop: 24, padding: 20, background: 'rgba(255,255,255,0.5)', borderRadius: 20, border: '1px solid #eee' }}>
                <p style={{ fontSize: 10, color: '#999', fontWeight: 'bold' }}>OBSERVACIONES:</p>
                <p style={{ fontSize: 13 }}>{viewingOrder.observations || 'Sin observaciones'}</p>
              </div>
            </motion.div>
          </div>
        )}
        {showHistory && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowHistory(false)}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass" style={{ padding: 48, borderRadius: 32, width: 450 }} onClick={e => e.stopPropagation()}>
              <h4 style={{ fontSize: 24, fontFamily: 'Playfair Display', marginBottom: 30 }}>Historial Mensual</h4>
              {Object.entries(monthlyHistory).map(([month, total]: any) => (
                <div key={month} style={{ display: 'flex', justifyContent: 'space-between', padding: 20, background: 'white', borderRadius: 20, marginBottom: 10 }}>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{month}</span>
                  <span style={{ fontWeight: 'bold', color: '#E6007E' }}>${total.toLocaleString()}</span>
                </div>
              ))}
            </motion.div>
          </div>
        )}
        {editingOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div className="glass" style={{ padding: 48, borderRadius: 32, width: 420 }}>
              <h4 style={{ marginBottom: 24, fontSize: 22, fontFamily:'Playfair Display' }}>Actualizar Pago</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <input type="number" style={inputStyle} value={editPayment} onChange={e => setEditPayment(e.target.value)} placeholder="Monto Pagado" />
                <textarea style={{ ...inputStyle, height: 80, resize:'none' }} value={editObs} onChange={e => setEditObs(e.target.value)} placeholder="Nuevas observaciones..." />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => { 
                     const paid = parseFloat(editPayment) || 0;
                     setOrders(prev => prev.map(o => o.id === editingOrder.id ? { ...o, advancePayment: paid, balance: o.totalAmount - paid, observations: editObs } : o));
                     setEditingOrder(null);
                  }} style={{ flex: 1, padding: 16, borderRadius: 14, background: '#10b981', color: 'white', border: 'none', fontWeight: 'bold' }}>Guardar</button>
                  <button onClick={() => setEditingOrder(null)} style={{ flex: 1, padding: 16, borderRadius: 14, background: '#f5f5f5', border: 'none' }}>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } body { background: white !important; } }
        .print-only { display: none; }
      `}</style>
    </div>
  );
}

export default App;
