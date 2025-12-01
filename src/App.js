import React, { useState } from 'react';
import './App.css';
import tarotData from './tarot-json/tarot-images.json';

const SPREADS = [
  { 
    name: "None", 
    positions: [],
    layout: "grid"
  },
  { 
    name: "Single Card", 
    positions: ["Present Situation"],
    layout: "single"
  },
  { 
    name: "Past-Present-Future", 
    positions: ["Past", "Present", "Future"],
    layout: "horizontal"
  },
  { 
    name: "Mind-Body-Spirit", 
    positions: ["Mind", "Body", "Spirit"],
    layout: "triangle"
  },
  { 
    name: "Situation-Action-Outcome", 
    positions: ["Situation", "Action", "Outcome"],
    layout: "horizontal"
  },
  { 
    name: "Celtic Cross", 
    positions: ["Present", "Challenge", "Past", "Future", "Above", "Below", "Advice", "External Influences", "Hopes/Fears", "Outcome"],
    layout: "celtic-cross"
  },
  { 
    name: "Horseshoe Spread", 
    positions: ["Past", "Present", "Hidden Influences", "Obstacles", "Environment", "Action to Take", "Outcome"],
    layout: "horseshoe"
  },
  { 
    name: "Relationship Spread", 
    positions: ["You", "The Other Person", "The Connection", "Challenges", "Potential"],
    layout: "relationship"
  }
];

