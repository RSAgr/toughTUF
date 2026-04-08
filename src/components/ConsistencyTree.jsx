import { useState, useEffect } from "react";
import "./ConsistencyTree.css";

export default function ConsistencyTree() {
  const [treeHeight, setTreeHeight] = useState(0);

  // Load tree height from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("treeHeight");
    if (saved) {
      setTreeHeight(Math.max(0, Math.min(100, parseInt(saved, 10))));
    }
  }, []);

  // Save to localStorage whenever tree height changes
  useEffect(() => {
    localStorage.setItem("treeHeight", String(treeHeight));
  }, [treeHeight]);

  const grow = () => {
    setTreeHeight((prev) => Math.min(100, prev + 10));
  };

  const shrink = () => {
    setTreeHeight((prev) => Math.max(0, prev - 10));
  };

  // Calculate tree segments (0-10 levels)
  const segments = Math.floor(treeHeight / 10);
  const percentage = (treeHeight % 10) * 10;

  return (
    <div className="consistency-card">
      <div className="consistency-header">
        <h3>Your Consistency Tree</h3>
        <span className="consistency-level">{treeHeight}%</span>
      </div>

      <div className="tree-visualization">
        <svg className="tree-svg" viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
          {/* Trunk - always visible */}
          <rect className="tree-trunk" x="50" y="140" width="20" height="40" />

          {/* Roots - always visible */}
          <line className="tree-root" x1="40" y1="165" x2="30" y2="175" />
          <line className="tree-root" x1="80" y1="165" x2="90" y2="175" />
          <line className="tree-root" x1="60" y1="180" x2="55" y2="175" />
          <line className="tree-root" x1="60" y1="180" x2="65" y2="175" />

          {/* Foliage segments - grow from 0 to 10 levels */}
          {[...Array(10)].map((_, i) => {
            const isVisible = i < segments;
            const radius = 45 - i * 4;
            const yPos = 130 - i * 12;
            const opacity = isVisible ? 1 : i === segments ? percentage / 100 : 0;

            return (
              <circle
                key={i}
                className="tree-foliage"
                cx="60"
                cy={yPos}
                r={radius}
                style={{ opacity }}
              />
            );
          })}
        </svg>
      </div>

      <div className="consistency-stats">
        <p className="consistency-message">
          {treeHeight === 0 && "Plant your tree! Start small, grow big."}
          {treeHeight > 0 && treeHeight < 30 && "Keep watering! 🌱"}
          {treeHeight >= 30 && treeHeight < 60 && "Growing strong! 🌿"}
          {treeHeight >= 60 && treeHeight < 90 && "Magnificent growth! 🌳"}
          {treeHeight >= 90 && "Your tree stands tall! 🌲"}
        </p>
      </div>

      <div className="consistency-buttons">
        <button className="btn-shrink" onClick={shrink} title="Lose consistency progress">
          ↓ Shrink
        </button>
        <button className="btn-grow" onClick={grow} title="Grow your consistency tree">
          ↑ Grow
        </button>
      </div>
    </div>
  );
}
