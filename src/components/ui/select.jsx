import React, { useState, useRef, useEffect } from 'react';

function SelectTrigger({ className, children, ...props }) {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder, children }) {
  return <span>{children || placeholder}</span>;
}

function SelectContent({ children, onSelect, open }) {
  const ref = useRef(null);

  if (!open) return null;

  return (
    <div 
      ref={ref}
      className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
      style={{ position: 'absolute', top: '100%', left: 0, width: '100%', marginTop: '8px' }}
    >
      <div className="p-1">{children}</div>
    </div>
  );
}

function SelectItem({ value, children, onSelect }) {
  return (
    <div
      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

export function Select({ children, value, onValueChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  // SelectItem 자식 요소에서 선택된 값 표시
  const displayValue = React.Children.toArray(children)
    .find((child) => child.props.value === value)?.props.children;

  return (
    <div className="relative" ref={ref}>
      <SelectTrigger onClick={() => setOpen(!open)}>
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
      </SelectTrigger>
      <SelectContent open={open} onSelect={(val) => { onValueChange(val); setOpen(false); }}>
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              onSelect: (val) => {
                onValueChange(val);
                setOpen(false);
              },
            });
          }
          return child;
        })}
      </SelectContent>
    </div>
  );
}

Select.Trigger = SelectTrigger;
Select.Value = SelectValue;
Select.Content = SelectContent;
Select.Item = SelectItem;

export { SelectTrigger, SelectValue, SelectContent, SelectItem };