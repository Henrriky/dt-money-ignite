# Dependencias 

- styled components
- radix-ui
- axios
- phosphor-react
- react-hook-form
- scheduler
- context api
- zod
- typescript
- json server
- eslint
- vite



# Styled components

- Toda definição de createGlobalStyle`` 
- Ou styles.div`` retorna um componente estilizado que pode ser englobado na aplicação
- Arquivos base
  - Styles/theme -> exportação do tema padrão da aplicação como um objeto com as cores
  - Styles/global -> exportação do componente de GlobalStyle retornado da função `createGlobalStyle`
  - Types/style.d.ts -> Sobrescrita do ThemeType para a tipagem do nosso tema default e sobrescrita do modulo styled-components na interface DefaultTheme que extende nosso ThemeType
- ``ThemeProvider`` de styled componentes é um componente que recebe como propriedade nosso tema criado em `Styles/theme`

## Passando valores de css através de propriedades do componente gerado pelo styled components

- Basta adicionar um generic na nossa propriedade e acessar a propriedade através do props.nomePropriedade:
  ```ts
  interface SummaryCardProps {
    variant?: 'green'
  }

  export const SummaryCard = styled.div<SummaryCardProps>`
    background: ${props => props.theme["gray-600"]};
    border-radius: 6px;
    padding: 2rem;

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${props => props.theme["gray-300"]};
    }

    strong {
      display: block;
      margin-top: 2rem;
      font-size: 2rem;
    }

    ${props => props.variant === 'green' && css`
      background: ${props.theme['green-700']}
    `}
  `
  ```

# Estilizações

## Modais acessíveis

- Regras do Aria de acessibilidade
- Utilizar bibliotecas: Ariakit, Headlessui (Tailwind), Chakra-ui etc e Radix-ui.

### Radix

- Componentes primitivos prontos para receberem estilizações.
- [Radix-ui](https://www.radix-ui.com/)
- Diversos componentes com funcionalidades prontas e com acessibilidade prontos para serem utilizados.
- `npm i @radix-ui/react-dialog`
- Uma forma de englobal o trigger, que já é um trigger com nossa estilização do botão do header é chamando o dialog e passando ele para o nosso styled do style-components:
  ```ts
    export const NewTransactionButton = styled(Dialog.Trigger)`
      height: 50px;
      border: 0;
      background: ${props => props.theme['green-500']};
      color: ${props => props.theme['white']};
      font-weight: bold;
      padding: 0 1.25rem;
      border-radius: 6px;
      cursor: pointer;
      
      &:hover {
        background: ${props => props.theme['green-700']};
        transition: background-color .2s;
      }
  `
  ```
- Outra alternativa:
  ```ts
    <Dialog.Trigger asChild>
      <NewTransactionButton>Nova transação</NewTransactionButton>
    </Dialog.Trigger>
  ```
  - A propriedade dialog trigger não vai criar um novo botão, e sim vai usar o nosso componente filho como botão do nosso DialogTrigger
- No Radix usamos o conceito de **Portal** do React, que nada mais é do que uma funcionalidade para permitir que um componente ou conteúdo seja exibido fora da árvore DOM do componente atual. Isso é utilizado por exemplo em modais, o quais eles não pertencem especificamente a um componente
  - É como se nosso modal tivesse um componente próprio dele.                                    

### Modal de nova transação

- Estilizando os elementos puros do radix:
  ```js
  export const Overlay = styled(Dialog.Overlay)`
    position: fixed;
    width: 100vw;
    height: 100vh;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);  
  `
  ```

# JSON Server

- Criação de API completa a partir de um JSON.
- `npm i json-server -D`
```json
{
  "transactions": [
    {
      "id": 1,
      "description": "Desenvolvimento de site",
      "type": "income",
      "category": "Venda",
      "price": 14000,
      "createdAt": "2023-11-05T22:38:17.719Z"
    },
    {
      "id": 1,
      "description": "Hamburguer",
      "type": "outcome",
      "category": "Alimentação",
      "price": 50,
      "createdAt": "2023-11-05T22:10:17.719Z"
    }
  ]
}
```
- Criar arquivo `server.json` e `npx json-server server.json -p 3333`
  - `-w` watch
  - `-d 500` delay de 500 segundos nas requisições
