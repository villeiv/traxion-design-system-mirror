import * as React from "react"

export type DesignSystemLanguage = "en" | "es"

interface LanguageContextValue {
    language: DesignSystemLanguage
}

// Default to "es" so components render in Spanish even without a provider
const LanguageContext = React.createContext<LanguageContextValue>({
    language: "es",
})

export function useDesignSystemLanguage(): DesignSystemLanguage {
    return React.useContext(LanguageContext).language
}

export interface LanguageProviderProps {
    language?: DesignSystemLanguage
    children: React.ReactNode
}

export function LanguageProvider({
    language = "es",
    children,
}: LanguageProviderProps) {
    const value = React.useMemo(() => ({ language }), [language])
    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

LanguageProvider.displayName = "LanguageProvider"
