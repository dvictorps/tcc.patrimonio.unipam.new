// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/context/AuthContext'
import { ApiProvider } from '@/context/ApiContext'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CacheProvider>
            <ChakraProvider cssVarsRoot={undefined}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <ApiProvider>
                            {children}
                        </ApiProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}