- /transactions -> Lista todas as transações como se fosse endpoint.
- /transactions/1 -> Lista a transação com a propriedade de id igual a 1.
- /transactions?type=income -> Lista as transações que possuem como type o valor de income.
- /transactions?_sort=createdAt -> Ordena os dados pela propriedade de data de criação
- /transactions?_sort=createdAt&_order=desc -> Ordena os dados pela propriedade de data de criação
- /transactions?q=venda -> Procura todos os itens que possuem o texto venda.
- Conseguimos realizar post, put, delete e get.
- Script npm: "dev:server": "json-server server.json -p 3333 -w -d 500",
 
# Carregando lista de transaction

- Contexto global
```ts
import { createContext, useEffect, useState } from "react";

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface TransactionContextType {
  transactions: Transaction[]
}

interface TransactionProviderProps {
  children: React.ReactNode
}



export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider ({ children }: TransactionProviderProps) {
  
  const [transactions, setTransactions] = useState<Array<Transaction>>([])

  async function loadTransactions () {
    await fetch('http://localhost:3333/transactions')
    .then(response => response.json())
    .then(data => {
      setTransactions(data)
    })
  }

  useEffect(() => {
    loadTransactions()
  }, [])
  
  return (
    <TransactionsContext.Provider value={{ transactions }}>
      { children }
    </TransactionsContext.Provider>
  )
}
```

# Formatação dos dados com Intl

- Biblioteca nativa
```js
export const dateFormatter = new Intl.DateTimeFormat('pt-BR')

export const priceFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})
```

# Criação de Hooks próprios

- Basta pegar a lógica de tudo que utiliza hooks e jogar para uma função com a nomenclatura useTexto, reutilizando ela em outros componentes.
- Vamos utilizar isso para criar nosso hook de useSummary.

# React hook form

- `npm i react-hook-form zod`
- `npm i @hookform/resolvers`
- Criar schemas e tipagem com zod
  ```js
  const searchFormSchema = z.object({
    query: z.string(),
  })

  type SearchFormInputs = z.infer<typeof searchFormSchema>
  ```
- Criação estado do formulário
  ```js
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting } 
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema) //Validando nosso schema através do zod
  })

  
  function handleSearchTransactions(data: SearchFormInputs) {
    console.log(data)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}> //Utilizando o conceito de highLevelFunctions
      <input 
        type="text" 
        placeholder="Busque por transações"
        {...register('query')} //Registrando o nome do nosso campo que será validado
      />
      <button type="submit" disabled={isSubmitting}> //Usando estado de enviando ou nao para gerenciar a habilitação do botão
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
  ```

## Desenvolvendo formulário de criação da transaction

```js
const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  // type: z.enum(['income', 'outcome']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

const {
  register,
  handleSubmit,
  formState: {
    isSubmitting
  }
} = useForm<NewTransactionFormInputs>({
  resolver: zodResolver(newTransactionFormSchema)
})

async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log(data)
} 

<form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input 
            { ...register('description')}
            type="text" 
            placeholder="Descrição" 
            required 
          />
          <input 
            { ...register('price', { valueAsNumber: true })}
            type="text" 
            placeholder="Preço" 
            required 
          />
          <input 
            { ...register('category')}
            type="text" 
            placeholder="Categoria" 
            required 
          />
          <TransactionType>
            <TransactionTypeButton variant='income' value='income'>
              <ArrowCircleUp size={24}/>
              Entrada
            </TransactionTypeButton>
            <TransactionTypeButton variant='outcome' value='outcome'>
              <ArrowCircleDown size={24}/>
              Saída
            </TransactionTypeButton>
          </TransactionType>
          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
</form>
```

## Envio das informações do radio para dentro do hook form

- Uncontrolled: Buscar a informação somente quando realizar o submit
- Controlled: Buscar a informação enquanto o usuário vai preenchendo os valores
- Para utilizar o controlled no React Hook Form precisamos ir dentro do useForm e pegar o `control`
  - Sempre que for necessário buscar uma informação de um formulário que ela não venha de um input ou algum componente nativo do HTML nós vamos utilizar o `control`
  ```jsx
  <Controller
      control={control}
      name="type"
      render={({ field }) => {
        //Função que retorna qual é o conteúdo relacionado ao campo type
        return (
          <TransactionType onValueChange={field.onChange} value={field.value}>
            <TransactionTypeButton variant='income' value='income'>
              <ArrowCircleUp size={24} />
              Entrada
            </TransactionTypeButton>
            <TransactionTypeButton variant='outcome' value='outcome'>
              <ArrowCircleDown size={24} />
              Saída
            </TransactionTypeButton>
          </TransactionType>
        )
      }}
  />
  ```

