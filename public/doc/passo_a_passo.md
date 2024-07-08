# Criar o projeto
Para criar o de um projeto nextjs é necessário ter o [Node.js](https://nodejs.org/pt), cuja a versão seja no mínimo a 10.13, mas preefrêncialmente uma superir ou a mais recente.
Uma vez com o node instalado basta acessar o diretório onde deseja criar o projeto e executar o seguinte comando:
```sh
npx create-next-app@14 tradingview

cd tradingview
```

# Agora instalar os pacotes que serão utilizados
```sh
npm install axios apexcharts react-apexcharts

```
1. **Axios:** Para consumo de APIs externas;
2. **ApexCharts:** Para criação de gráficos;
3. **React ApexCharts:** Para facilitar a utilização do pacote anterior;
4. **React ApexCharts:** Para facilitar a utilização do pacote anterior.

# Iniciar o projeto
Com o projeto criado e as dependências instaladas basta usar o seguinte comando, caso esteja executando em ambiente de desenvolvimento mas não de produção:
```sh
npm run dev

```
Além desse temos os seguintes comandos:

1. **`run dev`**: Este comando inicia o Next.js em modo de desenvolvimento. Ele oferece recarga rápida do código, relatórios de erros e outras funcionalidades úteis durante o desenvolvimento. Para executá-lo, basta rodar `next dev` no terminal¹.

2. **`run build`**: O comando `next build` cria uma compilação otimizada da sua aplicação para uso em produção. Ele gera arquivos estáticos e informações sobre cada rota da aplicação¹.

3. **`run start`**: Após executar o `next build`, você pode iniciar o servidor de produção com o comando `next start`. Isso permite que sua aplicação seja acessada em um ambiente de produção¹.

4. **`run lint`**: O comando `next lint` executa o ESLint para todos os arquivos nos diretórios `/src`, `/app`, `/pages`, `/components` e `/lib`. Ele também oferece um guia para instalar as dependências necessárias caso o ESLint ainda não esteja configurado na sua aplicação¹. 

# Modelagem dos dados
Importante criar padrões para as informações que serão trabalhadas, para tanto, vamos criar um diretório `lib` dentro do caminho `src/app`, para primeira classe, uma estrutura de dados complexa, vamos criar dentro da pasta `lib` uma arquivo chamados `LinePoint.tsx`.
```tsx
// src/app/lib/LinePoint.tsx
export default class LinePoint {
    x: Date;
    y: number;

    constructor(timestamp: any, value: any) {
        // timestamp = eixo X do gráfico
        // value = eixo Y do gráfico
        this.x = new Date(timestamp);
        this.y = parseFloat(value);
    }
}
```
Também vamos criar a class `CandlePoint`:
```tsx
// src/app/lib/CandlePoint.tsx
export default class CandlePoint {
    x: Date;
    y: [number, number, number, number];

    constructor(openTime: string, open: string, high: string, low: string, close: string) {
        this.x = new Date(openTime);
        this.y = [parseFloat(open), parseFloat(high), parseFloat(low), parseFloat(close)];
    }

    getTime(): Date {
        return this.x;
    }

    getOpen(): number {
        return this.y[0];
    }

    getHigh(): number {
        return this.y[1];
    }

    getLow(): number {
        return this.y[2];
    }

    getClose(): number {
        return this.y[3];
    }
}
```

# Consumindo API
Para obter os dados da API da Binance, primeiro vamos criar um diretório `services` no caminho `src/app`, e dentro deste diretório o arquivo `DataService.js` com o seguinte conteúdo:
```tsx
// app/services/DataService.js
export async function getData(symbol = 'BTCUSDT', interval = '1m') {
    const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=60`);
    const candles = response.data.map(k => {
        return new CandlePoint(k[0], k[1], k[2], k[3], k[4])
    })

    const candlechart = new CandleChart(candles, TICK_SIZE);

    const supportTick = candlechart.findSupport();
    const support = [
        new LinePoint(response.data[0][0], parseFloat(supportTick.tick)),
        new LinePoint(response.data[response.data.length - 1][0], parseFloat(supportTick.tick))
    ];

    const resistanceTick = candlechart.findResistance();
    const resistance = [
        new LinePoint(response.data[0][0], parseFloat(resistanceTick.tick)),
        new LinePoint(response.data[response.data.length - 1][0], parseFloat(resistanceTick.tick))
    ];

    return {
        candles,
        support,
        resistance
    };
}
```
# Component Chart
Agora que já estamos obtendo os dados da Binance vamos criar um component de `Chart.tsx` para receber as informações e mostrar o 
gráfico de candles (velas).
Para isso vamos criar um diretório `components` e dentro dele um arquivo `Chart.tsx`

# Estrtura de arquivos
Estrutra criada desconsiderando o `node_modules` e utilizando do comando shell `tree -I 'node_modules'`:
```text
tradingview
    ├── README.md
    ├── next-env.d.ts
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   ├── next.svg
    │   └── vercel.svg
    ├── src
    │   └── app
    │       ├── components
    │       │   └── Chart.tsx
    │       ├── favicon.ico
    │       ├── globals.css
    │       ├── layout.tsx
    │       ├── lib
    │       │   ├── CandlePoint.tsx
    │       │   └── LinePoint.tsx
    │       ├── page.tsx
    │       └── services
    │           └── DataService.js
    ├── tailwind.config.ts
    └── tsconfig.json
```
# Referências:

 - [API Reference: Next.js CLI | Next.js](https://nextjs.org/docs/pages/api-reference/next-cli)
 - [Getting Started: Installation | Next.js](https://nextjs.org/docs/getting-started/installation)
 - [Understanding npm run dev command (with examples) | sebhastian](https://sebhastian.com/npm-run-dev/)
 - [Next.js 14.1 Dev Mode compilation extremely slow](https://stackoverflow.com/questions/77980237/next-js-14-1-dev-mode-compilation-extremely-slow)
 - [Configuring: ESLint | Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/eslint)
 - [Documentação Binance API](https://github.com/binance-exchange/binance-official-api-docs/)
 - [Documentação ApexCharts](https://apexcharts.com/docs/react-charts/)