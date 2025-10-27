import React, { useState } from 'react'; // Make sure React is imported

// Define TabPanel here or import it if it's separate
export function TabPanel({ children }) {
  // This component might just render its children, or nothing if not active
  // The Tabs component below will control which one is visible
  return <>{children}</>;
}


export function Tabs({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  // --- THIS IS THE FIX ---
  // 1. Convert children to an array and filter out invalid elements
  const validTabPanels = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === TabPanel && child.props.label);
  // --- End Fix ---

  return (
    <div className="mt-6"> {/* Add some margin */}
      {/* Tab Buttons */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {/* 2. Map over the FILTERED array */}
          {validTabPanels.map((panel, index) => (
            <button
              key={panel.props.label} // Use label as key
              onClick={() => setActiveIndex(index)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                activeIndex === index
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
              }`}
            >
              {panel.props.label} {/* Access label safely */}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tab Panel Content */}
      <div className="pt-6">
        {/* 3. Render the active panel from the FILTERED array */}
        {validTabPanels[activeIndex]}
      </div>
    </div>
  );
}