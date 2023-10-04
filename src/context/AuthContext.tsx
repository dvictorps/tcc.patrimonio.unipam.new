import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '@/api/api';
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/navigation';

type User = {
    id: number
    user: string
    role: number
    name: string
}

type AuthContextType = {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderType = {
    children: React.ReactNode
}
export function AuthProvider({ children }: AuthProviderType) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    function setApiAuthToken(token: string) {
        return api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    useEffect(() => {

        const tokenCookie = Cookies.get('token');
        if (!tokenCookie) return router.push('/login');

        setApiAuthToken(tokenCookie)

        const decodedUser = jwt.decode(tokenCookie) as User;
        setUser(decodedUser)

    }, [router]);

    async function login(username: string, password: string): Promise<boolean> {
        try {
            const response = await api.post('auth/signin', {
                Usuario: username,
                Senha: password,
            });
            console.log('Logou:', response.data)
            const tokenCookie = Cookies.get('token');
            const cookieAways = tokenCookie ? tokenCookie : 'Não funcionou';
            console.log('chegou aqui:', cookieAways)

            if (cookieAways != 'Não Funcionou') {


                try {
                    const decodedUser = jwt.decode(cookieAways) as User;
                    router.push('/')
                    console.log('usuario decodificado:', decodedUser)
                    setUser(decodedUser);


                } catch (error) {

                    console.error('Erro na validação do token:', error);
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    function logout() {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};