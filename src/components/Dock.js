import React from 'react';

/**
 * Dock - A modern, glassy, capsule layout component from reactbits.dev
 * https://www.reactbits.dev/components/dock
 *
 * Usage:
 * <Dock>
 *   <Dock.Left>...</Dock.Left>
 *   <Dock.Center>...</Dock.Center>
 *   <Dock.Right>...</Dock.Right>
 * </Dock>
 */

const DockContext = React.createContext({});

function Dock({ className = '', children, ...props }) {
  return (
    <DockContext.Provider value={{}}>
      <div
        className={`flex items-center justify-between w-full ${className}`}
        {...props}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

Dock.Left = function DockLeft({ className = '', children, ...props }) {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      {children}
    </div>
  );
};

Dock.Center = function DockCenter({ className = '', children, ...props }) {
  return (
    <div className={`flex-1 flex items-center justify-center ${className}`} {...props}>
      {children}
    </div>
  );
};

Dock.Right = function DockRight({ className = '', children, ...props }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Dock; 