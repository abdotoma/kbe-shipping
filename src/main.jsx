import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { categories, products } from './products'
import './styles.css'

const formatNumber = (value, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)

const containerTypes = [
  { id: '20gp', label: "20' Standard", capacity: 33.2, payload: 28300 },
  { id: '40gp', label: "40' Standard", capacity: 67.7, payload: 28870 },
  { id: '40hc', label: "40' High Cube", capacity: 76.4, payload: 28690 },
]

const getPackingDefaults = (item) => ({
  unitsPerPallet: item?.packSize ?? 1,
  palletLength: item?.palletLength ?? item?.height ?? 1,
  palletWidth: item?.palletWidth ?? item?.width ?? 1,
  palletHeight: item?.palletHeight ?? item?.depth ?? 1,
  palletWeight: item?.packWeight ?? item?.weight ?? 1,
})

function BoxIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 7.5 8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 7.5v9l8 4 8-4v-9M12 11.5v9" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m8 10 4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CustomCursor() {
  const pointerRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    const pointer = pointerRef.current

    document.documentElement.classList.add('custom-cursor-enabled')

    const onMove = (event) => {
      pointer.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      pointer.classList.add('visible')
    }

    const onPointerOver = (event) => {
      const isInteractive = event.target.closest('a, button, input, select')
      pointer.classList.toggle('active', Boolean(isInteractive))
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onPointerOver)

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onPointerOver)
    }
  }, [])

  return (
    <span ref={pointerRef} className="custom-cursor-pointer" aria-hidden="true" />
  )
}

function MetricCard({ label, value, unit, tone, icon }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span className="metric-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong dir="ltr">{value} <small>{unit}</small></strong>
      </div>
    </article>
  )
}

