const { useState, useEffect, useMemo } = React;

// --- GAME DATA & LOGIC ---
const COMPANIES = [
    { name: "AeroTech Dynamics", industry: "Aerospace Manufacturing", revenue: "$4.2B", factories: 3, warehouses: 8, suppliers: 340, inventoryDays: 20, leadTime: 90, countries: 12 },
    { name: "VitaPharma", industry: "Pharmaceuticals", revenue: "$1.8B", factories: 5, warehouses: 14, suppliers: 110, inventoryDays: 45, leadTime: 60, countries: 22 },
    { name: "Velocity EV", industry: "Electric Vehicles", revenue: "$8.5B", factories: 2, warehouses: 6, suppliers: 850, inventoryDays: 12, leadTime: 40, countries: 15 },
    { name: "FreshBite Foods", industry: "FMCG / Food & Beverage", revenue: "$900M", factories: 8, warehouses: 25, suppliers: 60, inventoryDays: 7, leadTime: 10, countries: 4 },
    { name: "Lumina Fast Fashion", industry: "Retail Apparel", revenue: "$2.1B", factories: 0, warehouses: 30, suppliers: 400, inventoryDays: 25, leadTime: 35, countries: 18 }
];

const CRISES = [
    { type: "Factory Fire", location: "Primary Assembly Plant", urgency: "Critical", impact: "Total halt of main product line. Inventory buffers will run dry in 8 days.", context: "A localized fire has destroyed the main conveyor system. Production is completely stopped while investigators and repair crews work." },
    { type: "Port Strike", location: "Global Shipping Hub", urgency: "High", impact: "70% of inbound raw materials are stuck on ships.", context: "Dockworkers are striking for better wages. Ships are anchored offshore, meaning you cannot get the parts needed to build your products." },
    { type: "Cyberattack", location: "Supplier Network", urgency: "Critical", impact: "Digital systems locked. You cannot see what inventory is arriving or when.", context: "A ransomware attack hit your digital procurement system. You are completely blind to supply chain movements until IT restores backups." },
    { type: "Raw Material Shortage", location: "Global Market", urgency: "Medium", impact: "Prices for key components have spiked 400%.", context: "Due to geopolitical tensions, a critical metal/material is suddenly scarce. Suppliers are invoking 'Force Majeure' to break contracts and raise prices." }
];

const WAR_ROOM_ACTIONS = [
    { id: "air", title: "Charter Air Freight", desc: "Abandon slow ships and fly critical parts in immediately.", cost: -25, delivery: +30, profit: -15, inv: +10, sat: +10, why: "Air freight is 10x more expensive than ocean freight, but it cuts transit time from weeks to days." },
    { id: "alt", title: "Activate Backup Supplier", desc: "Buy from a local, unvetted supplier at a premium.", cost: -15, delivery: +10, profit: -10, inv: +20, sat: +0, why: "Having a secondary supplier (multi-sourcing) builds resilience, though they usually charge more than your main partner." },
    { id: "ration", title: "Ration Inventory", desc: "Limit how much customers can buy to stretch current stock.", cost: +0, delivery: -15, profit: -10, inv: +25, sat: -20, why: "Allocation prevents stockouts (running entirely out), but frustrates big clients who want their full orders." },
    { id: "discount", title: "Delay & Discount", desc: "Inform customers of delays but offer a 20% discount to keep them.", cost: -10, delivery: -20, profit: -20, inv: +0, sat: +15, why: "Proactive communication builds trust. Customers hate surprises more than they hate delays." },
    { id: "redesign", title: "Emergency Redesign", desc: "Alter the product to use a different, available component.", cost: -20, delivery: -10, profit: -5, inv: +15, sat: -5, why: "Engineering out a bottleneck part is smart long-term, but requires expensive immediate R&D and testing." },
    { id: "hoard", title: "Aggressive Hoarding", desc: "Buy up all available market stock before competitors can.", cost: -30, delivery: +0, profit: -10, inv: +35, sat: +0, why: "Secures your supply but ties up massive amounts of cash in inventory, hurting short-term profitability." }
];