## Formulário de busca com fetch 

- Permitir que nossa função seja passada pelo contexto:
  ```ts
  interface TransactionContextType {
    transactions: Transaction[]
    fetchTransactions: (query?: string) => Promise<void>
  }

  async function fetchTransactions (query?: string) {

    const url = new URL('http://localhost:3333/transactions')
    if (query) {
      url.searchParams.append('q', query)
    }

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setTransactions(data)
    })
  }

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
      { children }
    </TransactionsContext.Provider>
  )
  ```
- Busca no servidor do json-server: `/posts?q=internet`
- O interessante de se utilizar isso é que agora também nosso hook de dentro do summary também será atualizado, pois ele está utilizando o mesmo estado que foi compartilhado com os demais componentes.

## Criação da transaction

- No json-server: `POST /transactions`
- Chamada da função em NewCreateTransactionsModal
  ```ts
  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    createTransaction(data)
    reset()
  }
  //Interface para desacoplar nosso Provider de Transaction ao nossos componentes
  interface CreateTransactionsInput {
    description: string
    price: number
    category: string
    type: 'income' | 'outcome'
  }

  interface TransactionContextType {
    transactions: Transaction[]
    fetchTransactions: (query?: string) => Promise<void>
    createTransaction: (data: CreateTransactionsInput) => Promise<void> //Adicionando nossa nova função global para todos os componentes
  }

  //Criação da função no Contexto Global
  async function createTransaction ({ type, price, category, description }: CreateTransactionsInput) {

    const response = await api.post('transactions', {
      type,
      price,
      category,
      description,
      createdAt: new Date(),
    })
    //Atualização do estado para refletir em todos os componentes da aplicação e evitar uma chamada desnecessária ao back-end
    setTransactions(state => [response.data, ...state])
  }
  ```


# Configurando axios

- `npm i axios`
- Arquivos de bibliotecas externas ficam em: /lib
  ```ts
  import axios from "axios";
  export const api = axios.create({
    baseURL: 'http://localhost:3333',
  })
  ```
- Subtituir função com axios: 
  ```ts
    async function fetchTransactions (query?: string) {
      const response = await api.get('transactions', {
        params: {
          q: query,
        }
      })
      setTransactions(response.data)
    }
  ```
  - Automaticamente converte nossa resposta em json

# 291 Corrigir erros de linting

- `npm i eslint @rocketseat/eslint-config -D`
- Criação do arquivo de eslint
  ```json
  {
    "extends": "@rocketseat/eslint-config/react"
  } 
  ```
- `npx eslint src --ext .tsx,.ts` Mostra todos os erros de lint
- `npx eslint src --ext .tsx,.ts --fix` Corrige todos os erros

# React Tools

- Components: DOM para React
  - Acesso por quem foi renderizado
  - Aos hooks do componente
  - Propriedades
- Settings > Highlight updates when components render
- Profiler
  - Permite gravar uma sequencia de ações e nos da todos os componentes que renderizaram pela ação.
    - Cinza nao renderizou
    - Com cores: renderizou
      - Verde: Rapido
      - Amarelo claro: Medio
      - Amarelo escuro: Ruim
      - Vermelho: Pessimo
  - Ativar record why each component rendered
  - Mostra o motivo da renderização.
- Quando um componente renderiza no react, todos os filhos dele renderizam também.
- Commits: Renderizações.

## Identificando problemas

- Quando realizamos a busca do dados fazemos uma alteração no estado global que está dentro de TransactionsProvider, como ele engloba todos os componentes, todos os filhos foram atualizados, gerando uma atualização em cascata.
- Componentes como TransactionsModal foram atualizados, mesmo que eles não dependem de transactions.

## Aplicando Context Selectors