function App() {
  const initialPacking = getPackingDefaults(products[0])
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? '')
  const [selectedId, setSelectedId] = useState(products[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [shipment, setShipment] = useState([])
  const [unitsPerPallet, setUnitsPerPallet] = useState(initialPacking.unitsPerPallet)
  const [palletLength, setPalletLength] = useState(initialPacking.palletLength)
  const [palletWidth, setPalletWidth] = useState(initialPacking.palletWidth)
  const [palletHeight, setPalletHeight] = useState(initialPacking.palletHeight)
  const [palletWeight, setPalletWeight] = useState(initialPacking.palletWeight)
  const [containerId, setContainerId] = useState('40hc')

  const selected = products.find((product) => product.id === selectedId)
  const filteredProducts = products.filter((item) => item.category === selectedCategory)
  const safeQuantity = Math.max(1, Number(quantity) || 1)

  useEffect(() => {
    const defaults = getPackingDefaults(selected)
    setUnitsPerPallet(defaults.unitsPerPallet)
    setPalletLength(defaults.palletLength)
    setPalletWidth(defaults.palletWidth)
    setPalletHeight(defaults.palletHeight)
    setPalletWeight(defaults.palletWeight)
  }, [selectedId])

  const calculation = useMemo(() => {
    if (!selected) return { unitCbm: 0, totalCbm: 0, totalWeight: 0 }
    const unitCbm = (selected.width * selected.height * selected.depth) / 1_000_000_000
    return {
      unitCbm,
      totalCbm: unitCbm * safeQuantity,
      totalWeight: selected.weight * safeQuantity,
    }
  }, [selected, safeQuantity])

  const packingPlan = useMemo(() => {
    const container = containerTypes.find((item) => item.id === containerId) ?? containerTypes[2]
    const units = Math.max(1, Math.floor(Number(unitsPerPallet) || 1))
    const length = Math.max(1, Number(palletLength) || 1)
    const width = Math.max(1, Number(palletWidth) || 1)
    const height = Math.max(1, Number(palletHeight) || 1)
    const packedWeight = Math.max(0.1, Number(palletWeight) || 0.1)
    const pallets = Math.ceil(safeQuantity / units)
    const palletCbm = (length * width * height) / 1_000_000_000
    const totalPalletCbm = palletCbm * pallets
    const totalPackedWeight = packedWeight * pallets
    const byVolume = Math.ceil(totalPalletCbm / container.capacity)
    const byWeight = Math.ceil(totalPackedWeight / container.payload)
    const byDatasheet = selected?.unitsPer40HC && container.id === '40hc'
      ? Math.ceil(safeQuantity / selected.unitsPer40HC)
      : 0
    const containers = Math.max(1, byVolume, byWeight, byDatasheet)
    const utilization = (totalPalletCbm / (containers * container.capacity)) * 100

    return {
      container,
      units,
      pallets,
      palletCbm,
      totalPalletCbm,
      totalPackedWeight,
      containers,
      utilization,
      byDatasheet,
    }
  }, [containerId, palletHeight, palletLength, palletWeight, palletWidth, safeQuantity, selected, unitsPerPallet])

  const totals = useMemo(
    () => shipment.reduce(
      (sum, row) => ({
        quantity: sum.quantity + row.quantity,
        pallets: sum.pallets + row.pallets,
        cbm: sum.cbm + row.totalCbm,
        weight: sum.weight + row.totalWeight,
      }),
      { quantity: 0, pallets: 0, cbm: 0, weight: 0 },
    ),
    [shipment],
  )

  const addToShipment = () => {
    if (!selected) return
    setShipment((current) => {
      const existing = current.find((row) => row.id === selected.id)
      if (existing) {
        return current.map((row) => {
          if (row.id !== selected.id) return row
          const nextQuantity = row.quantity + safeQuantity
          const nextPallets = Math.ceil(nextQuantity / packingPlan.units)
          return {
            ...row,
            quantity: nextQuantity,
            pallets: nextPallets,
            containers: Math.max(1, Math.ceil((packingPlan.palletCbm * nextPallets) / packingPlan.container.capacity), Math.ceil((Number(palletWeight) * nextPallets) / packingPlan.container.payload)),
            totalCbm: packingPlan.palletCbm * nextPallets,
            totalWeight: Number(palletWeight) * nextPallets,
          }
        })
      }
      return [...current, {
        ...selected,
        quantity: safeQuantity,
        pallets: packingPlan.pallets,
        containers: packingPlan.containers,
        totalCbm: packingPlan.totalPalletCbm,
        totalWeight: packingPlan.totalPackedWeight,
      }]
    })
  }

  return (
    <div className="app-shell">
      <CustomCursor />
      <div className="creator-strip">
        <span>Application created by</span>
        <strong>Abdo Tarris</strong>
      </div>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="KBE Shipping">
          <img src="/kbe-energy-logo.png" alt="KBE Energy" />
          <span><b>SHIPPING</b><small>CBM CALCULATOR</small></span>
        </a>
        <div className="topbar-note">
          <span className="status-dot" />
          Smart shipping calculator
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <p className="eyebrow">Accurate dimensions. Smarter shipping.</p>
          <h1>Calculate your shipment<br /><em>in seconds.</em></h1>
          <p className="hero-copy">Choose a product and quantity to instantly calculate total volume and weight.</p>
          <div className="live-summary" aria-label="Live shipment totals" aria-live="polite">
            <div><span>Total CBM</span><strong>{formatNumber(calculation.totalCbm, 3)}<small>m³</small></strong></div>
            <div><span>Total weight</span><strong>{formatNumber(calculation.totalWeight, 1)}<small>kg</small></strong></div>
            <div><span>Pallets</span><strong>{packingPlan.pallets}</strong></div>
            <div><span>Containers</span><strong>{packingPlan.containers}</strong></div>
            <div><span>Utilization</span><strong>{formatNumber(Math.min(packingPlan.utilization, 999), 1)}<small>%</small></strong></div>
          </div>
          <div className="hero-stats" aria-label="Calculator benefits">
            <span><b>CBM</b> automatic calculation</span>
            <i />
            <span><b>{products.length}</b> product models</span>
            <i />
            <span><b>Smart</b> pallet & container planning</span>
          </div>
        </section>

        <section className="calculator-section">
          <div className="section-heading">
            <div><span>01</span></div>
            <div>
              <h2>Shipping Calculator</h2>
              <p>Select a product and enter the required quantity</p>
            </div>
          </div>

          <div className="calculator-card">
            <div className="form-grid">
              <label className="field category-field">
                <span>Category</span>
                <div className="select-wrap">
                  <select
                    value={selectedCategory}
                    onChange={(event) => {
                      const nextCategory = event.target.value
                      const firstProduct = products.find((item) => item.category === nextCategory)
                      setSelectedCategory(nextCategory)
                      setSelectedId(firstProduct?.id ?? '')
                    }}
                  >
                    {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <ChevronIcon />
                </div>
              </label>
              <label className="field product-field">
                <span>Product</span>
                <div className="select-wrap">
                  <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                    {filteredProducts.map((product) => (
                      <option key={product.id} value={product.id}>{product.name} — {product.sku}</option>
                    ))}
                  </select>
                  <ChevronIcon />
                </div>
              </label>
              <label className="field quantity-field">
                <span>Quantity</span>
                <div className="quantity-control">
                  <button type="button" onClick={() => setQuantity(Math.max(1, safeQuantity - 1))} aria-label="Decrease quantity">−</button>
                  <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                  <button type="button" onClick={() => setQuantity(safeQuantity + 1)} aria-label="Increase quantity">+</button>
                </div>
              </label>
            </div>

            {selected && (
              <div className="product-specs">
                <div><span>Product code</span><b>{selected.sku}</b></div>
                <div><span>Dimensions (W × H × D)</span><b>{selected.width} × {selected.height} × {selected.depth} mm</b>{selected.dimensionNote && <small>{selected.dimensionNote}</small>}</div>
                <div><span>Unit weight</span><b>{formatNumber(selected.weight, 1)} kg</b>{selected.weightNote && <small>{selected.weightNote}</small>}</div>
              </div>
            )}

            <div className="results-title"><span>CALCULATION</span><i /></div>
            <div className="metrics-grid">
              <MetricCard label="Total volume" value={formatNumber(calculation.totalCbm, 3)} unit="m³" tone="red" icon={<BoxIcon />} />
              <MetricCard label="Total weight" value={formatNumber(calculation.totalWeight, 1)} unit="kg" tone="green" icon={<span className="weight-symbol">kg</span>} />
            </div>
            <p className="formula" dir="ltr">
              ({selected?.width} × {selected?.height} × {selected?.depth}) ÷ 1,000,000,000 × {safeQuantity} = {formatNumber(calculation.totalCbm, 3)} m³
            </p>
            <p className="data-note">CBM is calculated from equipment dimensions in the datasheets, not shipping-carton dimensions.</p>

            <section className="logistics-panel" aria-labelledby="packing-title">
              <div className="logistics-heading">
                <div>
                  <span className="logistics-kicker">PALLET & CONTAINER PLAN</span>
                  <h3 id="packing-title">Plan the packed shipment</h3>
                </div>
                <span className="editable-badge">Editable inputs</span>
              </div>

              <div className="packing-grid">
                <label className="field">
                  <span>Units per pallet</span>
                  <input type="number" min="1" value={unitsPerPallet} onChange={(event) => setUnitsPerPallet(event.target.value)} />
                </label>
                <label className="field">
                  <span>Pallet length (mm)</span>
                  <input type="number" min="1" value={palletLength} onChange={(event) => setPalletLength(event.target.value)} />
                </label>
                <label className="field">
                  <span>Pallet width (mm)</span>
                  <input type="number" min="1" value={palletWidth} onChange={(event) => setPalletWidth(event.target.value)} />
                </label>
                <label className="field">
                  <span>Pallet height (mm)</span>
                  <input type="number" min="1" value={palletHeight} onChange={(event) => setPalletHeight(event.target.value)} />
                </label>
                <label className="field">
                  <span>Packed pallet weight (kg)</span>
                  <input type="number" min="0.1" step="0.1" value={palletWeight} onChange={(event) => setPalletWeight(event.target.value)} />
                </label>
                <label className="field">
                  <span>Container type</span>
                  <div className="select-wrap">
                    <select value={containerId} onChange={(event) => setContainerId(event.target.value)}>
                      {containerTypes.map((container) => (
                        <option key={container.id} value={container.id}>{container.label} · {container.capacity} CBM</option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
                </label>
              </div>

              <div className="packing-results">
                <div><span>Required pallets</span><strong>{packingPlan.pallets}</strong></div>
                <div><span>Palletized volume</span><strong>{formatNumber(packingPlan.totalPalletCbm, 3)} <small>m³</small></strong></div>
                <div><span>Packed weight</span><strong>{formatNumber(packingPlan.totalPackedWeight, 0)} <small>kg</small></strong></div>
                <div><span>Containers required</span><strong>{packingPlan.containers}</strong></div>
                <div><span>Volume utilization</span><strong>{formatNumber(Math.min(packingPlan.utilization, 999), 1)}<small>%</small></strong></div>
              </div>

              <div className="container-capacity">
                <span>{packingPlan.container.label}</span>
                <span>{packingPlan.container.capacity} m³ volume</span>
                <span>{formatNumber(packingPlan.container.payload, 0)} kg max payload</span>
                {selected?.unitsPer40HC && containerId === '40hc' && <span>{selected.unitsPer40HC} units / 40' HC per datasheet</span>}
              </div>
              <p className="packing-note">
                {selected?.packSize
                  ? 'Packing quantity and packed weight come from the product datasheet. Pallet height is an editable planning estimate.'
                  : 'No packing specification was supplied for this model. Enter the confirmed pallet dimensions and packed weight before booking.'}
              </p>
            </section>

            <button className="primary-button" type="button" onClick={addToShipment}>
              <span>Add to shipment</span><span>→</span>
            </button>
          </div>
        </section>

        {shipment.length > 0 && (
          <section className="shipment-section">
            <div className="section-heading compact">
              <div><span>02</span></div>
              <div><h2>Shipment Summary</h2><p>{shipment.length} product {shipment.length === 1 ? 'type' : 'types'} added</p></div>
            </div>
            <div className="shipment-card">
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Product</th><th>Quantity</th><th>Pallets</th><th>Packed CBM</th><th>Weight</th><th /></tr></thead>
                  <tbody>
                    {shipment.map((row) => (
                      <tr key={row.id}>
                        <td><b>{row.name}</b><small dir="ltr">{row.sku}</small></td>
                        <td>{row.quantity}</td>
                        <td>{row.pallets}</td>
                        <td dir="ltr">{formatNumber(row.totalCbm, 3)} m³</td>
                        <td dir="ltr">{formatNumber(row.totalWeight, 1)} kg</td>
                        <td><button className="icon-button" type="button" onClick={() => setShipment((items) => items.filter((item) => item.id !== row.id))} aria-label={`Remove ${row.name}`}><TrashIcon /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="shipment-totals">
                <div><span>Total units</span><b>{totals.quantity}</b></div>
                <div><span>Total pallets</span><b>{totals.pallets}</b></div>
                <div><span>Palletized volume</span><b>{formatNumber(totals.cbm, 3)} m³</b></div>
                <div><span>Total weight</span><b>{formatNumber(totals.weight, 1)} kg</b></div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer><span>© {new Date().getFullYear()} KBE Energy</span><span>Faster calculations. Smarter shipping.</span></footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
