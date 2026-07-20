const { useState, useEffect } = React;

// --- Data & Constants ---

const INDUSTRIES = [
    { name: "Apex Electronics", type: "Consumer Electronics", product: "Smartphones", demand: "Highly Volatile (Tech trends change fast)" },
    { name: "Verde Threads", type: "Fast Fashion", product: "Trendy Apparel", demand: "Seasonal & Fast-paced" },
    { name: "Vitality Med", type: "Healthcare", product: "Surgical Instruments", demand: "Steady & Critical" },
    { name: "PureBite", type: "Food & Beverage", product: "Organic Snacks", demand: "Stable but Perishable" }
];

// Metrics baseline (50 is neutral, higher is always "better" for the player)
const BASE_METRICS = {
    cost: 50,
    speed: 50,
    risk: 50,
    satisfaction: 50,
    sustainability: 50
};

const STEPS = [
    {
        id: 'suppliers',
        title: 'Phase 1: Sourcing & Suppliers',
        concept: 'Where do your raw materials come from?',
        explanation: 'A supply chain begins with raw materials (like microchips, fabric, or organic crops). Sourcing defines who you buy these from.',
        options: [
            { 
                id: 'single', 
                label: 'Single Mega-Supplier', 
                desc: 'Buy everything from one massive vendor in one location to secure bulk discounts.', 
                tradeoff: 'By putting all your eggs in one basket, you achieved massive cost savings! However, if this supplier faces a strike or a natural disaster, your entire business halts. Your supply chain is lean, but fragile.',
                impact: { cost: 20, speed: 10, risk: -25, satisfaction: 0, sustainability: -5 }
            },
            { 
                id: 'multiple', 
                label: 'Multiple Diverse Suppliers', 
                desc: 'Spread orders across 3-4 smaller suppliers in different regions.', 
                tradeoff: 'You sacrificed bulk discounts and increased management complexity. But in return, you bought peace of mind. If one supplier fails, the others keep you afloat. Your business is highly resilient.',
                impact: { cost: -15, speed: -5, risk: 25, satisfaction: 5, sustainability: 5 }
            }
        ]
    },
    {
        id: 'factory',
        title: 'Phase 2: Manufacturing Location',
        concept: 'Where will you build your products?',
        explanation: 'Manufacturing is where raw materials become finished goods. The location drastically impacts labor costs, shipping times, and carbon emissions.',
        options: [
            { 
                id: 'offshore', 
                label: 'Offshore (Overseas)', 
                desc: 'Build in a distant country with significantly lower labor and operational costs.', 
                tradeoff: 'Your production costs plummeted, giving you great profit margins. But now your products must cross an ocean to reach customers, increasing lead times, carbon footprint, and vulnerability to global shipping crises.',
                impact: { cost: 25, speed: -20, risk: -15, satisfaction: -5, sustainability: -15 }
            },
            { 
                id: 'nearshore', 
                label: 'Local / Domestic', 
                desc: 'Build close to your main customer base, despite higher labor wages.', 
                tradeoff: 'Your manufacturing costs are steep, eating into profits. However, your delivery times are lightning fast, carbon emissions are low, and you are immune to international trade disputes. Customers love the "locally made" speed.',
                impact: { cost: -25, speed: 25, risk: 15, satisfaction: 15, sustainability: 20 }
            }
        ]
    },
    {
        id: 'warehouse',
        title: 'Phase 3: Warehousing Strategy',
        concept: 'How will you store your finished goods?',
        explanation: 'Before reaching the customer, products wait in distribution centers. The number and location of these centers dictate how fast you can fulfill local orders.',
        options: [
            { 
                id: 'centralized', 
                label: 'One Central Mega-Hub', 
                desc: 'Store all inventory in one massive, highly optimized facility.', 
                tradeoff: 'You saved a fortune on real estate and facility management. But fulfilling an order to the opposite side of the country takes days. You are efficient, but slow to respond to local demand spikes.',
                impact: { cost: 15, speed: -15, risk: -10, satisfaction: -10, sustainability: 5 }
            },
            { 
                id: 'decentralized', 
                label: 'Decentralized Network', 
                desc: 'Operate multiple smaller warehouses spread across all target regions.', 
                tradeoff: 'Paying for multiple buildings and staff is very expensive. However, you can now offer "Next-Day Delivery" almost anywhere because the product is always stored close to the buyer. Customer satisfaction skyrockets.',
                impact: { cost: -20, speed: 20, risk: 15, satisfaction: 25, sustainability: -5 }
            }
        ]
    },
    {
        id: 'transport',
        title: 'Phase 4: Primary Transportation',
        concept: 'How do goods move between factories and warehouses?',
        explanation: 'Logistics is the physical movement of goods. You must balance the speed of delivery against the sheer cost and environmental impact of the vehicle.',
        options: [
            { 
                id: 'air', 
                label: 'Air Freight', 
                desc: 'Fly products via cargo planes for maximum velocity.', 
                tradeoff: 'Your products arrive in hours rather than weeks. Perfect for high-value or perishable goods. But air freight is exorbitantly expensive and has a massive carbon footprint, destroying your sustainability score.',
                impact: { cost: -30, speed: 30, risk: 5, satisfaction: 15, sustainability: -30 }
            },
            { 
                id: 'sea', 
                label: 'Ocean Freight', 
                desc: 'Ship goods via massive container vessels.', 
                tradeoff: 'You are moving thousands of units for pennies on the dollar. It is the most cost-effective and greenest way to move heavy freight. But it takes 3-6 weeks, requiring immense patience and planning.',
                impact: { cost: 20, speed: -25, risk: -10, satisfaction: -10, sustainability: 20 }
            },
            {
                id: 'road',
                label: 'Trucking Fleet',
                desc: 'Use regional trucking networks for a middle-ground approach.',
                tradeoff: 'A balanced approach. Trucks are flexible and moderately priced, offering decent speed. However, they are susceptible to traffic, weather, and fuel price spikes.',
                impact: { cost: 0, speed: 5, risk: 5, satisfaction: 5, sustainability: -5 }
            }
        ]
    },
    {
        id: 'inventory',
        title: 'Phase 5: Inventory Management',
        concept: 'How much extra stock do you keep on hand?',
        explanation: 'Inventory ties up your cash. Keeping too little means you might run out if demand spikes. Keeping too much means paying for storage and risking unsold obsolete products.',
        options: [
            { 
                id: 'lean', 
                label: 'Lean (Just-In-Time)', 
                desc: 'Order exactly what you need, exactly when you need it. No excess stock.', 
                tradeoff: 'Your cash flow is incredibly healthy because money isn\'t trapped in unsold boxes on shelves! But you have zero margin for error. A minor delay in shipping means immediate stockouts and angry customers.',
                impact: { cost: 20, speed: 0, risk: -25, satisfaction: -10, sustainability: 10 }
            },
            { 
                id: 'buffer', 
                label: 'High Buffer (Just-In-Case)', 
                desc: 'Keep 3 months of extra safety stock in the warehouses at all times.', 
                tradeoff: 'You are paying a massive premium to store products "just in case". But when a crisis hits or a viral trend causes a demand spike, you are the only company that still has items in stock. Your resilience is legendary.',
                impact: { cost: -25, speed: 5, risk: 25, satisfaction: 15, sustainability: -10 }
            }
        ]
    }
];