- A unica informação que buscamos do contexto em NewTransactionModal é a função `createTransaction`, entretanto a informação que foi alterada no nosso contexto foi somente a lista de informações, o que significa que não era para o NewCreateTransaction ter renderizado novamente.
- O que acontece é que no React por padrão nós não conseguimos especificar para o componente utilizar como base de reload apenas a informação que ele pega, como no nosso exemplo o `createTransaction`. Independente de qual informação mudar no contexto todos os componentes que dependem de qualquer informação dele, mesmo que seja uma, vão ser renderizados novamente.
- Com a biblioteca useContextSelector nós conseguimos fazer com que o nosso componente renderize apenas quando realmente a informação que ele usa mudar.
- `npm i use-context-selector scheduler`
- Quando um componente é renderizado novamente todas as funções e variáveis são recriadas novamente em memória. Ou seja, quando o componente TransactionsProvider é renderizado novamente todas as função são atualizadas, logo quem utiliza elas também deve ser atualizado, dando a impressão de que o useContextSelector nao funcionou.
```js
  //Pegando apenas o necessário
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction
    },
  )
```

## useCallback

- Evita que alguma função seja recriada em memória se nenhuma informação de que aquela função dependa tenha mudado.
```ts
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
  }, [])
```
- Agora nosso componente de criação de transaction nao será mais renderizado por que a informação (estado) mudou, e sim por que o componente pai foi renderizado novamente, resolvendo um dos nossos erros.

## Usando memo

- Por que um componente renderiza?
  - Hooks changed (estado, contexto, reducer)
  - Props changed (mudou propriedades)
  - Parent rerendered (componente pai renderizou)
- Fluxo de renderização do componente (muito rápida):
  1. React recria o HTML da interface do componente.
  2. Compara a versão do HTML recriada com a versão anterior
  3. Caso alguma coisa tenha sido alterada ele reescreve o HTML na tela.
- Quanto maior o componente (quantidade de html retornado) mais será lento a comparação na etapa 2. Nesses casos podemos utilizar o memo
- Memo é uma função que usa em componentes para memorizar o componente
- Memo (Antes do fluxo):
  0. Mudou alguma coisa nos ``hooks``, `props` (deep comparision)?
  0.1 Comparar com a versão anterior dos hooks e props
  0.2 Se mudou algo, ele vai permitir a nova renderização, permitindo o prosseguimento do fluxo
  0.3 Caso nao tenha mudado ele não altera nada na interface. 
  ```ts
  export const SearchForm = memo(SearchFormComponent)
  ```
- Agora podemos ver que nosso search form não renderizou novamente pois ele percebeu que o nosso hook fetchTransactions não mudou, que é o que o SearchForm utiliza, compara com o hook e props anteriores fazendo com que o componente não seja renderizado novamente. 
- Comparação dos Hooks e props podem acabar sendo lentas. A deep comparasion pode ser custosa.

## useMemo

- Evitar que variaveis sejam recriadas em memória. Não vamos utilizar o memo para recriar todas as variaveis em memória, pois ele pode causar os mesmos problemas anteriores.
- Problemas de variaveis sendo recriadas em memória: caso a variável seja repassada entre componentes nós caimos em problemas de igualdade referencial, pois embora a variavel não tenha alterado o valor, quando ela é recriada ela ocupa um novo espaço de memória fazendo com que o React renderize novamente componentes que não precisavam de ser renderizados pois o valor da variavel nao mudou.
  ```ts
      import { useMemo } from 'react'
      import { TransactionsContext } from '../contexts/TransactionsContext'
      import { useContextSelector } from 'use-context-selector'

      export function useSummary() {
        const transactions = useContextSelector(TransactionsContext, (context) => {
          return context.transactions
        })
        // Variavel summary só será recriada quando de fato transactions for alterado, evitando que o summary seja recriado passando por calculo extenso novamente
        const summary = useMemo(
          () => {
            return transactions.reduce(
              (acc, transaction) => {
                if (transaction.type === 'income') {
                  acc.income += transaction.price
                  acc.total += transaction.price
                } else {
                  acc.outcome += transaction.price
                  acc.total -= transaction.price
                }

                return acc
              },
              { income: 0, outcome: 0, total: 0 },
            )
          },
          [transactions], // Variaveis externas do useMemo que estamos usando dentro
        )
        return summary
      }
  ```
- Nossa variavel summary estava sendo calculada toda vez do zero, mesmo que transactions nao tenha se alterado.