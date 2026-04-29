import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
interface MVPContextType { isMVPMode: boolean; toggleMVPMode: () => void; }
const MVPContext = createContext<MVPContextType | undefined>(undefined);
export function MVPProvider({ children }: { children: ReactNode }) {
  const [isMVPMode, setIsMVPMode] = useState(() => { const saved = localStorage.getItem('mvpMode'); return saved ? JSON.parse(saved) : true; });
  useEffect(() => { localStorage.setItem('mvpMode', JSON.stringify(isMVPMode)); }, [isMVPMode]);
  const toggleMVPMode = () => { setIsMVPMode((prev: boolean) => !prev); };
  return (<MVPContext.Provider value={{ isMVPMode, toggleMVPMode }}>{children}</MVPContext.Provider>);
}
export function useMVPMode() {
  const context = useContext(MVPContext);
  if (context === undefined) { throw new Error('useMVPMode must be used within a MVPProvider'); }
  return context;
}
