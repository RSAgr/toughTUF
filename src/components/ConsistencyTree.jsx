import { useState, useEffect } from "react";
import "./ConsistencyTree.css";

export default function ConsistencyTree() {
  // Tree stages: 0=seed, 1=seedling, 2=plant, 3=bigger plant, 4=tree, 5=bigger tree, 6=full tree
  const [treeStage, setTreeStage] = useState(() => {
    const saved = localStorage.getItem("treeStage");
    if (!saved) return 0;
    return Math.max(0, Math.min(6, parseInt(saved, 10)));
  });

  // Save to localStorage whenever tree stage changes
  useEffect(() => {
    localStorage.setItem("treeStage", String(treeStage));
  }, [treeStage]);

  const grow = () => {
    setTreeStage((prev) => Math.min(6, prev + 1));
  };

  const resetToSeed = () => {
    setTreeStage(0);
  };

  // Stage names for display
  const stageNames = [
    "Give me Some Sunshine",
    "Give me Some Sunshine",
    "Give me Some Sunshine",
    "Give me Some Sunshine",
    "Give me Some Sunshine",
    "Give me Some Sunshine",
    "Give me Some Sunshine",
  ];

  return (
    <div className="consistency-card">
      <div className="consistency-header">
        <h3>Your Consistency Tree</h3>
        <span className="consistency-level">{stageNames[treeStage]}</span>
      </div>

      <div className="tree-visualization">
        <svg className="tree-svg" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Gradients for 3D effect */}
            <linearGradient id="seedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#A0826D", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#5D4037", stopOpacity: 1 }} />
            </linearGradient>

            <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#8B6F47", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#A0826D", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#6B5844", stopOpacity: 1 }} />
            </linearGradient>

            <linearGradient id="trunkGradDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#6B5844", stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: "#8B6F47", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#5D4037", stopOpacity: 1 }} />
            </linearGradient>

            <radialGradient id="foliageLight">
              <stop offset="0%" style={{ stopColor: "#A5D6A7", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#66BB6A", stopOpacity: 1 }} />
            </radialGradient>

            <radialGradient id="foliageMed">
              <stop offset="0%" style={{ stopColor: "#81C784", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
            </radialGradient>

            <radialGradient id="foliageDark">
              <stop offset="0%" style={{ stopColor: "#558B2F", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#33691E", stopOpacity: 1 }} />
            </radialGradient>

            <filter id="shadow">
              <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.4" />
            </filter>

            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Soil/Ground */}
          <ellipse cx="100" cy="135" rx="50" ry="4" fill="#8D6E63" opacity="0.6" />

          {/* Seed stage (0) */}
          {treeStage >= 0 && (
            <circle className={`tree-seed ${treeStage === 0 ? 'active' : 'hidden'}`} cx="100" cy="120" r="5" fill="url(#seedGrad)" filter="url(#shadow)" />
          )}

          {/* Seedling stage (1) - tiny sprout */}
          {treeStage >= 1 && (
            <>
              <rect className={`seedling-trunk ${treeStage >= 1 ? 'active' : 'hidden'}`} x="96" y="110" width="8" height="12" fill="url(#trunkGrad)" filter="url(#shadow)" rx="2" />
              <circle className={`seedling ${treeStage >= 1 ? 'active' : 'hidden'}`} cx="100" cy="105" r="4" fill="url(#foliageLight)" filter="url(#shadow)" />
              <ellipse className={`seedling ${treeStage >= 1 ? 'active' : 'hidden'}`} cx="92" cy="108" rx="2" ry="3" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
              <ellipse className={`seedling ${treeStage >= 1 ? 'active' : 'hidden'}`} cx="108" cy="108" rx="2" ry="3" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
            </>
          )}

          {/* Plant stage (2) - small plant */}
          {treeStage >= 2 && (
            <>
              <rect className={`plant-trunk ${treeStage >= 2 ? 'active' : 'hidden'}`} x="93" y="102" width="14" height="20" fill="url(#trunkGrad)" filter="url(#shadow)" rx="3" />
              <circle className={`plant-top ${treeStage >= 2 ? 'active' : 'hidden'}`} cx="100" cy="95" r="7" fill="url(#foliageLight)" filter="url(#shadow)" />
              <circle className={`plant-mid ${treeStage >= 2 ? 'active' : 'hidden'}`} cx="80" cy="102" r="5" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`plant-mid ${treeStage >= 2 ? 'active' : 'hidden'}`} cx="120" cy="102" r="5" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`plant-mid ${treeStage >= 2 ? 'active' : 'hidden'}`} cx="90" cy="110" r="4" fill="url(#foliageMed)" opacity="0.7" filter="url(#shadow)" />
              <circle className={`plant-mid ${treeStage >= 2 ? 'active' : 'hidden'}`} cx="110" cy="110" r="4" fill="url(#foliageMed)" opacity="0.7" filter="url(#shadow)" />
            </>
          )}

          {/* Bigger plant stage (3) */}
          {treeStage >= 3 && (
            <>
              <rect className={`bigger-plant-trunk ${treeStage >= 3 ? 'active' : 'hidden'}`} x="90" y="92" width="20" height="30" fill="url(#trunkGrad)" filter="url(#shadow)" rx="4" />
              <circle className={`bigger-plant-1 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="100" cy="82" r="8" fill="url(#foliageLight)" filter="url(#shadow)" />
              <circle className={`bigger-plant-2 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="75" cy="92" r="6" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`bigger-plant-2 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="125" cy="92" r="6" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`bigger-plant-3 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="80" cy="105" r="5" fill="url(#foliageMed)" opacity="0.75" filter="url(#shadow)" />
              <circle className={`bigger-plant-3 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="120" cy="105" r="5" fill="url(#foliageMed)" opacity="0.75" filter="url(#shadow)" />
              <circle className={`bigger-plant-2 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="65" cy="107" r="4" fill="url(#foliageDark)" opacity="0.6" filter="url(#shadow)" />
              <circle className={`bigger-plant-2 ${treeStage >= 3 ? 'active' : 'hidden'}`} cx="135" cy="107" r="4" fill="url(#foliageDark)" opacity="0.6" filter="url(#shadow)" />
            </>
          )}

          {/* Tree stage (4) */}
          {treeStage >= 4 && (
            <>
              <rect className={`tree-trunk-full ${treeStage >= 4 ? 'active' : 'hidden'}`} x="87" y="77" width="26" height="40" fill="url(#trunkGradDark)" filter="url(#shadow)" rx="5" />
              <circle className={`tree-1 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="100" cy="65" r="9" fill="url(#foliageLight)" filter="url(#shadow)" />
              <circle className={`tree-2 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="70" cy="77" r="7" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`tree-2 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="130" cy="77" r="7" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`tree-3 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="75" cy="95" r="6" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
              <circle className={`tree-3 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="125" cy="95" r="6" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
              <circle className={`tree-2 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="60" cy="87" r="5" fill="url(#foliageDark)" opacity="0.65" filter="url(#shadow)" />
              <circle className={`tree-2 ${treeStage >= 4 ? 'active' : 'hidden'}`} cx="140" cy="87" r="5" fill="url(#foliageDark)" opacity="0.65" filter="url(#shadow)" />
            </>
          )}

          {/* Bigger tree stage (5) */}
          {treeStage >= 5 && (
            <>
              <rect className={`bigger-tree-trunk ${treeStage >= 5 ? 'active' : 'hidden'}`} x="84" y="67" width="32" height="52" fill="url(#trunkGradDark)" filter="url(#shadow)" rx="6" />
              <circle className={`bigger-tree-1 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="100" cy="52" r="11" fill="url(#foliageLight)" filter="url(#shadow)" />
              <circle className={`bigger-tree-2 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="60" cy="67" r="8" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`bigger-tree-2 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="140" cy="67" r="8" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`bigger-tree-3 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="65" cy="85" r="7" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
              <circle className={`bigger-tree-3 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="135" cy="85" r="7" fill="url(#foliageMed)" opacity="0.8" filter="url(#shadow)" />
              <circle className={`bigger-tree-4 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="50" cy="97" r="5" fill="url(#foliageDark)" opacity="0.7" filter="url(#shadow)" />
              <circle className={`bigger-tree-4 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="150" cy="97" r="5" fill="url(#foliageDark)" opacity="0.7" filter="url(#shadow)" />
              <circle className={`bigger-tree-3 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="75" cy="105" r="5" fill="url(#foliageDark)" opacity="0.65" filter="url(#shadow)" />
              <circle className={`bigger-tree-3 ${treeStage >= 5 ? 'active' : 'hidden'}`} cx="125" cy="105" r="5" fill="url(#foliageDark)" opacity="0.65" filter="url(#shadow)" />
            </>
          )}

          {/* Full tree stage (6) - maximum growth */}
          {treeStage >= 6 && (
            <>
              <rect className={`full-tree-trunk ${treeStage >= 6 ? 'active' : 'hidden'}`} x="82" y="55" width="36" height="67" fill="url(#trunkGradDark)" filter="url(#shadow)" rx="7" />
              <circle className={`full-tree-1 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="100" cy="37" r="13" fill="url(#foliageLight)" filter="url(#shadow)" />
              <circle className={`full-tree-2 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="50" cy="55" r="10" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`full-tree-2 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="150" cy="55" r="10" fill="url(#foliageMed)" filter="url(#shadow)" />
              <circle className={`full-tree-3 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="55" cy="77" r="8" fill="url(#foliageMed)" opacity="0.82" filter="url(#shadow)" />
              <circle className={`full-tree-3 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="145" cy="77" r="8" fill="url(#foliageMed)" opacity="0.82" filter="url(#shadow)" />
              <circle className={`full-tree-4 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="40" cy="100" r="6" fill="url(#foliageDark)" opacity="0.75" filter="url(#shadow)" />
              <circle className={`full-tree-4 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="160" cy="100" r="6" fill="url(#foliageDark)" opacity="0.75" filter="url(#shadow)" />
              <circle className={`full-tree-3 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="65" cy="107" r="6" fill="url(#foliageDark)" opacity="0.7" filter="url(#shadow)" />
              <circle className={`full-tree-3 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="135" cy="107" r="6" fill="url(#foliageDark)" opacity="0.7" filter="url(#shadow)" />
              <circle className={`full-tree-2 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="48" cy="75" r="7" fill="url(#foliageDark)" opacity="0.6" filter="url(#shadow)" />
              <circle className={`full-tree-2 ${treeStage >= 6 ? 'active' : 'hidden'}`} cx="152" cy="75" r="7" fill="url(#foliageDark)" opacity="0.6" filter="url(#shadow)" />
            </>
          )}

          {/* Roots - always visible */}
          <line className="tree-root" x1="65" y1="125" x2="30" y2="135" strokeWidth="3" strokeLinecap="round" />
          <line className="tree-root" x1="135" y1="125" x2="170" y2="135" strokeWidth="3" strokeLinecap="round" />
          <line className="tree-root" x1="95" y1="125" x2="70" y2="135" strokeWidth="2" strokeLinecap="round" />
          <line className="tree-root" x1="105" y1="125" x2="130" y2="135" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="consistency-stats">
        <p className="consistency-message">
          {treeStage === 0 && "Plant your tree. Start with a seed."}
          {treeStage === 1 && "A seedling has started growing."}
          {treeStage === 2 && "Your plant is growing steadily."}
          {treeStage === 3 && "The tree is getting stronger."}
          {treeStage === 4 && "A healthy tree is taking shape."}
          {treeStage === 5 && "The tree is standing tall now."}
          {treeStage === 6 && "The tree has reached full growth."}
        </p>
      </div>

      <div className="consistency-buttons">
        <button className="btn-reset" onClick={resetToSeed} title="Reset to seed (break in consistency)">
          Reset to Seed
        </button>
        <button className="btn-grow" onClick={grow} title="Grow your consistency tree" disabled={treeStage === 6}>
          Grow
        </button>
      </div>
    </div>
  );
}