const NEGOTIATION_ROUNDS = [
    {
        scenario: "Your primary supplier demands a 30% price increase due to the crisis, effective immediately.",
        choices: [
            { text: "Accept the increase to guarantee supply.", impacts: { trust: +10, price: -20, time: +10 }, feedback: "You secured supply, but at a huge cost to your profit margins." },
            { text: "Refuse completely and threaten to sue.", impacts: { trust: -30, price: +0, time: -20 }, feedback: "You saved money, but the supplier delayed your shipments in retaliation." },
            { text: "Offer 15% now, 15% later if delivery is on time.", impacts: { trust: +5, price: -10, time: +5 }, feedback: "A solid compromise. You shared the risk." }
        ]
    },
    {
        scenario: "The supplier states they can only fulfill 50% of your order volume this month.",
        choices: [
            { text: "Demand 100% or you'll cancel the contract.", impacts: { trust: -20, price: +0, time: -15 }, feedback: "Aggressive tactics backfired. They called your bluff." },
            { text: "Accept 50% and prioritize your most important customers.", impacts: { trust: +10, price: +0, time: +0 }, feedback: "Pragmatic choice. You managed customer expectations internally." },
            { text: "Offer to pay a premium to jump the queue.", impacts: { trust: +5, price: -15, time: +15 }, feedback: "You got the volume, but bled cash to do it." }
        ]
    }
];

const BOARDROOM_QUESTIONS = [
    {
        q: "The CFO asks: 'Why did we run out of parts so fast? Shouldn't we just hold massive amounts of inventory all the time?'",
        options: [
            { text: "Yes, we should never run out of stock.", correct: false },
            { text: "No, inventory ties up cash (holding costs) and can become obsolete.", correct: true },
            { text: "Yes, warehouses are cheap to run.", correct: false }
        ],
        explanation: "Holding inventory costs money (storage, insurance, depreciation). Supply chain is a balancing act between having enough to sell, but not so much that it bankrupts you."
    },
    {
        q: "The CEO asks: 'What is our primary strategy to prevent this specific supplier bottleneck from happening again?'",
        options: [
            { text: "Single-sourcing to build a deep relationship.", correct: false },
            { text: "Multi-sourcing (having secondary suppliers) to spread risk.", correct: true },
            { text: "Stop selling the product altogether.", correct: false }
        ],
        explanation: "Multi-sourcing ensures that if one supplier fails (due to fire, bankruptcy, etc.), you have a backup ready to go."
    },
    {
        q: "The Head of Sales asks: 'What exactly is Lead Time?'",
        options: [
            { text: "The time it takes to manufacture one item.", correct: false },
            { text: "The time between a customer complaining and us fixing it.", correct: false },
            { text: "The total time from placing an order to receiving the goods.", correct: true }
        ],
        explanation: "Lead time is crucial. If your lead time is 90 days, you have to accurately guess what customers will want 3 months from now."
    }
];

const AI_INVESTMENTS = [
    { id: "demand", name: "Demand Forecasting AI", desc: "Predicts customer buying patterns using machine learning to prevent overstocking.", impact: { cost: +10, profit: +15 } },
    { id: "risk", name: "Supplier Risk Monitoring", desc: "Scans global news, weather, and financial data to warn you of supplier bankruptcies or strikes before they happen.", impact: { inv: +15, delivery: +10 } },
    { id: "vision", name: "Warehouse Computer Vision", desc: "Uses cameras and AI to automatically count inventory and spot quality defects in real-time.", impact: { cost: +5, sat: +15 } },
    { id: "copilot", name: "Procurement Copilot", desc: "An AI assistant that reads thousands of supplier contracts to find cost-saving clauses and negotiate basic terms.", impact: { cost: +20, profit: +5 } },
    { id: "twin", name: "Digital Twin Simulation", desc: "Creates a virtual replica of your entire supply chain to stress-test 'what-if' crisis scenarios safely.", impact: { delivery: +15, inv: +10 } }
];

