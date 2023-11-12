import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { api } from '../lib/axios'

// Tipagem da transaction para que seja possível utilizar o intelesense e estar de acordo com o Typescript
interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionsInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

// Tipagem do nosso estado global, aonde podemos fornecer funções, estados e muito mais
interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionsInput) => Promise<void>
}

// Tipagem das propriedades do componente TransactionsProvider
interface TransactionProviderProps {
  children: React.ReactNode
}
// Criação do contexto com as propriedade sendo tipadas
// export const TransactionsContext = createContext({} as TransactionContextType)
export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  // Criação do estado com juntamente com sua tipagem e seu valor inicial dentro do valor passado pela função que é um array vazio
  const [transactions, setTransactions] = useState<Array<Transaction>>([])

  // Função de busca dos dados na API para que seja possível atribuir ao nosso estado de transactions os dados que vierem da API do JSON-Server.
  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        q: query,
        _sort: 'createdAt',
        _order: 'desc',
      },
    })
    setTransactions(response.data)
    // const url = new URL('http://localhost:3333/transactions')
    // if (query) {
    //   url.searchParams.append('q', query)
    // }

    // await fetch(url)
    // .then(response => response.json())
    // .then(data => {
    //   setTransactions(data)
    // })
  }, [])

  const createTransaction = useCallback(
    async ({ type, price, category, description }: CreateTransactionsInput) => {
      const response = await api.post('transactions', {
        type,
        price,
        category,
        description,
        createdAt: new Date(),
      })

      setTransactions((state) => [response.data, ...state])
    },
    [], // Array de dependencias para indicar quando a função será recriada em memória
    // Se o array for vazio a função nunca vai ser recriada em memória
  )
  // useEffect para que a busca dos dados seja executada apenas uma vez quando o componente de TransactionsProvider seja montado.
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