// --- Helper Components ---

const ProgressBar = ({ label, value, icon }) => {
    const clamp = (val) => Math.max(0, Math.min(100, val));
    const safeValue = clamp(value);
    
    let color = 'var(--metric-good)';
    if (safeValue < 40) color = 'var(--metric-poor)';
    else if (safeValue < 70) color = 'var(--metric-fair)';

    return (
        <div className="metric-row">
            <div className="metric-header">
                <span>{icon} {label}</span>
                <span>{safeValue}%</span>
            </div>
            <div className="progress-track">
                <div 
                    className="progress-fill" 
                    style={{ width: `${safeValue}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};

const MetricsPanel = ({ metrics }) => {
    return (
        <div className="card metrics-panel fade-enter">
            <h3>Live Business Metrics</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                How your decisions impact the company in real-time.
            </p>
            
            <ProgressBar label="Cost Efficiency" value={metrics.cost} icon="💰" />
            <ProgressBar label="Delivery Speed" value={metrics.speed} icon="⚡" />
            <ProgressBar label="Resilience (Risk)" value={metrics.risk} icon="🛡️" />
            <ProgressBar label="Customer Happiness" value={metrics.satisfaction} icon="😊" />
            <ProgressBar label="Sustainability" value={metrics.sustainability} icon="🌍" />
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [gameState, setGameState] = useState('start');
    const [scenario, setScenario] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [metrics, setMetrics] = useState(BASE_METRICS);
    const [history, setHistory] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const generateScenario = () => {
        const randomInd = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
        setScenario(randomInd);
        setGameState('scenario');
        setMetrics(BASE_METRICS);
        setHistory([]);
        setCurrentStepIndex(0);
        setSelectedOption(null);
    };

    const startGame = () => {
        setGameState('building');
    };

    const handleSelectOption = (option) => {
        setSelectedOption(option);
    };

    const confirmChoice = () => {
        setMetrics(prev => ({
            cost: prev.cost + selectedOption.impact.cost,
            speed: prev.speed + selectedOption.impact.speed,
            risk: prev.risk + selectedOption.impact.risk,
            satisfaction: prev.satisfaction + selectedOption.impact.satisfaction,
            sustainability: prev.sustainability + selectedOption.impact.sustainability
        }));

        setHistory([...history, { step: STEPS[currentStepIndex].id, choice: selectedOption }]);
        
        if (currentStepIndex < STEPS.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
            setSelectedOption(null);
        } else {
            setTimeout(() => setGameState('results'), 800);
        }
    };

    if (gameState === 'start') {
        return (
            <div className="container center-screen">
                <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Supply Chain Builder</h1>
                <p style={{ maxWidth: '600px', fontSize: '1.2rem' }}>
                    A supply chain is the invisible network that brings a product from a raw material all the way to your front door. 
                    <br/><br/>
                    Every decision involves a trade-off. Can you balance cost, speed, and risk to build a world-class operation?
                </p>
                <button className="btn" onClick={generateScenario} style={{ fontSize: '1.2rem', padding: '1rem 3rem', marginTop: '2rem' }}>
                    Start Simulation
                </button>
            </div>
        );
    }

    if (gameState === 'scenario') {
        return (
            <div className="container center-screen fade-enter">
                <span className="badge">New Client Acquired</span>
                <h1 style={{ fontSize: '2.5rem' }}>{scenario.name}</h1>
                
                <div className="card" style={{ maxWidth: '500px', width: '100%', margin: '2rem 0', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Industry:</strong> <span style={{ color: 'var(--primary-color)' }}>{scenario.type}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Core Product:</strong> <span style={{ color: 'var(--primary-color)' }}>{scenario.product}</span>
                    </div>
                    <div>
                        <strong>Market Demand:</strong> <span style={{ color: 'var(--primary-color)' }}>{scenario.demand}</span>
                    </div>
                </div>

                <p style={{ maxWidth: '600px' }}>
                    You have been hired as the Chief Supply Chain Officer. You must design their entire physical network from scratch. 
                    Pay close attention to your live metrics!
                </p>

                <button className="btn accent" onClick={startGame}>
                    Enter Command Center
                </button>
            </div>
        );
    }

    if (gameState === 'results') {
        const clamp = (val) => Math.max(0, Math.min(100, val));
        const finalCost = clamp(metrics.cost);
        const finalSpeed = clamp(metrics.speed);
        const finalRisk = clamp(metrics.risk);
        const finalSat = clamp(metrics.satisfaction);
        const finalSust = clamp(metrics.sustainability);

        const avgScore = Math.round((finalCost + finalSpeed + finalRisk + finalSat + finalSust) / 5);
        
        const allMetrics = [
            { name: 'Cost Efficiency', val: finalCost },
            { name: 'Delivery Speed', val: finalSpeed },
            { name: 'Resilience & Risk', val: finalRisk },
            { name: 'Customer Satisfaction', val: finalSat },
            { name: 'Sustainability', val: finalSust }
        ];
        
        const strengths = allMetrics.filter(m => m.val >= 65).map(m => m.name);
        const weaknesses = allMetrics.filter(m => m.val < 50).map(m => m.name);
        
        const lowest = allMetrics.reduce((prev, curr) => prev.val < curr.val ? prev : curr);

        return (
            <div className="container fade-enter" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1>Supply Chain Analysis</h1>
                    <p>Here is the final performance report for {scenario.name}.</p>
                </div>

                <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Overall Network Health</h3>
                        <div className="score-circle" style={{ '--score-pct': `${avgScore}%`, marginTop: '2rem' }}>
                            <div className="score-content">
                                <div className="score-value">{avgScore}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>out of 100</div>
                            </div>
                        </div>
                        <p>
                            {avgScore >= 80 ? "Exceptional! A world-class supply chain." : 
                             avgScore >= 60 ? "Solid foundation, but with clear vulnerabilities." : 
                             "Critical issues detected. This supply chain is highly unstable."}
                        </p>
                    </div>

                    <div className="card">
                        <h3>Final Metrics</h3>
                        <div style={{ marginTop: '1.5rem' }}>
                            <ProgressBar label="Cost Efficiency" value={finalCost} icon="💰" />
                            <ProgressBar label="Delivery Speed" value={finalSpeed} icon="⚡" />
                            <ProgressBar label="Resilience (Risk)" value={finalRisk} icon="🛡️" />
                            <ProgressBar label="Customer Happiness" value={finalSat} icon="😊" />
                            <ProgressBar label="Sustainability" value={finalSust} icon="🌍" />
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="card">
                        <h3 style={{ color: 'var(--metric-good)' }}>Strategic Strengths</h3>
                        {strengths.length > 0 ? (
                            <ul className="styled-list">
                                {strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        ) : (
                            <p>Your network is struggling across the board. No clear competitive advantage established.</p>
                        )}
                    </div>

                    <div className="card">
                        <h3 style={{ color: 'var(--metric-poor)' }}>Critical Vulnerabilities</h3>
                        {weaknesses.length > 0 ? (
                            <ul className="styled-list">
                                {weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        ) : (
                            <p>Your network is incredibly balanced! No glaring weaknesses detected.</p>
                        )}
                        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                            <strong>Biggest Risk Factor:</strong> {lowest.name} ({lowest.val}/100)
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ color: 'var(--primary-color)' }}>Consultant Recommendations</h3>
                        <ul className="styled-list">
                            {finalRisk < 50 && <li><strong>Diversify:</strong> Your resilience is low. Consider adding backup suppliers to prevent catastrophic shutdowns.</li>}
                            {finalCost < 50 && <li><strong>Trim Fat:</strong> Costs are spiraling. Look into ocean freight or centralized warehousing to recover margins.</li>}
                            {finalSpeed < 50 && <li><strong>Move Closer:</strong> Lead times are too slow. Try nearshoring production or decentralizing warehouses to get closer to the customer.</li>}
                            {finalSust < 50 && <li><strong>Go Green:</strong> Your carbon footprint is a PR disaster waiting to happen. Reduce reliance on air freight.</li>}
                            {finalSat < 50 && <li><strong>Buffer Up:</strong> Customers are unhappy, likely due to stockouts or slow delivery. Increase safety inventory.</li>}
                            {(finalRisk >= 50 && finalCost >= 50 && finalSpeed >= 50 && finalSust >= 50 && finalSat >= 50) && 
                                <li><strong>Scale Up:</strong> Your network is perfectly optimized. You are ready to expand to new international markets!</li>}
                        </ul>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button className="btn" onClick={generateScenario}>
                        Build Another Supply Chain
                    </button>
                </div>
            </div>
        );
    }

    const step = STEPS[currentStepIndex];

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <span className="badge">{scenario.name}</span>
                    <span style={{ marginLeft: '1rem', color: 'var(--text-muted)' }}>Step {currentStepIndex + 1} of {STEPS.length}</span>
                </div>
            </div>

            <div className="layout-grid">
                
                <MetricsPanel metrics={metrics} />

                <div className="fade-enter" key={step.id}>
                    <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>{step.title}</h2>
                    
                    <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--surface-highlight)', border: 'none' }}>
                        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem' }}>What is this?</h3>
                        <p style={{ color: 'var(--text-main)', marginTop: '0.5rem', fontWeight: 600 }}>{step.concept}</p>
                        <p style={{ margin: 0 }}>{step.explanation}</p>
                    </div>

                    <div className="options-grid">
                        {step.options.map(opt => (
                            <div 
                                key={opt.id}
                                className={`card interactive ${selectedOption?.id === opt.id ? 'selected' : ''}`}
                                onClick={() => handleSelectOption(opt)}
                            >
                                <h3>{opt.label}</h3>
                                <p style={{ fontSize: '0.95rem' }}>{opt.desc}</p>
                                
                                {selectedOption?.id === opt.id && (
                                    <div style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginTop: '1rem', fontSize: '0.9rem' }}>
                                        ✓ Selected
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {selectedOption && (
                        <div className="tradeoff-box">
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>The Trade-off</h3>
                            <p style={{ margin: 0, color: 'var(--text-main)' }}>{selectedOption.tradeoff}</p>
                            
                            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                <button className="btn accent" onClick={confirmChoice}>
                                    {currentStepIndex === STEPS.length - 1 ? "Finalize Supply Chain" : "Confirm & Continue"} →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);