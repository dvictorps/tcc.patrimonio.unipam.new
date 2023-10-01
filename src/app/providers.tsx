// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/context/AuthContext'

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CacheProvider>
            <ChakraProvider cssVarsRoot={undefined}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}