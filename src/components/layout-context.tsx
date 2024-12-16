// components/layout-context.tsx
import { createContext, useContext, ReactNode } from "react";

const LayoutContext = createContext({ showSidebar: true });

export const LayoutProvider = ({
    children,
    value,
}: {
    children: ReactNode;
    value: { showSidebar: boolean };
}) => <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;

export const useLayout = () => useContext(LayoutContext);