function App() {
  const [numCards, setNumCards] = useState(3);
  const [drawnCards, setDrawnCards] = useState([]);
  const [allowReversed, setAllowReversed] = useState(false);
  const [selectedSpread, setSelectedSpread] = useState(0);
  const [modalCard, setModalCard] = useState(null);

  const drawCards = () => {
    const shuffled = [...tarotData.cards].sort(() => Math.random() - 0.5);
    const spread = SPREADS[selectedSpread];
    const count = spread.positions.length > 0 ? spread.positions.length : numCards;

    const selected = shuffled.slice(0, count).map((card, index) => ({
      ...card,
      reversed: allowReversed ? Math.random() < 0.5 : false,
      position: spread.positions[index] || null
    }));
    setDrawnCards(selected);
  };

  const resetReading = () => {
    setDrawnCards([]);
  };

  const openModal = (card) => {
    setModalCard(card);
  };

  const closeModal = () => {
    setModalCard(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔮 Tarotates: Card Reader</h1>
      </header>
      
      <div className="controls">
        <div className="control-row">
          <label htmlFor="spread">Spread: </label>
          <select
            id="spread"
            value={selectedSpread}
            onChange={(e) => setSelectedSpread(parseInt(e.target.value))}
          >
            {SPREADS.map((spread, index) => (
              <option key={index} value={index}>
                {spread.name} {spread.positions.length > 0 ? `(${spread.positions.length} cards)` : ''}
              </option>
            ))}
          </select>
        </div>

        {SPREADS[selectedSpread].positions.length === 0 && (
          <div className="control-row">
            <label htmlFor="numCards">Number of cards: </label>
            <input
              id="numCards"
              type="number"
              min="1"
              value={numCards}
              onChange={(e) => setNumCards(parseInt(e.target.value) || 1)}
            />
          </div>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={allowReversed}
            onChange={(e) => setAllowReversed(e.target.checked)}
          />
          Allow reversed cards
        </label>
        
        <div className="control-row">
          <button onClick={drawCards}>Draw Cards</button>
          {drawnCards.length > 0 && (
            <button onClick={resetReading}>Reset</button>
          )}
        </div>
      </div>

      <div className={`cards-container spread-${SPREADS[selectedSpread].layout}`}>
        {drawnCards.map((card, index) => (
          <div 
            key={index} 
            className={`card card-${index} ${card.reversed ? 'reversed' : ''}`}
            onClick={() => openModal(card)}
          >
            {card.position && (
              <div className="card-position">
                <span className="position-number">{index + 1}</span>
                <span className="position-name">{card.position}</span>
              </div>
            )}
            <img 
              src={`/tarot-json/cards/${card.img}`} 
              alt={card.name}
              className={card.reversed ? 'reversed-img' : ''}
            />
            <div className="card-info">
              <h3>{card.name}{card.reversed && <span className="reversed-badge"> (Reversed)</span>}</h3>
              <div className="card-details">
                <p><strong>Number:</strong> {card.number}</p>
                <p><strong>Arcana:</strong> {card.arcana}</p>
                {card.suit && <p><strong>Suit:</strong> {card.suit}</p>}
                {card.Archetype && <p><strong>Archetype:</strong> {card.Archetype}</p>}
                {card.Elemental && <p><strong>Elemental:</strong> {card.Elemental}</p>}
              </div>

              {card.keywords && card.keywords.length > 0 && (
                <div className="card-section">
                  <h4>Keywords</h4>
                  <div className="keywords">
                    {card.keywords.map((keyword, i) => (
                      <span key={i} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              {card.fortune_telling && card.fortune_telling.length > 0 && (
                <div className="card-section">
                  <h4>Fortune Telling</h4>
                  <ul>
                    {card.fortune_telling.map((fortune, i) => (
                      <li key={i}>{fortune}</li>
                    ))}
                  </ul>
                </div>
              )}

              {card.meanings && (
                <div className="card-section meanings">
                  {card.meanings.light && card.meanings.light.length > 0 && (
                    <div className="meaning-light">
                      <h4>✨ Light Meanings</h4>
                      <ul>
                        {card.meanings.light.map((meaning, i) => (
                          <li key={i}>{meaning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {card.meanings.shadow && card.meanings.shadow.length > 0 && (
                    <div className="meaning-shadow">
                      <h4>🌑 Shadow Meanings</h4>
                      <ul>
                        {card.meanings.shadow.map((meaning, i) => (
                          <li key={i}>{meaning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {card["Questions to Ask"] && card["Questions to Ask"].length > 0 && (
                <div className="card-section">
                  <h4>Questions to Ask</h4>
                  <ul>
                    {card["Questions to Ask"].map((question, i) => (
                      <li key={i}>{question}</li>
                    ))}
                  </ul>
                </div>
              )}

              {card["Mythical/Spiritual"] && (
                <div className="card-section">
                  <h4>Mythical/Spiritual</h4>
                  <p className="mythical">{card["Mythical/Spiritual"]}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <div className={`card modal-card ${modalCard.reversed ? 'reversed' : ''}`}>
              {modalCard.position && (
                <div className="card-position">
                  <span className="position-name">{modalCard.position}</span>
                </div>
              )}
              <img 
                src={`/tarot-json/cards/${modalCard.img}`} 
                alt={modalCard.name}
                className={modalCard.reversed ? 'reversed-img' : ''}
              />
              <div className="card-info">
                <h3>{modalCard.name}{modalCard.reversed && <span className="reversed-badge"> (Reversed)</span>}</h3>
                <div className="card-details">
                  <p><strong>Number:</strong> {modalCard.number}</p>
                  <p><strong>Arcana:</strong> {modalCard.arcana}</p>
                  {modalCard.suit && <p><strong>Suit:</strong> {modalCard.suit}</p>}
                  {modalCard.Archetype && <p><strong>Archetype:</strong> {modalCard.Archetype}</p>}
                  {modalCard.Elemental && <p><strong>Elemental:</strong> {modalCard.Elemental}</p>}
                </div>

                {modalCard.keywords && modalCard.keywords.length > 0 && (
                  <div className="card-section">
                    <h4>Keywords</h4>
                    <div className="keywords">
                      {modalCard.keywords.map((keyword, i) => (
                        <span key={i} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}

                {modalCard.fortune_telling && modalCard.fortune_telling.length > 0 && (
                  <div className="card-section">
                    <h4>Fortune Telling</h4>
                    <ul>
                      {modalCard.fortune_telling.map((fortune, i) => (
                        <li key={i}>{fortune}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {modalCard.meanings && (
                  <div className="card-section meanings">
                    {modalCard.meanings.light && modalCard.meanings.light.length > 0 && (
                      <div className="meaning-light">
                        <h4>✨ Light Meanings</h4>
                        <ul>
                          {modalCard.meanings.light.map((meaning, i) => (
                            <li key={i}>{meaning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {modalCard.meanings.shadow && modalCard.meanings.shadow.length > 0 && (
                      <div className="meaning-shadow">
                        <h4>🌑 Shadow Meanings</h4>
                        <ul>
                          {modalCard.meanings.shadow.map((meaning, i) => (
                            <li key={i}>{meaning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {modalCard["Questions to Ask"] && modalCard["Questions to Ask"].length > 0 && (
                  <div className="card-section">
                    <h4>Questions to Ask</h4>
                    <ul>
                      {modalCard["Questions to Ask"].map((question, i) => (
                        <li key={i}>{question}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {modalCard["Mythical/Spiritual"] && (
                  <div className="card-section">
                    <h4>Mythical/Spiritual</h4>
                    <p className="mythical">{modalCard["Mythical/Spiritual"]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