// --- REUSABLE COMPONENTS ---
const ProgressBar = ({ label, value, colorClass }) => {
    const clamped = Math.min(100, Math.max(0, value));
    let color = "var(--primary)";
    if (colorClass === "dynamic") {
        if (clamped < 30) color = "var(--danger)";
        else if (clamped < 60) color = "var(--warning)";
        else color = "var(--success)";
    } else {
        color = `var(--${colorClass})`;
    }

    return (
        <div className="metric-container">
            <div className="metric-header">
                <span>{label}</span>
                <span>{Math.round(clamped)}/100</span>
            </div>
            <div className="progress-bg">
                <div 
                    className="progress-bar" 
                    style={{ width: `${clamped}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};

const TopMetrics = ({ metrics }) => (
    <div className="status-bar fade-in">
        <ProgressBar label="Operating Cost" value={metrics.cost} colorClass="dynamic" />
        <ProgressBar label="Inventory Level" value={metrics.inventory} colorClass="dynamic" />
        <ProgressBar label="Profit Margin" value={metrics.profit} colorClass="dynamic" />
        <ProgressBar label="Delivery Speed" value={metrics.delivery} colorClass="dynamic" />
        <ProgressBar label="Customer Sat." value={metrics.satisfaction} colorClass="dynamic" />
    </div>
);

// --- MAIN APP COMPONENT ---
const App = () => {
    const [gameState, setGameState] = useState('WELCOME');
    const [company, setCompany] = useState(null);
    const [crisis, setCrisis] = useState(null);
    const [metrics, setMetrics] = useState({
        cost: 60, inventory: 60, profit: 60, delivery: 60, satisfaction: 60
    });
    
    const [warRoomChoices, setWarRoomChoices] = useState([]);
    const [negRound, setNegRound] = useState(0);
    const [negScore, setNegScore] = useState({ trust: 50, price: 50, time: 50 });
    const [boardroomIndex, setBoardroomIndex] = useState(0);
    const [boardScore, setBoardScore] = useState(0);
    const [aiChoices, setAiChoices] = useState([]);
    const [feedbackLog, setFeedbackLog] = useState([]);

    const startGame = () => {
        setCompany(COMPANIES[Math.floor(Math.random() * COMPANIES.length)]);
        setCrisis(CRISES[Math.floor(Math.random() * CRISES.length)]);
        setGameState('COMPANY_INFO');
    };

    const resetGame = () => {
        setMetrics({ cost: 60, inventory: 60, profit: 60, delivery: 60, satisfaction: 60 });
        setWarRoomChoices([]);
        setNegRound(0);
        setNegScore({ trust: 50, price: 50, time: 50 });
        setBoardroomIndex(0);
        setBoardScore(0);
        setAiChoices([]);
        setFeedbackLog([]);
        startGame();
    };

    const updateMetrics = (changes) => {
        setMetrics(prev => ({
            cost: prev.cost + (changes.cost || 0),
            inventory: prev.inventory + (changes.inv || 0),
            profit: prev.profit + (changes.profit || 0),
            delivery: prev.delivery + (changes.delivery || 0),
            satisfaction: prev.satisfaction + (changes.sat || 0)
        }));
    };

    const renderWelcome = () => (
        <div className="container flex-center fade-in">
            <h1>Operation <span className="text-gradient">Lifeline</span></h1>
            <h2>Supply Chain Crisis Lab</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                Step into the shoes of a Chief Supply Chain Officer. 
                A multi-billion dollar company is about to face a massive disruption. 
                Can you balance costs, keep inventory flowing, and save the business?
                <br/><br/>
                <em>No prior experience required. You'll learn as you play.</em>
            </p>
            <button onClick={startGame} style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
                Start Simulation 🚀
            </button>
        </div>
    );

    const renderCompany = () => (
        <div className="container fade-in">
            <div className="mb-2">
                <span className="badge info mb-2">Your Company Profile</span>
                <h1>{company.name}</h1>
                <p>Industry: <strong>{company.industry}</strong> | Annual Revenue: <strong>{company.revenue}</strong></p>
            </div>
            
            <div className="grid-3 mb-2">
                <div className="card">
                    <div className="card-header">Inventory Days</div>
                    <div className="card-value">{company.inventoryDays} Days</div>
                    <div className="learning-note"><strong>Concept:</strong> How long you can continue selling if all supplies instantly stopped arriving.</div>
                </div>
                <div className="card">
                    <div className="card-header">Global Suppliers</div>
                    <div className="card-value">{company.suppliers}</div>
                    <div className="learning-note"><strong>Concept:</strong> The number of external companies you rely on to build your product.</div>
                </div>
                <div className="card">
                    <div className="card-header">Average Lead Time</div>
                    <div className="card-value">{company.leadTime} Days</div>
                    <div className="learning-note"><strong>Concept:</strong> The time it takes from ordering a part to receiving it in your warehouse.</div>
                </div>
            </div>

            <div className="flex-center" style={{ height: 'auto', marginTop: '3rem' }}>
                <button onClick={() => setGameState('CRISIS')}>Acknowledge & Proceed</button>
            </div>
        </div>
    );

    const renderCrisis = () => (
        <div className="container fade-in">
            <div className="alert-box">
                <span className="badge critical mb-2">CRISIS DETECTED</span>
                <h1 style={{ color: 'var(--danger)' }}>{crisis.type}</h1>
                <h3>Location: {crisis.location}</h3>
                <p style={{ color: 'white', fontSize: '1.1rem', marginTop: '1rem' }}>{crisis.impact}</p>
            </div>
            
            <div className="card mb-2">
                <h3>Situation Briefing</h3>
                <p>{crisis.context}</p>
                <div className="learning-note">
                    <strong>Why this matters:</strong> Supply chains are heavily optimized for cost (Lean/Just-in-Time). When a disruption hits, you don't have months of spare parts sitting around. Every hour counts.
                </div>
            </div>

            <div className="flex-between">
                <button onClick={() => setGameState('WAR_ROOM')}>Enter War Room</button>
            </div>
        </div>
    );

    const renderWarRoom = () => {
        const toggleChoice = (action) => {
            if (warRoomChoices.find(c => c.id === action.id)) {
                setWarRoomChoices(warRoomChoices.filter(c => c.id !== action.id));
                updateMetrics({
                    cost: -action.cost, inv: -action.inv, profit: -action.profit, delivery: -action.delivery, sat: -action.sat
                });
            } else {
                if (warRoomChoices.length < 3) {
                    setWarRoomChoices([...warRoomChoices, action]);
                    updateMetrics(action);
                }
            }
        };

        return (
            <div className="container fade-in">
                <TopMetrics metrics={metrics} />
                <div className="mb-2">
                    <h2>The War Room</h2>
                    <p>You must formulate an immediate response. Select exactly <strong>3 actions</strong> to stabilize the situation. Watch how your decisions impact company metrics above.</p>
                    <p><em>Selected: {warRoomChoices.length} / 3</em></p>
                </div>

                <div className="grid-2 mb-2">
                    {WAR_ROOM_ACTIONS.map(action => {
                        const isSelected = warRoomChoices.find(c => c.id === action.id);
                        const isDisabled = !isSelected && warRoomChoices.length >= 3;
                        
                        return (
                            <div 
                                key={action.id} 
                                className={`card ${isSelected ? 'selected' : ''}`} 
                                style={{ opacity: isDisabled ? 0.6 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                onClick={() => !isDisabled && toggleChoice(action)}
                            >
                                <div className="flex-between mb-2">
                                    <h3>{action.title}</h3>
                                    {isSelected && <span className="badge info">Selected</span>}
                                </div>
                                <p>{action.desc}</p>
                                <div className="learning-note" style={{ marginTop: 'auto' }}>
                                    💡 {action.why}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-center" style={{ height: 'auto', marginTop: '2rem' }}>
                    <button 
                        disabled={warRoomChoices.length !== 3} 
                        onClick={() => setGameState('NEGOTIATION')}
                    >
                        Execute Strategy ➔
                    </button>
                </div>
            </div>
        );
    };

    const renderNegotiation = () => {
        const currentRound = NEGOTIATION_ROUNDS[negRound];

        const handleChoice = (choice) => {
            setNegScore(prev => ({
                trust: prev.trust + choice.impacts.trust,
                price: prev.price + choice.impacts.price,
                time: prev.time + choice.impacts.time
            }));
            
            updateMetrics({
                cost: choice.impacts.price * 0.5,
                delivery: choice.impacts.time * 0.5
            });

            setFeedbackLog(prev => [...prev, choice.feedback]);

            if (negRound < NEGOTIATION_ROUNDS.length - 1) {
                setNegRound(negRound + 1);
            } else {
                setGameState('BOARDROOM');
            }
        };

        return (
            <div className="container fade-in">
                <TopMetrics metrics={metrics} />
                
                <div className="mb-2">
                    <h2>Supplier Negotiation</h2>
                    <p>During a crisis, suppliers hold the power. You must negotiate terms for remaining inventory. Balance your relationship (Trust) against Cost and Delivery Time.</p>
                </div>

                <div className="grid-3 mb-2">
                    <ProgressBar label="Supplier Trust" value={negScore.trust} colorClass="info" />
                    <ProgressBar label="Pricing Power" value={negScore.price} colorClass="warning" />
                    <ProgressBar label="Delivery Priority" value={negScore.time} colorClass="primary" />
                </div>

                <div className="card mt-2">
                    <span className="badge warning mb-2">Message from Supplier</span>
                    <h3>{currentRound.scenario}</h3>
                    
                    <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {currentRound.choices.map((choice, idx) => (
                            <button key={idx} className="outline" style={{ textAlign: 'left', justifyContent: 'flex-start' }} onClick={() => handleChoice(choice)}>
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderBoardroom = () => {
        const question = BOARDROOM_QUESTIONS[boardroomIndex];

        const answerQuestion = (isCorrect) => {
            if (isCorrect) {
                setBoardScore(boardScore + 1);
                updateMetrics({ profit: +5, sat: +5 }); 
            } else {
                updateMetrics({ profit: -5, sat: -5 });
            }
            
            alert(isCorrect ? "Correct! " + question.explanation : "Incorrect. " + question.explanation);

            if (boardroomIndex < BOARDROOM_QUESTIONS.length - 1) {
                setBoardroomIndex(boardroomIndex + 1);
            } else {
                setGameState('AI_STRATEGY');
            }
        };

        return (
            <div className="container fade-in">
                <TopMetrics metrics={metrics} />
                
                <div className="mb-2">
                    <h2>CEO Boardroom Briefing</h2>
                    <p>The executive board wants answers. Show your understanding of supply chain fundamentals.</p>
                    <p><em>Question {boardroomIndex + 1} of {BOARDROOM_QUESTIONS.length}</em></p>
                </div>

                <div className="card">
                    <h3>{question.q}</h3>
                    <div className="mt-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {question.options.map((opt, idx) => (
                            <button key={idx} className="outline" style={{ textAlign: 'left', justifyContent: 'flex-start' }} onClick={() => answerQuestion(opt.correct)}>
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderAIStrategy = () => {
        const toggleAi = (ai) => {
            if (aiChoices.find(c => c.id === ai.id)) {
                setAiChoices(aiChoices.filter(c => c.id !== ai.id));
                updateMetrics({
                    cost: -(ai.impact.cost || 0), inv: -(ai.impact.inv || 0), profit: -(ai.impact.profit || 0), delivery: -(ai.impact.delivery || 0), sat: -(ai.impact.sat || 0)
                });
            } else {
                if (aiChoices.length < 2) {
                    setAiChoices([...aiChoices, ai]);
                    updateMetrics(ai.impact);
                }
            }
        };

        return (
            <div className="container fade-in">
                <TopMetrics metrics={metrics} />
                <div className="mb-2">
                    <h2>Future-Proofing: AI Strategy</h2>
                    <p>The crisis is stabilizing. To prevent this in the future, the board has approved budget for <strong>two AI integrations</strong>. Select your investments.</p>
                </div>

                <div className="grid-2 mb-2">
                    {AI_INVESTMENTS.map(ai => {
                        const isSelected = aiChoices.find(c => c.id === ai.id);
                        const isDisabled = !isSelected && aiChoices.length >= 2;
                        return (
                            <div 
                                key={ai.id} 
                                className={`card ${isSelected ? 'selected' : ''}`}
                                style={{ opacity: isDisabled ? 0.6 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                onClick={() => !isDisabled && toggleAi(ai)}
                            >
                                <div className="flex-between mb-2">
                                    <h3>{ai.name}</h3>
                                    {isSelected && <span className="badge info">Approved</span>}
                                </div>
                                <p>{ai.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-center" style={{ height: 'auto', marginTop: '2rem' }}>
                    <button 
                        disabled={aiChoices.length !== 2} 
                        onClick={() => setGameState('FINAL_DASHBOARD')}
                    >
                        Complete Simulation ➔
                    </button>
                </div>
            </div>
        );
    };

    const renderFinalDashboard = () => {
        const avgMetrics = (metrics.cost + metrics.inventory + metrics.profit + metrics.delivery + metrics.satisfaction) / 5;
        const finalScore = Math.min(100, Math.max(0, Math.round(avgMetrics + (boardScore * 2) + (negScore.trust * 0.1))));
        
        let performance = "";
        if (finalScore >= 80) performance = "Masterful CSCO";
        else if (finalScore >= 60) performance = "Competent Operator";
        else performance = "Needs Improvement";

        return (
            <div className="container fade-in">
                <div className="flex-center" style={{ height: 'auto', marginBottom: '2rem' }}>
                    <span className="badge info mb-2">Simulation Complete</span>
                    <h2>Overall Crisis Resilience Score</h2>
                    <div className="dashboard-score text-gradient">{finalScore} / 100</div>
                    <h3>Rating: {performance}</h3>
                </div>

                <div className="grid-2 mb-2">
                    <div className="card">
                        <h3>Final Company Health</h3>
                        <div style={{ marginTop: '1rem' }}>
                            <ProgressBar label="Cost Efficiency" value={metrics.cost} colorClass="dynamic" />
                            <ProgressBar label="Inventory Buffer" value={metrics.inventory} colorClass="dynamic" />
                            <ProgressBar label="Profit Margins" value={metrics.profit} colorClass="dynamic" />
                            <ProgressBar label="Delivery Speed" value={metrics.delivery} colorClass="dynamic" />
                            <ProgressBar label="Customer Sat." value={metrics.satisfaction} colorClass="dynamic" />
                        </div>
                    </div>
                    
                    <div className="card">
                        <h3>Expert Feedback & Learnings</h3>
                        <p><strong>Crisis Handled:</strong> {crisis.type}</p>
                        <p><strong>Boardroom Acumen:</strong> {boardScore} / {BOARDROOM_QUESTIONS.length} correct</p>
                        
                        <div className="learning-note">
                            <strong>Key Takeaway:</strong> 
                            Supply chain is never about maximizing just one thing. If you only cut costs, you have no inventory when a crisis hits (brittle). If you hoard inventory, you bleed cash (inefficient). Real-world supply chains require a balance of visibility, multi-sourcing, and strategic buffers.
                        </div>
                    </div>
                </div>

                <div className="flex-center" style={{ height: 'auto', marginTop: '2rem' }}>
                    <button onClick={resetGame}>Play Again (New Scenario)</button>
                </div>
            </div>
        );
    };

    const renderCurrentState = () => {
        switch(gameState) {
            case 'WELCOME': return renderWelcome();
            case 'COMPANY_INFO': return renderCompany();
            case 'CRISIS': return renderCrisis();
            case 'WAR_ROOM': return renderWarRoom();
            case 'NEGOTIATION': return renderNegotiation();
            case 'BOARDROOM': return renderBoardroom();
            case 'AI_STRATEGY': return renderAIStrategy();
            case 'FINAL_DASHBOARD': return renderFinalDashboard();
            default: return renderWelcome();
        }
    };

    return (
        <div>
            {renderCurrentState()}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);